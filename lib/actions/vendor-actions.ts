'use server'

import { revalidatePath } from 'next/cache'
import { supabaseVendorRepository } from '@/lib/repositories/supabase-vendor-repository'
import { supabaseBookingRepository, type BookingRequest } from '@/lib/repositories/supabase-booking-repository'
import { getCurrentUser } from '@/actions/auth/login'
import type { Vendor, ActionResult } from '@/types/domain'

// ============================================
// QUERY ACTIONS
// ============================================

/**
 * Get current vendor profile
 */
export async function getVendorProfile(): Promise<Vendor | null> {
    const user = await getCurrentUser()
    if (!user) return null

    return supabaseVendorRepository.findByUserId(user.id)
}

/**
 * Get vendor by ID
 */
export async function getVendor(id: string): Promise<Vendor | null> {
    return supabaseVendorRepository.findById(id)
}

/**
 * Get all vendors (for marketplace)
 */
export async function getVendors(): Promise<Vendor[]> {
    return supabaseVendorRepository.findMany()
}

/**
 * Search vendors
 */
export async function searchVendors(
    query: string,
    filters?: { category?: string; city?: string; priceRange?: string }
): Promise<Vendor[]> {
    return supabaseVendorRepository.search(query, filters as any)
}

/**
 * Get top rated vendors
 */
export async function getTopRatedVendors(limit?: number): Promise<Vendor[]> {
    return supabaseVendorRepository.findTopRated(limit)
}

/**
 * Get vendor dashboard stats
 */
export async function getVendorDashboardStats() {
    const user = await getCurrentUser()
    if (!user) return null

    const vendor = await supabaseVendorRepository.findByUserId(user.id)
    if (!vendor) return null

    const stats = await supabaseBookingRepository.getVendorStats(vendor.id)

    return {
        ...stats,
        vendor,
    }
}

/**
 * Get booking requests for current vendor
 */
export async function getVendorBookingRequests(): Promise<BookingRequest[]> {
    const user = await getCurrentUser()
    if (!user) return []

    const vendor = await supabaseVendorRepository.findByUserId(user.id)
    if (!vendor) return []

    return supabaseBookingRepository.findByVendorId(vendor.id)
}

/**
 * Get pending booking requests for current vendor
 */
export async function getPendingBookingRequests(): Promise<BookingRequest[]> {
    const user = await getCurrentUser()
    if (!user) return []

    const vendor = await supabaseVendorRepository.findByUserId(user.id)
    if (!vendor) return []

    return supabaseBookingRepository.findPendingByVendorId(vendor.id)
}

// ============================================
// MUTATION ACTIONS
// ============================================

/**
 * Update vendor profile
 */
export async function updateVendorProfile(data: Partial<Vendor>): Promise<ActionResult<Vendor>> {
    const user = await getCurrentUser()
    if (!user) {
        return { success: false, error: 'Not authenticated', code: 'UNAUTHORIZED' }
    }

    const vendor = await supabaseVendorRepository.findByUserId(user.id)
    if (!vendor) {
        return { success: false, error: 'Vendor profile not found', code: 'NOT_FOUND' }
    }

    const result = await supabaseVendorRepository.update(vendor.id, data)

    if (result.success) {
        revalidatePath('/vendor')
        revalidatePath('/vendor/profile')
    }

    return result
}

/**
 * Accept a booking request
 */
export async function acceptBookingRequest(
    requestId: string,
    quotedAmount?: number
): Promise<ActionResult<BookingRequest>> {
    const user = await getCurrentUser()
    if (!user) {
        return { success: false, error: 'Not authenticated', code: 'UNAUTHORIZED' }
    }

    const result = await supabaseBookingRepository.accept(requestId, quotedAmount)

    if (result.success) {
        revalidatePath('/vendor')
        revalidatePath('/vendor/bookings')
    }

    return result
}

/**
 * Decline a booking request
 */
export async function declineBookingRequest(requestId: string): Promise<ActionResult<BookingRequest>> {
    const user = await getCurrentUser()
    if (!user) {
        return { success: false, error: 'Not authenticated', code: 'UNAUTHORIZED' }
    }

    const result = await supabaseBookingRepository.decline(requestId)

    if (result.success) {
        revalidatePath('/vendor')
        revalidatePath('/vendor/bookings')
    }

    return result
}

/**
 * Submit a quote for a booking request
 */
export async function submitQuote(
    requestId: string,
    quotedAmount: number
): Promise<ActionResult<BookingRequest>> {
    const user = await getCurrentUser()
    if (!user) {
        return { success: false, error: 'Not authenticated', code: 'UNAUTHORIZED' }
    }

    const result = await supabaseBookingRepository.submitQuote(requestId, quotedAmount)

    if (result.success) {
        revalidatePath('/vendor')
        revalidatePath('/vendor/bookings')
    }

    return result
}
