'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { eventRepository } from '@/lib/repositories/event-repository'
import { EventDayDashboard } from '@/components/events/event-day-dashboard'
import { Loader2 } from 'lucide-react'
import type { Event } from '@/types/domain'

export default function ExecutePage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const [event, setEvent] = useState<Event | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadEvent = async () => {
            const data = await eventRepository.findById(id)
            if (!data) {
                router.push('/planner/events')
                return
            }
            setEvent(data)
            setLoading(false)
        }
        loadEvent()
    }, [id, router])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        )
    }

    if (!event) {
        return null
    }

    return <EventDayDashboard event={event} />
}
