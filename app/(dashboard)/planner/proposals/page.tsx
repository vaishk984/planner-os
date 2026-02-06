'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    FileText, Clock, Check, X, Send, History,
    ChevronRight, IndianRupee, AlertCircle, Lock,
    Search, Calendar, Users, MapPin, Utensils,
    Music, Sparkles, PartyPopper, Coffee, MessageCircle
} from 'lucide-react'
import Link from 'next/link'
import { MOCK_PROPOSALS, Proposal, EventTimelineItem } from '@/lib/types/proposal'

function getStatusColor(status: Proposal['status']) {
    switch (status) {
        case 'DRAFT': return 'bg-gray-100 text-gray-700'
        case 'SENT': return 'bg-blue-100 text-blue-700'
        case 'REVISION_REQUESTED': return 'bg-orange-100 text-orange-700'
        case 'APPROVED': return 'bg-green-100 text-green-700'
        case 'REJECTED': return 'bg-red-100 text-red-700'
    }
}

function getStatusLabel(status: Proposal['status']) {
    switch (status) {
        case 'DRAFT': return 'Draft'
        case 'SENT': return 'Sent to Client'
        case 'REVISION_REQUESTED': return 'Revision Requested'
        case 'APPROVED': return 'Approved ✓'
        case 'REJECTED': return 'Rejected'
    }
}

function getCategoryIcon(category: EventTimelineItem['category']) {
    switch (category) {
        case 'ceremony': return <Sparkles className="w-4 h-4" />
        case 'dining': return <Utensils className="w-4 h-4" />
        case 'entertainment': return <Music className="w-4 h-4" />
        case 'ritual': return <PartyPopper className="w-4 h-4" />
        default: return <Coffee className="w-4 h-4" />
    }
}

function getCategoryColor(category: EventTimelineItem['category']) {
    switch (category) {
        case 'ceremony': return 'bg-purple-100 text-purple-700 border-purple-200'
        case 'dining': return 'bg-amber-100 text-amber-700 border-amber-200'
        case 'entertainment': return 'bg-pink-100 text-pink-700 border-pink-200'
        case 'ritual': return 'bg-rose-100 text-rose-700 border-rose-200'
        default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
}

export default function ProposalsPage() {
    const [proposals] = useState(MOCK_PROPOSALS)
    const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState<'details' | 'timeline'>('details')

    // Stats
    const totalProposals = proposals.length
    const pendingProposals = proposals.filter(p => p.status === 'SENT' || p.status === 'REVISION_REQUESTED').length
    const approvedProposals = proposals.filter(p => p.status === 'APPROVED').length
    const totalRevenue = proposals.filter(p => p.status === 'APPROVED').reduce((sum, p) => sum + p.versions[p.currentVersion - 1].total, 0)

    const filteredProposals = proposals.filter(p =>
        p.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.clientName.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const currentVersion = selectedProposal ? selectedProposal.versions[selectedProposal.currentVersion - 1] : null

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Proposals</h1>
                    <p className="text-gray-500">Manage client proposals with event timelines</p>
                </div>
                <Link href="/planner/quotes">
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                        + New Proposal
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-blue-700">{totalProposals}</p>
                                <p className="text-sm text-blue-600">Total</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-orange-700">{pendingProposals}</p>
                                <p className="text-sm text-orange-600">Pending</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <Check className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-700">{approvedProposals}</p>
                                <p className="text-sm text-green-600">Approved</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                <IndianRupee className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-purple-700">₹{(totalRevenue / 100000).toFixed(1)}L</p>
                                <p className="text-sm text-purple-600">Revenue</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                    placeholder="Search by event or client name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Proposals List */}
                <div className="lg:col-span-1 space-y-3">
                    <h2 className="font-semibold text-gray-700">All Proposals</h2>
                    {filteredProposals.map((proposal) => (
                        <Card
                            key={proposal.id}
                            className={`cursor-pointer transition-all hover:shadow-md hover:border-indigo-300 ${selectedProposal?.id === proposal.id ? 'ring-2 ring-indigo-500 border-indigo-400' : ''
                                }`}
                            onClick={() => setSelectedProposal(proposal)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{proposal.eventName}</h3>
                                        <p className="text-sm text-gray-500">{proposal.clientName}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(proposal.status)}`}>
                                        {getStatusLabel(proposal.status)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    {proposal.eventDate && (
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {proposal.eventDate}
                                        </span>
                                    )}
                                    {proposal.guestCount && (
                                        <span className="flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            {proposal.guestCount}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between text-sm mt-2 pt-2 border-t">
                                    <div className="flex items-center gap-1 text-gray-500">
                                        <History className="w-4 h-4" />
                                        v{proposal.currentVersion}
                                    </div>
                                    <div className="flex items-center gap-1 font-semibold text-indigo-600">
                                        <IndianRupee className="w-4 h-4" />
                                        {proposal.versions[proposal.currentVersion - 1].total.toLocaleString('en-IN')}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Proposal Detail */}
                <div className="lg:col-span-2">
                    {selectedProposal && currentVersion ? (
                        <Card>
                            <CardHeader className="border-b">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            {selectedProposal.eventName}
                                            {selectedProposal.status === 'APPROVED' && (
                                                <Lock className="w-5 h-5 text-green-600" />
                                            )}
                                        </CardTitle>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                {selectedProposal.clientName}
                                            </span>
                                            {selectedProposal.venue && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    {selectedProposal.venue}
                                                </span>
                                            )}
                                            {selectedProposal.eventDate && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {selectedProposal.eventDate}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {selectedProposal.status !== 'APPROVED' && (
                                            <>
                                                <Button variant="outline" size="sm" className="gap-1">
                                                    <History className="w-4 h-4" /> New Version
                                                </Button>
                                                <Button size="sm" className="gap-1 bg-indigo-600 hover:bg-indigo-700">
                                                    <Send className="w-4 h-4" /> Send to Client
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Tabs */}
                                <div className="flex gap-4 mt-4">
                                    <button
                                        onClick={() => setActiveTab('details')}
                                        className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details'
                                            ? 'border-indigo-600 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Vendors & Pricing
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('timeline')}
                                        className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'timeline'
                                            ? 'border-indigo-600 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Event Timeline
                                    </button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                {activeTab === 'details' ? (
                                    <>
                                        {/* Vendor Items */}
                                        <div className="space-y-2 mb-6">
                                            {currentVersion.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <div className="font-medium text-gray-900">{item.vendorName}</div>
                                                        <div className="text-sm text-gray-500">{item.serviceName}</div>
                                                    </div>
                                                    <div className="font-semibold flex items-center">
                                                        <IndianRupee className="w-4 h-4" />
                                                        {item.price.toLocaleString('en-IN')}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Total */}
                                        <div className="pt-4 border-t flex items-center justify-between">
                                            <span className="text-lg font-semibold">Total</span>
                                            <span className="text-2xl font-bold text-indigo-600 flex items-center">
                                                <IndianRupee className="w-5 h-5" />
                                                {currentVersion.total.toLocaleString('en-IN')}
                                            </span>
                                        </div>

                                        {/* Post Approval Note */}
                                        {selectedProposal.postApprovalNote && (
                                            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                                <div className="flex items-start gap-3">
                                                    <MessageCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                                                    <div>
                                                        <p className="font-medium text-amber-800">After Approval</p>
                                                        <p className="text-sm text-amber-700 mt-1">{selectedProposal.postApprovalNote}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {/* Event Timeline */}
                                        {currentVersion.timeline && currentVersion.timeline.length > 0 ? (
                                            <div className="relative">
                                                <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-gray-200"></div>
                                                <div className="space-y-4">
                                                    {currentVersion.timeline.map((item, idx) => (
                                                        <div key={item.id} className="relative flex gap-4">
                                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 border-2 ${getCategoryColor(item.category)}`}>
                                                                {getCategoryIcon(item.category)}
                                                            </div>
                                                            <div className="flex-1 bg-white border rounded-lg p-4 shadow-sm">
                                                                <div className="flex items-start justify-between">
                                                                    <div>
                                                                        <p className="font-semibold text-gray-900">{item.title}</p>
                                                                        {item.description && (
                                                                            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                                                                        )}
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className="font-bold text-indigo-600">{item.time}</p>
                                                                        {item.duration && (
                                                                            <p className="text-xs text-gray-400">{item.duration}</p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 text-gray-500">
                                                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                                <p>No timeline added yet</p>
                                                <Button variant="outline" size="sm" className="mt-4">
                                                    + Add Event Timeline
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="h-full flex items-center justify-center min-h-[400px]">
                            <div className="text-center text-gray-500">
                                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>Select a proposal to view details</p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
