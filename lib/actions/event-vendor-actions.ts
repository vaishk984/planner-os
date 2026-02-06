/**
 * Event Vendor Actions (Server Actions)
 * 
 * Server-side actions for managing vendors in event plans.
 * Supports "Add to Plan" from showroom.
 * 
 * Based on: docs/ARCHITECTURE.md (Section 3.2)
 */

'use server'

import { supabaseEventVendorRepository as eventVendorRepository } from '@/lib/repositories/supabase-event-vendor-repository';
import { supabaseEventRepository as eventRepository } from '@/lib/repositories/supabase-event-repository';
import type { EventVendor, VendorCategory, ActionResult } from '@/types/domain';
import { revalidatePath } from 'next/cache';

/**
 * Add vendor to event plan from showroom
 */
export async function addVendorToEvent(
    eventId: string,
    vendorId: string,
    category: VendorCategory,
    price?: number,
    vendorDetails?: {
        name: string;
        imageUrl?: string;
    }
): Promise<ActionResult<EventVendor>> {
    // Verify event exists
    const event = await eventRepository.findById(eventId);
    if (!event) {
        return { success: false, error: 'Event not found', code: 'NOT_FOUND' };
    }

    // Check if event is locked
    if (event.status === 'approved' || event.status === 'live' || event.status === 'completed') {
        return { success: false, error: 'Event is locked. Cannot modify vendors.', code: 'LOCKED' };
    }

    const result = await eventVendorRepository.addVendorToEvent(
        eventId,
        vendorId,
        category,
        price,
        vendorDetails?.name
    );

    if (result.success) {
        revalidatePath(`/planner/events/${eventId}`);
        revalidatePath('/showroom');
    }

    return result;
}

/**
 * Remove vendor from event plan
 */
export async function removeVendorFromEvent(
    eventId: string,
    vendorId: string
): Promise<ActionResult<void>> {
    // Verify event exists and not locked
    const event = await eventRepository.findById(eventId);
    if (!event) {
        return { success: false, error: 'Event not found', code: 'NOT_FOUND' };
    }

    if (event.status === 'approved' || event.status === 'live' || event.status === 'completed') {
        return { success: false, error: 'Event is locked. Cannot modify vendors.', code: 'LOCKED' };
    }

    const result = await eventVendorRepository.removeFromEvent(eventId, vendorId);

    if (result.success) {
        revalidatePath(`/planner/events/${eventId}`);
    }

    return result;
}

/**
 * Get all vendors for an event
 */
export async function getEventVendors(eventId: string): Promise<EventVendor[]> {
    return eventVendorRepository.findByEventId(eventId);
}

/**
 * Update vendor status in event
 */
export async function updateEventVendorStatus(
    id: string,
    status: EventVendor['status']
): Promise<ActionResult<EventVendor>> {
    const result = await eventVendorRepository.updateStatus(id, status);

    if (result.success) {
        revalidatePath('/planner/events');
    }

    return result;
}

/**
 * Check if vendor is in event
 */
export async function isVendorInEvent(
    eventId: string,
    vendorId: string
): Promise<boolean> {
    return eventVendorRepository.isVendorInEvent(eventId, vendorId);
}
