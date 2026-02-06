'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    FileText, Send, Eye, Download, CheckCircle2, Clock,
    IndianRupee, Users, Calendar, Sparkles, ArrowRight, Loader2
} from 'lucide-react'
import Link from 'next/link'
import { eventRepository } from '@/lib/repositories/event-repository'
import type { Event } from '@/types/domain'

// Mock proposals data
const MOCK_PROPOSALS = [
    {
        id: 'proposal_1',
        name: 'Premium Package',
        status: 'sent',
        total: 1200000,
        createdAt: '2024-12-28',
        validUntil: '2025-01-10',
        viewedAt: '2024-12-29',
    },
    {
        id: 'proposal_2',
        name: 'Standard Package',
        status: 'draft',
        total: 800000,
        createdAt: '2024-12-30',
        validUntil: null,
        viewedAt: null,
    },
]

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'sent':
            return <Badge className="bg-blue-100 text-blue-700">Sent</Badge>
        case 'viewed':
            return <Badge className="bg-purple-100 text-purple-700">Viewed</Badge>
        case 'approved':
            return <Badge className="bg-green-100 text-green-700">Approved</Badge>
        case 'draft':
        default:
            return <Badge className="bg-gray-100 text-gray-700">Draft</Badge>
    }
}

export default function ProposalPage() {
    const params = useParams()
    const id = params.id as string

    const [event, setEvent] = useState<Event | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadEvent = async () => {
            const data = await eventRepository.findById(id)
            setEvent(data)
            setLoading(false)
        }
        loadEvent()
    }, [id])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-blue-700">{MOCK_PROPOSALS.length}</p>
                            <p className="text-sm text-blue-600">Total Proposals</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                            <Send className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-purple-700">
                                {MOCK_PROPOSALS.filter(p => p.status === 'sent').length}
                            </p>
                            <p className="text-sm text-purple-600">Sent to Client</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-700">0</p>
                            <p className="text-sm text-green-600">Approved</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Create New Proposal CTA */}
            <Card className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 border-0 text-white overflow-hidden">
                <CardContent className="py-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                            <Sparkles className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Create New Proposal</h3>
                            <p className="text-white/80 text-sm">Use the Proposal Builder to design packages</p>
                        </div>
                    </div>
                    <Link href={`/planner/events/${id}/builder`}>
                        <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90 font-bold shadow-lg">
                            Open Builder <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>

            {/* Proposals List */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">All Proposals</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {MOCK_PROPOSALS.map((proposal) => (
                            <div
                                key={proposal.id}
                                className="p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                            <FileText className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-medium">{proposal.name}</h4>
                                                {getStatusBadge(proposal.status)}
                                            </div>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <IndianRupee className="w-3 h-3" />
                                                    ₹{(proposal.total / 100000).toFixed(1)}L
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    Created {proposal.createdAt}
                                                </span>
                                                {proposal.viewedAt && (
                                                    <span className="flex items-center gap-1 text-purple-600">
                                                        <Eye className="w-3 h-3" />
                                                        Viewed {proposal.viewedAt}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link href={`/planner/events/${id}/proposal/${proposal.id}`}>
                                            <Button variant="outline" size="sm">
                                                <Eye className="w-4 h-4 mr-1" /> Preview
                                            </Button>
                                        </Link>
                                        {proposal.status === 'draft' ? (
                                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                                                <Send className="w-4 h-4 mr-1" /> Send
                                            </Button>
                                        ) : (
                                            <Button variant="outline" size="sm">
                                                <Download className="w-4 h-4 mr-1" /> PDF
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Empty State Hint */}
            {MOCK_PROPOSALS.length === 0 && (
                <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="font-medium text-gray-600 mb-2">No proposals yet</h3>
                    <p className="text-sm text-gray-500 mb-4">Create your first proposal using the builder</p>
                    <Link href={`/planner/events/${id}/builder`}>
                        <Button className="bg-purple-600 hover:bg-purple-700">
                            <Sparkles className="w-4 h-4 mr-2" /> Open Builder
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    )
}
