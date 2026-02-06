'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getUserId } from '@/lib/session'

// Simplified input handling
export async function createEvent(formData: FormData) {
    // Get current user ID from mock session
    const userId = await getUserId()

    if (!userId) {
        return { error: 'Not authenticated' }
    }

    // Extract form data
    const name = formData.get('name') as string
    const eventType = formData.get('eventType') as string
    const eventDate = formData.get('eventDate') as string
    const budget = formData.get('budget') ? Number(formData.get('budget')) : 0
    const guestCount = formData.get('guestCount') ? Number(formData.get('guestCount')) : 0

    // Construct venue string based on inputs
    const venueMode = formData.get('venueMode') as string
    let venue = formData.get('venue') as string // fallback

    if (venueMode === 'personal') {
        const address = formData.get('personalVenueAddress')
        const type = formData.get('personalVenueType')
        venue = `${address || ''} (${type || 'Private'})`
    } else if (venueMode === 'platform') {
        venue = "Platform Venue (Selection Pending)"
    } else if (formData.get('location')) {
        venue = formData.get('location') as string
    }

    const theme = formData.get('theme') as string
    const visionDescription = formData.get('visionDescription') as string
    const selectedPackage = formData.get('selectedPackage') as string

    // Log the data (Mock DB Insert)
    console.log('🚀 CREATE EVENT (MOCK):', {
        userId,
        name,
        eventType,
        eventDate,
        budget,
        guestCount,
        venue,
        theme,
        visionDescription,
        selectedPackage
    })

    // TODO: Re-enable Supabase insert when DB is ready
    /*
    const supabase = await createClient()
    const { data: event, error: eventError } = await supabase
        .from('events')
        .insert({
            planner_id: userId,
            name,
            event_type: eventType,
            event_date: eventDate,
            venue,
            budget,
            guest_count: guestCount,
            status: 'DRAFT',
        })
    */

    // Simulate success
    revalidatePath('/planner/events')
    redirect('/planner/events')
}
