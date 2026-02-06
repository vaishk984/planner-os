import { notFound } from 'next/navigation'
import { getPublicEvent, getPublicTimeline, getPublicBudget } from '@/actions/client-portal'
import { PublicEventView } from './public-event-view'
import { QuoteProvider } from '@/components/providers/quote-provider'

export default async function ClientPortalPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params

    const { data: event, error } = await getPublicEvent(token)

    if (error || !event) {
        notFound()
    }

    const [timeline, budget] = await Promise.all([
        getPublicTimeline(token),
        getPublicBudget(token)
    ])

    return (
        <QuoteProvider>
            <div className="min-h-screen bg-white">
                <header className="border-b py-4 bg-gray-50/50">
                    <div className="container mx-auto px-4 flex justify-between items-center">
                        <div className="font-bold text-xl text-gray-900">PlannerOS Client Portal</div>
                        <div className="text-sm text-gray-500">Secure Proposal View</div>
                    </div>
                </header>

                <PublicEventView
                    token={token}
                    event={event}
                    timeline={timeline} // timeline is { items, functions }
                    budget={budget}
                />

                <footer className="border-t py-8 mt-12 bg-gray-50">
                    <div className="container mx-auto px-4 text-center text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} PlannerOS. Secure Document Viewing.
                    </div>
                </footer>
            </div>
        </QuoteProvider>
    )
}
