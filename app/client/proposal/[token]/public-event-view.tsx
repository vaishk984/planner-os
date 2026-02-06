'use client'

import { useState } from 'react'
import { CalendarDays, MapPin, CheckCircle2, XCircle, Clock, IndianRupee, FileText } from 'lucide-react'
import { format } from 'date-fns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { updateProposalStatus } from '@/actions/client-portal'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

interface PublicEventViewProps {
    token: string
    event: any
    timeline: { items: any[], functions: any[] }
    budget: { totalEstimated: number, totalSpent: number, totalPaid: number }
}

export function PublicEventView({ token, event, timeline, budget }: PublicEventViewProps) {
    const [status, setStatus] = useState(event.proposal_status || 'draft')
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handleStatusUpdate = async (newStatus: 'approved' | 'declined') => {
        if (!confirm(`Are you sure you want to ${newStatus} this proposal?`)) return

        setLoading(true)
        const result = await updateProposalStatus(token, newStatus)
        setLoading(false)

        if (result.error) {
            toast({ title: 'Error', description: result.error, variant: 'destructive' })
        } else {
            setStatus(newStatus)
            toast({
                title: newStatus === 'approved' ? 'Proposal Approved!' : 'Proposal Declined',
                description: newStatus === 'approved' ? 'Thank you! We act on this immediately.' : 'We will be in touch.'
            })
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
    }

    return (
        <div className="container mx-auto max-w-4xl py-8 px-4">
            {/* Header */}
            <div className="mb-8 text-center space-y-4">
                <Badge variant="secondary" className="mb-2 uppercase tracking-wide">Event Proposal</Badge>
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">{event.name}</h1>
                <div className="flex justify-center items-center gap-6 text-gray-500">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="w-5 h-5" />
                        <span>{event.date ? format(new Date(event.date), 'MMMM d, yyyy') : 'Date TBD'}</span>
                    </div>
                    {event.location && (
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            <span>{event.location}</span>
                        </div>
                    )}
                </div>

                {/* Status Banner */}
                {status !== 'draft' && (
                    <div className={cn(
                        "mt-6 p-4 rounded-lg flex items-center justify-center gap-2 font-medium",
                        status === 'approved' ? "bg-green-50 text-green-700 border border-green-100" :
                            status === 'declined' ? "bg-red-50 text-red-700 border border-red-100" :
                                "bg-blue-50 text-blue-700"
                    )}>
                        {status === 'approved' ? <CheckCircle2 className="w-5 h-5" /> :
                            status === 'declined' ? <XCircle className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                        Proposal status: <span className="uppercase font-bold">{status}</span>
                    </div>
                )}
            </div>

            <Tabs defaultValue="proposal" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="proposal">Proposal & Summary</TabsTrigger>
                    <TabsTrigger value="timeline">Itinerary (Run Sheet)</TabsTrigger>
                    <TabsTrigger value="budget">Estimated Budget</TabsTrigger>
                </TabsList>

                {/* PROPOSAL TAB */}
                <TabsContent value="proposal" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Event Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="prose max-w-none text-gray-600">
                                <p>{event.description || "No detailed description provided."}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Event Type</p>
                                    <p className="text-lg font-medium capitalize">{event.event_type || 'General Event'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Guest Count</p>
                                    <p className="text-lg font-medium">--</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {status === 'sent' || status === 'draft' ? (
                        <Card className="border-indigo-100 bg-indigo-50/50">
                            <CardHeader>
                                <CardTitle>Action Required</CardTitle>
                                <CardDescription>Please review the details and approve to proceed.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex gap-4">
                                <Button
                                    size="lg"
                                    className="bg-green-600 hover:bg-green-700 w-full"
                                    onClick={() => handleStatusUpdate('approved')}
                                    disabled={loading}
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Approve Proposal
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 w-full"
                                    onClick={() => handleStatusUpdate('declined')}
                                    disabled={loading}
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Decline / Request Changes
                                </Button>
                            </CardContent>
                        </Card>
                    ) : null}
                </TabsContent>

                {/* TIMELINE TAB */}
                <TabsContent value="timeline">
                    <Card>
                        <CardHeader>
                            <CardTitle>Event Schedule</CardTitle>
                            <CardDescription>Proposed timeline for the event.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                {(timeline.functions.length > 0 ? timeline.functions : [{ id: 'default', name: 'Main Event' }]).map(func => {
                                    const items = timeline.items.filter(t => (t.function_id === func.id) || (!t.function_id && func.id === 'default'))
                                    if (items.length === 0) return null

                                    return (
                                        <div key={func.id} className="space-y-4">
                                            <h3 className="font-semibold text-lg text-indigo-900 border-b pb-2 flex items-center gap-2">
                                                <CalendarDays className="w-4 h-4" />
                                                {func.name}
                                                {func.date && <span className="text-sm font-normal text-gray-500 ml-2">({format(new Date(func.date), 'MMM d')})</span>}
                                            </h3>
                                            <div className="space-y-4 pl-4 border-l-2 border-indigo-100 ml-2">
                                                {items.map(item => (
                                                    <div key={item.id} className="relative pl-6 pb-2">
                                                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-indigo-400" />
                                                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                                                            <span className="font-bold text-indigo-600 w-20 flex-shrink-0">
                                                                {item.start_time.slice(0, 5)}
                                                            </span>
                                                            <div>
                                                                <p className="font-medium text-gray-900">{item.title}</p>
                                                                {item.description && <p className="text-sm text-gray-500">{item.description}</p>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })}
                                {timeline.items.length === 0 && (
                                    <p className="text-center text-muted-foreground py-8">No timeline items scheduled yet.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* BUDGET TAB */}
                <TabsContent value="budget">
                    <Card>
                        <CardHeader>
                            <CardTitle>Estimated Budget</CardTitle>
                            <CardDescription>Estimated costs breakdown.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8 bg-gray-50 rounded-lg mb-6">
                                <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">Total Estimated</p>
                                <p className="text-4xl font-bold text-gray-900">{formatCurrency(budget.totalEstimated)}</p>
                            </div>
                            <div className="text-sm text-center text-gray-500 italic">
                                * Detailed breakdown is available upon request.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
