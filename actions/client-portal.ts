'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Public Actions - No user authentication check (handled by RPC and Security Definer)

export async function getPublicEvent(token: string) {
    const supabase = await createClient()
    const { data, error } = await supabase.rpc('get_public_event', { token_input: token })

    if (error) {
        console.error('getPublicEvent error:', error)
        return { error: 'Failed to find event' }
    }

    // RPC 'get_public_event' returns SETOF events, so it's an array. Take first.
    if (!data || data.length === 0) {
        return { error: 'Invalid token or event not found' }
    }

    return { data: data[0] }
}

export async function getPublicTimeline(token: string) {
    const supabase = await createClient()
    const { data: timeline, error: timelineError } = await supabase.rpc('get_public_timeline', { token_input: token })
    const { data: functions, error: functionsError } = await supabase.rpc('get_public_functions', { token_input: token })

    if (timelineError || functionsError) {
        console.error('getPublicTimeline error:', timelineError || functionsError)
        return { items: [], functions: [] }
    }


    return {
        items: timeline || [],
        functions: functions || []
    }
}

export async function getPublicBudget(token: string) {
    const supabase = await createClient()
    const { data, error } = await supabase.rpc('get_public_budget', { token_input: token })

    if (error) {
        console.error('getPublicBudget error:', error)
        return { totalEstimated: 0, totalSpent: 0, totalPaid: 0 }
    }

    // RPC returns a row
    return data && data[0] ? data[0] : { totalEstimated: 0, totalSpent: 0, totalPaid: 0 }
}

export async function updateProposalStatus(token: string, status: 'approved' | 'declined') {
    const supabase = await createClient()
    const { data, error } = await supabase.rpc('update_proposal_status', {
        token_input: token,
        status_input: status
    })

    if (error) {
        console.error('updateProposalStatus error:', error)
        return { error: 'Failed to update status' }
    }

    revalidatePath(`/client/${token}`)
    return { success: true }
}

export async function generateProposalToken(eventId: string) {
    const supabase = await createClient()
    const token = `prop_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 6)}`

    const { error } = await supabase
        .from('events')
        .update({
            public_token: token,
            proposal_status: 'sent', // Update status too
            updated_at: new Date().toISOString()
        })
        .eq('id', eventId)

    if (error) {
        console.error('Error generating token:', error)
        return { error: 'Failed to generate proposal link' }
    }

    return { token }
}

export async function getPublicProposalDetails(token: string) {
    const supabase = await createClient()

    // 1. Get Event from token
    const { data: events, error: eventError } = await supabase
        .from('events')
        .select(`
            *,
            planner:user_profiles!planner_id (
                full_name,
                email,
                phone_number,
                company_name
            )
        `)
        .eq('public_token', token)
        .single()

    if (eventError || !events) {
        console.error('Error fetching proposal event:', eventError)
        return { error: 'Proposal not found' }
    }

    const eventId = events.id

    // 2. Get Booking Requests (Vendors)
    const { data: requests, error: requestsError } = await supabase
        .from('booking_requests')
        .select('*')
        .eq('event_id', eventId)
        .neq('status', 'declined') // Show pending, accepted, quoted

    // 3. Get Intake (for style preferences etc if needed, skipping for now)

    // Map to proposal format
    const categories = (requests || []).map(req => ({
        id: req.service?.toLowerCase() || 'other',
        name: req.service || 'Service',
        icon: req.service?.toLowerCase().includes('photo') ? 'Camera' :
            req.service?.toLowerCase().includes('food') || req.service?.toLowerCase().includes('cater') ? 'UtensilsCrossed' :
                req.service?.toLowerCase().includes('decor') ? 'Sparkles' :
                    req.service?.toLowerCase().includes('venue') ? 'Building2' :
                        'Sparkles', // fallback
        vendor: {
            name: req.vendor_name || 'Selected Vendor', // You might need to join vendors table if vendor_name isn't in booking_requests
            rating: 4.8 // Mock rating or fetch from vendor
        },
        price: req.quoted_amount || req.budget || 0,
        items: req.requirements ? [req.requirements] : ['Service as per discussion']
    }))

    // Map timeline (skipping for now or mock)
    const timeline = [
        { id: 't1', time: 'TBD', title: 'Event Start', category: 'ceremony', duration: '1 hour' }
    ]

    return {
        proposal: {
            id: events.id,
            eventName: events.name,
            eventType: events.type,
            clientName: events.client_name,
            date: events.date,
            venue: events.venue_name,
            city: events.city,
            guestCount: events.guest_count,
            plannerName: events.planner?.company_name || events.planner?.full_name || 'Event Planner',
            plannerPhone: events.planner?.phone_number || '',
            plannerEmail: events.planner?.email || '',
            validUntil: new Date(new Date(events.updated_at).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days validity default
            status: events.proposal_status || 'pending',
            personalMessage: events.notes || 'Here is your event proposal.',
            categories: categories,
            timeline: timeline
        }
    }
}
