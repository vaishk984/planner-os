'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    ChevronLeft, ChevronRight, Calendar as CalendarIcon,
    MapPin, Clock, Plus, X
} from 'lucide-react'

// Mock calendar data
const EVENTS = [
    { id: 1, date: '2025-01-15', title: 'Sharma Wedding', venue: 'Royal Heritage Palace', time: '10:00 AM - 10:00 PM', status: 'confirmed' },
    { id: 2, date: '2025-01-22', title: 'Patel Engagement', venue: 'Garden View Resorts', time: '6:00 PM - 11:00 PM', status: 'confirmed' },
    { id: 3, date: '2025-02-05', title: 'Gupta Anniversary', venue: 'Hotel Grand', time: '7:00 PM - 11:00 PM', status: 'pending' },
    { id: 4, date: '2025-02-20', title: 'Mehta Wedding', venue: 'Taj Palace', time: 'Full Day', status: 'pending' },
]

const BLOCKED_DATES = ['2025-01-18', '2025-01-19', '2025-02-14']

export default function VendorCalendarPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date(2025, 0, 1)) // January 2025

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const daysInMonth = lastDay.getDate()
        const startingDay = firstDay.getDay()

        return { daysInMonth, startingDay }
    }

    const { daysInMonth, startingDay } = getDaysInMonth(currentMonth)

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
    }

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
    }

    const formatDateKey = (day: number) => {
        const month = String(currentMonth.getMonth() + 1).padStart(2, '0')
        const dayStr = String(day).padStart(2, '0')
        return `${currentMonth.getFullYear()}-${month}-${dayStr}`
    }

    const getEventForDate = (day: number) => {
        const dateKey = formatDateKey(day)
        return EVENTS.find(e => e.date === dateKey)
    }

    const isBlocked = (day: number) => {
        const dateKey = formatDateKey(day)
        return BLOCKED_DATES.includes(dateKey)
    }

    const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

    // Get upcoming events
    const upcomingEvents = EVENTS.filter(e => new Date(e.date) >= new Date()).slice(0, 3)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Calendar</h2>
                    <p className="text-gray-500">Manage your availability and view bookings</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" /> Block Dates
                </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>{monthName}</CardTitle>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" onClick={prevMonth}>
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={nextMonth}>
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Day Headers */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {/* Empty cells for days before month starts */}
                            {Array.from({ length: startingDay }).map((_, i) => (
                                <div key={`empty-${i}`} className="aspect-square" />
                            ))}

                            {/* Days of the month */}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1
                                const event = getEventForDate(day)
                                const blocked = isBlocked(day)

                                return (
                                    <div
                                        key={day}
                                        className={`
                                            aspect-square border rounded-lg p-1 text-sm cursor-pointer
                                            transition-all hover:shadow-md
                                            ${event ? 'bg-blue-50 border-blue-200' : ''}
                                            ${blocked ? 'bg-red-50 border-red-200' : ''}
                                            ${!event && !blocked ? 'hover:bg-gray-50' : ''}
                                        `}
                                    >
                                        <div className="font-medium text-gray-700">{day}</div>
                                        {event && (
                                            <div className={`
                                                mt-1 text-xs truncate px-1 py-0.5 rounded
                                                ${event.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}
                                            `}>
                                                {event.title.split(' ')[0]}
                                            </div>
                                        )}
                                        {blocked && (
                                            <div className="mt-1 text-xs text-red-600 flex items-center gap-0.5">
                                                <X className="w-3 h-3" /> Blocked
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-6 mt-4 pt-4 border-t text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-green-100 border border-green-300" />
                                <span className="text-gray-600">Confirmed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-amber-100 border border-amber-300" />
                                <span className="text-gray-600">Pending</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-red-100 border border-red-300" />
                                <span className="text-gray-600">Blocked</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Upcoming Events */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 text-blue-600" />
                            Upcoming Events
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {upcomingEvents.map(event => (
                            <div key={event.id} className="p-3 rounded-lg border hover:shadow-sm transition-shadow">
                                <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                                    <Badge className={
                                        event.status === 'confirmed'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-amber-100 text-amber-700'
                                    }>
                                        {event.status}
                                    </Badge>
                                </div>
                                <div className="space-y-1 text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4" />
                                        {event.date}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        {event.time}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        {event.venue}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
