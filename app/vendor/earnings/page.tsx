'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    IndianRupee, TrendingUp, ArrowUpRight, ArrowDownRight, Calendar,
    Download, Filter, CheckCircle2, Clock, Building2
} from 'lucide-react'

// Mock earnings data
const MONTHLY_EARNINGS = [
    { month: 'Jan 2025', amount: 285000, events: 4 },
    { month: 'Dec 2024', amount: 220000, events: 3 },
    { month: 'Nov 2024', amount: 180000, events: 3 },
    { month: 'Oct 2024', amount: 350000, events: 5 },
    { month: 'Sep 2024', amount: 275000, events: 4 },
    { month: 'Aug 2024', amount: 190000, events: 3 },
]

const RECENT_PAYMENTS = [
    {
        id: 1,
        eventName: 'Sharma Wedding',
        amount: 120000,
        date: '2024-12-28',
        status: 'received',
        venue: 'Royal Heritage Palace'
    },
    {
        id: 2,
        eventName: 'Corporate Event',
        amount: 50000,
        date: '2024-12-25',
        status: 'received',
        venue: 'Convention Center'
    },
    {
        id: 3,
        eventName: 'Patel Engagement',
        amount: 45000,
        date: '2025-01-22',
        status: 'pending',
        venue: 'Garden View Resorts'
    },
    {
        id: 4,
        eventName: 'Anniversary Party',
        amount: 35000,
        date: '2025-02-05',
        status: 'pending',
        venue: 'Hotel Grand'
    },
]

const STATS = {
    thisMonth: 285000,
    lastMonth: 220000,
    totalEarnings: 2850000,
    pendingPayments: 80000,
    completedEvents: 156,
    avgPerEvent: 18269,
}

export default function VendorEarningsPage() {
    const [filter, setFilter] = useState('all')

    const growthPercent = Math.round(((STATS.thisMonth - STATS.lastMonth) / STATS.lastMonth) * 100)

    const filteredPayments = filter === 'all'
        ? RECENT_PAYMENTS
        : RECENT_PAYMENTS.filter(p => p.status === filter)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Earnings</h2>
                    <p className="text-gray-500">Track your income and payment history</p>
                </div>
                <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" /> Download Report
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-white/80">This Month</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">₹{(STATS.thisMonth / 1000).toFixed(0)}K</div>
                        <div className="flex items-center gap-1 mt-2 text-sm text-white/80">
                            {growthPercent > 0 ? (
                                <>
                                    <ArrowUpRight className="w-4 h-4" />
                                    <span>+{growthPercent}% vs last month</span>
                                </>
                            ) : (
                                <>
                                    <ArrowDownRight className="w-4 h-4" />
                                    <span>{growthPercent}% vs last month</span>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Pending Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-amber-600">₹{(STATS.pendingPayments / 1000).toFixed(0)}K</div>
                        <p className="text-xs text-gray-500 mt-2">2 payments awaiting</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Earnings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">₹{(STATS.totalEarnings / 100000).toFixed(1)}L</div>
                        <p className="text-xs text-gray-500 mt-2">{STATS.completedEvents} events</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Avg. Per Event</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">₹{(STATS.avgPerEvent / 1000).toFixed(0)}K</div>
                        <p className="text-xs text-gray-500 mt-2">
                            <TrendingUp className="w-3 h-3 inline mr-1 text-green-500" />
                            Growing steadily
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Monthly Breakdown */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Monthly Breakdown</CardTitle>
                        <CardDescription>Last 6 months</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {MONTHLY_EARNINGS.map((month, idx) => (
                            <div
                                key={month.month}
                                className={`flex items-center justify-between p-3 rounded-lg ${idx === 0 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}
                            >
                                <div>
                                    <p className={`font-medium ${idx === 0 ? 'text-green-700' : 'text-gray-700'}`}>
                                        {month.month}
                                    </p>
                                    <p className="text-xs text-gray-500">{month.events} events</p>
                                </div>
                                <p className={`font-bold ${idx === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                    ₹{(month.amount / 1000).toFixed(0)}K
                                </p>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Recent Payments */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Payment History</CardTitle>
                                <CardDescription>Recent transactions</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant={filter === 'all' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setFilter('all')}
                                >
                                    All
                                </Button>
                                <Button
                                    variant={filter === 'received' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setFilter('received')}
                                    className={filter === 'received' ? 'bg-green-600' : ''}
                                >
                                    Received
                                </Button>
                                <Button
                                    variant={filter === 'pending' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setFilter('pending')}
                                    className={filter === 'pending' ? 'bg-amber-600' : ''}
                                >
                                    Pending
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {filteredPayments.map(payment => (
                                <div
                                    key={payment.id}
                                    className="flex items-center justify-between p-4 rounded-lg border hover:shadow-sm transition-shadow"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${payment.status === 'received' ? 'bg-green-100' : 'bg-amber-100'
                                            }`}>
                                            {payment.status === 'received'
                                                ? <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                : <Clock className="w-5 h-5 text-amber-600" />
                                            }
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">{payment.eventName}</h4>
                                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Building2 className="w-3 h-3" />
                                                    {payment.venue}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {payment.date}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-gray-900">
                                            ₹{(payment.amount / 1000).toFixed(0)}K
                                        </p>
                                        <Badge className={
                                            payment.status === 'received'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-amber-100 text-amber-700'
                                        }>
                                            {payment.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
