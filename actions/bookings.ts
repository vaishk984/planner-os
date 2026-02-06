'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { BookingRequest } from '@/src/backend/entities/BookingRequest'

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const createBookingSchema = z.object({
    eventId: z.string().uuid(),
    vendorId: z.string().uuid(),
    serviceCategory: z.string().min(1, "Category is required"),
    serviceDetails: z.string().optional(),
    status: z.enum([
        'draft', 'quote_requested', 'quote_received', 'negotiating',
        'confirmed', 'deposit_paid', 'in_progress', 'completed',
        'cancelled', 'declined'
    ]).optional().default('draft'),
    notes: z.string().optional(),
})

// ============================================================================
// CRUD OPERATIONS
// ============================================================================

/**
 * Get all booking requests for an event
 */
export async function getEventBookings(eventId: string) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) return { error: 'Unauthorized' }

        // Fetch bookings with vendor details
        const { data, error } = await supabase
            .from('booking_requests')
            .select(`
                *,
                vendors (
                    id, company_name, category, contact_name, email, phone, location
                )
            `)
            .eq('event_id', eventId)
            .eq('planner_id', user.id)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching bookings:', error)
            return { error: 'Failed to fetch bookings' }
        }

        // We return the raw data augmented with vendor info because Entity doesn't store vendor details directly
        // Or we can map to Entity and attach vendor info separately.
        // For simplicity in list view, let's return a composite object.
        return { data: data }
    } catch (error) {
        console.error('Unexpected error in getEventBookings:', error)
        return { error: 'An unexpected error occurred' }
    }
}

/**
 * Create a new booking request (Assign vendor to event)
 */
export async function createBookingRequest(formData: FormData) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) return { error: 'Unauthorized' }

        const rawData = {
            eventId: formData.get('eventId'),
            vendorId: formData.get('vendorId'),
            serviceCategory: formData.get('serviceCategory'),
            serviceDetails: formData.get('serviceDetails'),
            notes: formData.get('notes'),
            status: formData.get('status') || 'draft',
        }

        const validation = createBookingSchema.safeParse(rawData)
        if (!validation.success) {
            return { error: validation.error.issues[0].message }
        }

        const validData = validation.data

        const { data, error } = await supabase
            .from('booking_requests')
            .insert({
                event_id: validData.eventId,
                vendor_id: validData.vendorId,
                planner_id: user.id,
                service_category: validData.serviceCategory,
                service_details: validData.serviceDetails || null,
                notes: validData.notes || null,
                status: validData.status,
                payment_schedule: '[]' // Initialize empty schedule
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating booking:', error)
            return { error: 'Failed to assign vendor' }
        }

        revalidatePath(`/planner/events/${validData.eventId}/vendors`)
        return { success: true, data: BookingRequest.fromRow(data).toJSON() }
    } catch (error) {
        console.error('Unexpected error in createBookingRequest:', error)
        return { error: 'An unexpected error occurred' }
    }
}

/**
 * Update booking status
 */
export async function updateBookingStatus(formData: FormData) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) return { error: 'Unauthorized' }

        const id = formData.get('id') as string
        const status = formData.get('status') as string
        const eventId = formData.get('eventId') as string

        if (!id || !status) return { error: 'Invalid parameters' }

        const { error } = await supabase
            .from('booking_requests')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id)
            .eq('planner_id', user.id)

        if (error) {
            console.error('Error updating status:', error)
            return { error: 'Failed to update status' }
        }

        revalidatePath(`/planner/events/${eventId}/vendors`)
        return { success: true }
    } catch (error) {
        console.error('Unexpected error in updateBookingStatus:', error)
        return { error: 'An unexpected error occurred' }
    }
}
