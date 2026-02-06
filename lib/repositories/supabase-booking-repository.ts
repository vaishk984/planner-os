/**
 * Supabase Booking Repository
 * 
 * Production-ready booking request repository backed by Supabase.
 */

import { SupabaseBaseRepository } from './supabase-base-repository'
import type { ActionResult } from '@/types/domain'

// Booking status type
export type BookingStatus =
    | 'pending'
    | 'quoted'
    | 'accepted'
    | 'declined'
    | 'completed'
    | 'cancelled'

// Booking request interface
export interface BookingRequest {
    id: string
    eventId: string
    vendorId: string
    plannerId: string

    // Event details (denormalized for quick access)
    eventName: string
    eventDate: string
    city: string
    venue: string
    guestCount: number

    // Service details
    service: string // Photography, Catering, etc.
    requirements?: string

    // Pricing
    budget: number
    quotedAmount?: number

    // Status
    status: BookingStatus

    // Timestamps
    createdAt: string
    updatedAt: string
    quotedAt?: string
    respondedAt?: string
}

class SupabaseBookingRepositoryClass extends SupabaseBaseRepository<BookingRequest> {
    protected tableName = 'booking_requests'
    protected entityName = 'booking'

    /**
     * Find bookings for a vendor with event details
     */
    async findByVendorId(vendorId: string): Promise<BookingRequest[]> {
        const supabase = await this.getClient()

        const { data, error } = await supabase
            .from(this.tableName)
            .select(`
                *,
                events (
                    id,
                    name,
                    event_date,
                    city,
                    guest_count
                )
            `)
            .eq('vendor_id', vendorId)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching vendor bookings:', error)
            return []
        }

        // Transform to include event details
        return (data || []).map((row: any) => {
            const booking = this.fromDb(row) as any
            return {
                ...booking,
                eventName: row.events?.name || 'Unknown Event',
                eventDate: row.events?.event_date || '',
                city: row.events?.city || '',
                venue: 'TBD', // Venue column doesn't exist on events table
                guestCount: row.events?.guest_count || 0,
            }
        })
    }

    /**
     * Find pending bookings for a vendor with event details
     */
    async findPendingByVendorId(vendorId: string): Promise<BookingRequest[]> {
        const supabase = await this.getClient()

        const { data, error } = await supabase
            .from(this.tableName)
            .select(`
                *,
                events (
                    id,
                    name,
                    event_date,
                    city,
                    guest_count
                )
            `)
            .eq('vendor_id', vendorId)
            .in('status', ['draft', 'quote_requested', 'pending'])
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching pending vendor bookings:', error)
            return []
        }

        // Transform to include event details
        return (data || []).map((row: any) => {
            const booking = this.fromDb(row) as any
            return {
                ...booking,
                eventName: row.events?.name || 'Unknown Event',
                eventDate: row.events?.event_date || '',
                city: row.events?.city || '',
                venue: 'TBD', // Venue column doesn't exist on events table
                guestCount: row.events?.guest_count || 0,
            }
        })
    }

    /**
     * Find bookings for an event
     */
    async findByEventId(eventId: string): Promise<BookingRequest[]> {
        const supabase = await this.getClient()

        const { data, error } = await supabase
            .from(this.tableName)
            .select('*')
            .eq('event_id', eventId)
            .order('created_at', { ascending: false })

        if (error) return []
        return this.fromDbArray(data || [])
    }

    /**
     * Accept a booking request
     */
    async accept(id: string, quotedAmount?: number): Promise<ActionResult<BookingRequest>> {
        return this.update(id, {
            status: 'accepted',
            quotedAmount,
            respondedAt: new Date().toISOString()
        } as Partial<BookingRequest>)
    }

    /**
     * Decline a booking request
     */
    async decline(id: string): Promise<ActionResult<BookingRequest>> {
        return this.update(id, {
            status: 'declined',
            respondedAt: new Date().toISOString()
        } as Partial<BookingRequest>)
    }

    /**
     * Submit a quote
     */
    async submitQuote(id: string, quotedAmount: number): Promise<ActionResult<BookingRequest>> {
        return this.update(id, {
            status: 'quoted',
            quotedAmount,
            quotedAt: new Date().toISOString()
        } as Partial<BookingRequest>)
    }

    /**
     * Get vendor statistics
     */
    async getVendorStats(vendorId: string): Promise<{
        pending: number
        accepted: number
        completed: number
        totalEarnings: number
    }> {
        const supabase = await this.getClient()

        const stats = {
            pending: 0,
            accepted: 0,
            completed: 0,
            totalEarnings: 0,
        }

        // Count by status
        const { data: statusData } = await supabase
            .from(this.tableName)
            .select('status')
            .eq('vendor_id', vendorId)

        if (statusData) {
            statusData.forEach((r: any) => {
                if (r.status === 'pending' || r.status === 'draft' || r.status === 'quote_requested') stats.pending++
                if (r.status === 'accepted' || r.status === 'confirmed') stats.accepted++
                if (r.status === 'completed') stats.completed++
            })
        }

        // Sum earnings from completed bookings
        const { data: earningsData } = await supabase
            .from(this.tableName)
            .select('quoted_amount')
            .eq('vendor_id', vendorId)
            .eq('status', 'completed')

        if (earningsData) {
            stats.totalEarnings = earningsData.reduce(
                (sum: number, r: any) => sum + (r.quoted_amount || 0),
                0
            )
        }

        return stats
    }
}

// Export singleton instance
export const supabaseBookingRepository = new SupabaseBookingRepositoryClass()
