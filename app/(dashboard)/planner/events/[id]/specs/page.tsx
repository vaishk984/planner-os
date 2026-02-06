'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Building2, UtensilsCrossed, Camera, Sparkles, Music, Brush, Car,
    Plus, Trash2, Save, ChevronDown, ChevronUp, Users, Clock,
    Flower2, Armchair, Gift, Shield, Hotel, FileText, Heart,
    Wine, Loader2, Search, ChevronRight, ChevronsUpDown, Info
} from 'lucide-react'
import { eventRepository } from '@/lib/repositories/event-repository'
import { getSpecsForEventType, type CategorySpec, type SpecItem } from '@/lib/templates/event-specs-templates'
import type { Event } from '@/types/domain'

// Templates are loaded dynamically from event-specs-templates.ts based on event type
// Color utility for category styling
const _UNUSED: CategorySpec[] = [
    {
        id: 'venue',
        name: 'Venue',
        icon: Building2,
        color: 'blue',
        vendor: 'Royal Heritage Palace',
        items: [
            { id: 'v1', name: 'Main Hall Booking', quantity: 1, unit: 'day', unitPrice: 500000 },
            { id: 'v2', name: 'Garden Area', quantity: 1, unit: 'day', unitPrice: 200000 },
            { id: 'v3', name: 'Bridal Suite', quantity: 1, unit: 'room', unitPrice: 50000 },
            { id: 'v4', name: 'Parking Slots', quantity: 100, unit: 'cars', unitPrice: 500 },
            { id: 'v5', name: 'Generator Backup', quantity: 2, unit: 'units', notes: 'Included' },
            { id: 'v6', name: 'Air Conditioning', quantity: 8, unit: 'hours', notes: 'Included' },
        ]
    },
    {
        id: 'catering',
        name: 'Catering',
        icon: UtensilsCrossed,
        color: 'amber',
        vendor: 'Spice Symphony Caterers',
        items: [
            { id: 'c1', name: 'Guest Plates (Veg)', quantity: 250, unit: 'plates', unitPrice: 850 },
            { id: 'c2', name: 'Guest Plates (Non-Veg)', quantity: 100, unit: 'plates', unitPrice: 1100 },
            { id: 'c3', name: 'Live Chaat Counter', quantity: 1, unit: 'counter', unitPrice: 15000 },
            { id: 'c4', name: 'Live Pasta Counter', quantity: 1, unit: 'counter', unitPrice: 18000 },
            { id: 'c5', name: 'Live Dosa Counter', quantity: 1, unit: 'counter', unitPrice: 12000 },
            { id: 'c6', name: 'Servers', quantity: 25, unit: 'staff', unitPrice: 1500 },
            { id: 'c7', name: 'F&B Managers', quantity: 5, unit: 'staff', unitPrice: 3000 },
            { id: 'c8', name: 'Welcome Drinks Station', quantity: 2, unit: 'stations', unitPrice: 10000 },
            { id: 'c9', name: 'Dessert Counter', quantity: 1, unit: 'counter', unitPrice: 20000 },
            { id: 'c10', name: 'Ice Cream Station', quantity: 1, unit: 'station', unitPrice: 15000 },
        ]
    },
    {
        id: 'bar',
        name: 'Bar & Beverages',
        icon: Wine,
        color: 'purple',
        vendor: 'Premium Bar Services',
        items: [
            { id: 'b1', name: 'Bartenders', quantity: 4, unit: 'staff', unitPrice: 3000 },
            { id: 'b2', name: 'Bar Setup', quantity: 2, unit: 'counters', unitPrice: 15000 },
            { id: 'b3', name: 'Mocktail Station', quantity: 1, unit: 'station', unitPrice: 12000 },
            { id: 'b4', name: 'Whiskey (Premium)', quantity: 10, unit: 'bottles', unitPrice: 5000 },
            { id: 'b5', name: 'Wine (Red/White)', quantity: 15, unit: 'bottles', unitPrice: 2500 },
            { id: 'b6', name: 'Beer', quantity: 100, unit: 'bottles', unitPrice: 250 },
            { id: 'b7', name: 'Soft Drinks', quantity: 200, unit: 'bottles', unitPrice: 50 },
        ]
    },
    {
        id: 'decor',
        name: 'Decor & Flowers',
        icon: Sparkles,
        color: 'pink',
        vendor: 'Bloom & Beyond',
        items: [
            { id: 'd1', name: 'Stage Decoration', quantity: 1, unit: 'setup', unitPrice: 50000 },
            { id: 'd2', name: 'Entrance Arch', quantity: 1, unit: 'piece', unitPrice: 25000 },
            { id: 'd3', name: 'Marigold Strings', quantity: 500, unit: 'meters', unitPrice: 50 },
            { id: 'd4', name: 'Rose Arrangements', quantity: 30, unit: 'pieces', unitPrice: 800 },
            { id: 'd5', name: 'Table Centerpieces', quantity: 25, unit: 'tables', unitPrice: 1500 },
            { id: 'd6', name: 'Floral Jhula', quantity: 1, unit: 'piece', unitPrice: 15000 },
            { id: 'd7', name: 'Phoolon ki Chadar', quantity: 1, unit: 'piece', unitPrice: 8000 },
            { id: 'd8', name: 'Fairy Light Strings', quantity: 200, unit: 'meters', unitPrice: 100 },
            { id: 'd9', name: 'Fabric Draping', quantity: 100, unit: 'meters', unitPrice: 200 },
            { id: 'd10', name: 'Candle Arrangements', quantity: 50, unit: 'pieces', unitPrice: 300 },
        ]
    },
    {
        id: 'mandap',
        name: 'Mandap & Rituals',
        icon: Heart,
        color: 'red',
        vendor: 'Shubh Muhurat Services',
        items: [
            { id: 'm1', name: 'Mandap Structure', quantity: 1, unit: 'setup', unitPrice: 75000 },
            { id: 'm2', name: 'Mandap Decoration', quantity: 1, unit: 'setup', unitPrice: 35000 },
            { id: 'm3', name: 'Pandit Ji', quantity: 1, unit: 'person', unitPrice: 21000 },
            { id: 'm4', name: 'Havan Samagri', quantity: 1, unit: 'kit', unitPrice: 5000 },
            { id: 'm5', name: 'Phera Setup', quantity: 1, unit: 'setup', unitPrice: 15000 },
            { id: 'm6', name: 'Kalash Set', quantity: 2, unit: 'sets', unitPrice: 2000 },
            { id: 'm7', name: 'Coconuts', quantity: 21, unit: 'pieces', unitPrice: 50 },
            { id: 'm8', name: 'Red Carpet', quantity: 30, unit: 'meters', unitPrice: 200 },
        ]
    },
    {
        id: 'furniture',
        name: 'Furniture & Seating',
        icon: Armchair,
        color: 'indigo',
        vendor: 'Royal Heritage Palace',
        items: [
            { id: 'f1', name: 'Chiavari Chairs', quantity: 350, unit: 'chairs', unitPrice: 100 },
            { id: 'f2', name: 'Round Tables (10-seater)', quantity: 35, unit: 'tables', unitPrice: 500 },
            { id: 'f3', name: 'Stage Sofa Set', quantity: 1, unit: 'set', unitPrice: 8000 },
            { id: 'f4', name: 'Lounge Seating', quantity: 4, unit: 'sets', unitPrice: 3000 },
            { id: 'f5', name: 'Cocktail Tables', quantity: 10, unit: 'tables', unitPrice: 800 },
            { id: 'f6', name: 'Kids Seating Zone', quantity: 1, unit: 'setup', unitPrice: 5000 },
        ]
    },
    {
        id: 'photography',
        name: 'Photography & Video',
        icon: Camera,
        color: 'slate',
        vendor: 'Capture Studios',
        items: [
            { id: 'p1', name: 'Lead Photographer', quantity: 1, unit: 'person', unitPrice: 50000 },
            { id: 'p2', name: 'Assistant Photographers', quantity: 2, unit: 'persons', unitPrice: 15000 },
            { id: 'p3', name: 'Cinematic Videographer', quantity: 1, unit: 'person', unitPrice: 40000 },
            { id: 'p4', name: 'Drone Coverage', quantity: 1, unit: 'session', unitPrice: 15000 },
            { id: 'p5', name: 'Same Day Edit', quantity: 1, unit: 'video', unitPrice: 20000 },
            { id: 'p6', name: 'Premium Album (60 pages)', quantity: 1, unit: 'album', unitPrice: 25000 },
            { id: 'p7', name: 'Photo Booth Setup', quantity: 1, unit: 'booth', unitPrice: 20000 },
            { id: 'p8', name: 'LED Screen for SDE', quantity: 1, unit: 'screen', unitPrice: 15000 },
        ]
    },
    {
        id: 'entertainment',
        name: 'Music & Entertainment',
        icon: Music,
        color: 'rose',
        vendor: 'DJ Rhythm Entertainment',
        items: [
            { id: 'e1', name: 'DJ Setup', quantity: 1, unit: 'setup', unitPrice: 30000 },
            { id: 'e2', name: 'Sound System (10K Watts)', quantity: 1, unit: 'system', unitPrice: 20000 },
            { id: 'e3', name: 'LED Dance Floor', quantity: 1, unit: 'piece', unitPrice: 15000 },
            { id: 'e4', name: 'Dhol Players (Baraat)', quantity: 3, unit: 'persons', unitPrice: 5000 },
            { id: 'e5', name: 'Band Baja Set', quantity: 1, unit: 'set', unitPrice: 25000 },
            { id: 'e6', name: 'Fog Machine', quantity: 2, unit: 'units', unitPrice: 2500 },
            { id: 'e7', name: 'Cold Pyro', quantity: 10, unit: 'units', unitPrice: 1500 },
            { id: 'e8', name: 'Confetti Cannon', quantity: 4, unit: 'units', unitPrice: 2000 },
        ]
    },
    {
        id: 'makeup',
        name: 'Makeup & Styling',
        icon: Brush,
        color: 'fuchsia',
        vendor: 'Glamour by Neha',
        items: [
            { id: 'mk1', name: 'Bridal Makeup', quantity: 1, unit: 'session', unitPrice: 25000 },
            { id: 'mk2', name: 'Bridal Hair Styling', quantity: 1, unit: 'session', unitPrice: 8000 },
            { id: 'mk3', name: 'Draping Assistance', quantity: 1, unit: 'session', unitPrice: 5000 },
            { id: 'mk4', name: 'Touch-ups During Event', quantity: 3, unit: 'sessions', unitPrice: 2000 },
            { id: 'mk5', name: 'Groom Makeup', quantity: 1, unit: 'session', unitPrice: 5000 },
            { id: 'mk6', name: 'Family Makeup (5 persons)', quantity: 1, unit: 'package', unitPrice: 15000 },
        ]
    },
    {
        id: 'transport',
        name: 'Transportation',
        icon: Car,
        color: 'emerald',
        vendor: 'Royal Rides',
        items: [
            { id: 't1', name: 'Decorated Wedding Car', quantity: 1, unit: 'car', unitPrice: 15000 },
            { id: 't2', name: 'Baraat Horse (Ghodi)', quantity: 1, unit: 'horse', unitPrice: 20000 },
            { id: 't3', name: 'Guest Shuttle Bus', quantity: 2, unit: 'buses', unitPrice: 12000 },
            { id: 't4', name: 'Vintage Car for Photoshoot', quantity: 1, unit: 'car', unitPrice: 10000 },
            { id: 't5', name: 'Valet Parking Staff', quantity: 6, unit: 'staff', unitPrice: 1500 },
        ]
    },
    {
        id: 'hospitality',
        name: 'Hospitality & Rooms',
        icon: Hotel,
        color: 'cyan',
        vendor: 'Royal Heritage Palace',
        items: [
            { id: 'h1', name: 'Suite for Bride', quantity: 1, unit: 'night', unitPrice: 15000 },
            { id: 'h2', name: 'Suite for Groom', quantity: 1, unit: 'night', unitPrice: 15000 },
            { id: 'h3', name: 'Guest Rooms (Deluxe)', quantity: 10, unit: 'rooms', unitPrice: 5000 },
            { id: 'h4', name: 'Welcome Drink Setup (Rooms)', quantity: 12, unit: 'rooms', unitPrice: 500 },
            { id: 'h5', name: 'Room Decor for Couple', quantity: 1, unit: 'room', unitPrice: 8000 },
        ]
    },
    {
        id: 'invites',
        name: 'Invitations & Stationery',
        icon: FileText,
        color: 'orange',
        vendor: 'Print Masters',
        items: [
            { id: 'i1', name: 'Wedding Cards (Premium Box)', quantity: 150, unit: 'cards', unitPrice: 200 },
            { id: 'i2', name: 'E-Invites (Video)', quantity: 1, unit: 'video', unitPrice: 8000 },
            { id: 'i3', name: 'Itinerary Cards', quantity: 100, unit: 'cards', unitPrice: 30 },
            { id: 'i4', name: 'Table Name Cards', quantity: 35, unit: 'cards', unitPrice: 50 },
            { id: 'i5', name: 'Welcome Signage', quantity: 3, unit: 'boards', unitPrice: 3000 },
        ]
    },
    {
        id: 'gifts',
        name: 'Gifts & Favors',
        icon: Gift,
        color: 'yellow',
        vendor: 'Gift Gallery',
        items: [
            { id: 'g1', name: 'Return Gifts (Guests)', quantity: 350, unit: 'pieces', unitPrice: 150 },
            { id: 'g2', name: 'Thank You Cards', quantity: 350, unit: 'cards', unitPrice: 20 },
            { id: 'g3', name: 'Gift Boxes (VIP Guests)', quantity: 25, unit: 'boxes', unitPrice: 500 },
            { id: 'g4', name: 'Kids Gift Bags', quantity: 30, unit: 'bags', unitPrice: 200 },
        ]
    },
    {
        id: 'staff',
        name: 'Event Staff & Security',
        icon: Shield,
        color: 'gray',
        vendor: 'Event Solutions',
        items: [
            { id: 's1', name: 'Event Coordinator', quantity: 2, unit: 'persons', unitPrice: 10000 },
            { id: 's2', name: 'Floor Managers', quantity: 4, unit: 'persons', unitPrice: 5000 },
            { id: 's3', name: 'Security Guards', quantity: 6, unit: 'persons', unitPrice: 2000 },
            { id: 's4', name: 'Hostesses', quantity: 4, unit: 'persons', unitPrice: 3000 },
            { id: 's5', name: 'Ushers', quantity: 6, unit: 'persons', unitPrice: 1500 },
            { id: 's6', name: 'Housekeeping Staff', quantity: 8, unit: 'persons', unitPrice: 1000 },
        ]
    },
]

const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; light: string; border: string }> = {
        blue: { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-50', border: 'border-blue-200' },
        amber: { bg: 'bg-amber-500', text: 'text-amber-600', light: 'bg-amber-50', border: 'border-amber-200' },
        pink: { bg: 'bg-pink-500', text: 'text-pink-600', light: 'bg-pink-50', border: 'border-pink-200' },
        purple: { bg: 'bg-purple-500', text: 'text-purple-600', light: 'bg-purple-50', border: 'border-purple-200' },
        indigo: { bg: 'bg-indigo-500', text: 'text-indigo-600', light: 'bg-indigo-50', border: 'border-indigo-200' },
        rose: { bg: 'bg-rose-500', text: 'text-rose-600', light: 'bg-rose-50', border: 'border-rose-200' },
        red: { bg: 'bg-red-500', text: 'text-red-600', light: 'bg-red-50', border: 'border-red-200' },
        emerald: { bg: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-200' },
        cyan: { bg: 'bg-cyan-500', text: 'text-cyan-600', light: 'bg-cyan-50', border: 'border-cyan-200' },
        orange: { bg: 'bg-orange-500', text: 'text-orange-600', light: 'bg-orange-50', border: 'border-orange-200' },
        yellow: { bg: 'bg-yellow-500', text: 'text-yellow-600', light: 'bg-yellow-50', border: 'border-yellow-200' },
        gray: { bg: 'bg-gray-500', text: 'text-gray-600', light: 'bg-gray-50', border: 'border-gray-200' },
        slate: { bg: 'bg-slate-500', text: 'text-slate-600', light: 'bg-slate-50', border: 'border-slate-200' },
        fuchsia: { bg: 'bg-fuchsia-500', text: 'text-fuchsia-600', light: 'bg-fuchsia-50', border: 'border-fuchsia-200' },
    }
    return colors[color] || colors.blue
}

export default function SpecificationsPage() {
    const params = useParams()
    const eventId = params.id as string

    const [event, setEvent] = useState<Event | null>(null)
    const [loading, setLoading] = useState(true)
    const [specs, setSpecs] = useState<CategorySpec[]>([])
    const [expandedCategories, setExpandedCategories] = useState<string[]>(['venue', 'catering'])
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const loadEvent = async () => {
            const data = await eventRepository.findById(eventId)
            setEvent(data)

            // Load event-type-specific templates
            if (data?.type) {
                const template = getSpecsForEventType(data.type)
                setSpecs(template)
            } else {
                // Default to wedding template
                setSpecs(getSpecsForEventType('wedding'))
            }

            setLoading(false)
        }
        loadEvent()
    }, [eventId])

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        )
    }

    const expandAll = () => setExpandedCategories(specs.map(s => s.id))
    const collapseAll = () => setExpandedCategories([])

    const updateItemQuantity = (categoryId: string, itemId: string, quantity: number) => {
        setSpecs(prev => prev.map(cat => {
            if (cat.id === categoryId) {
                return {
                    ...cat,
                    items: cat.items.map(item =>
                        item.id === itemId ? { ...item, quantity } : item
                    )
                }
            }
            return cat
        }))
    }

    const updateItemNotes = (categoryId: string, itemId: string, notes: string) => {
        setSpecs(prev => prev.map(cat => {
            if (cat.id === categoryId) {
                return {
                    ...cat,
                    items: cat.items.map(item =>
                        item.id === itemId ? { ...item, notes } : item
                    )
                }
            }
            return cat
        }))
    }

    const addItem = (categoryId: string) => {
        const newItem: SpecItem = {
            id: `new_${Date.now()}`,
            name: 'New Item',
            quantity: 1,
            unit: 'units',
            unitPrice: 0,
        }
        setSpecs(prev => prev.map(cat => {
            if (cat.id === categoryId) {
                return { ...cat, items: [...cat.items, newItem] }
            }
            return cat
        }))
    }

    const removeItem = (categoryId: string, itemId: string) => {
        setSpecs(prev => prev.map(cat => {
            if (cat.id === categoryId) {
                return { ...cat, items: cat.items.filter(item => item.id !== itemId) }
            }
            return cat
        }))
    }

    const calculateCategoryTotal = (items: SpecItem[]) => {
        return items.reduce((sum, item) => sum + (item.quantity * (item.unitPrice || 0)), 0)
    }

    const totalBudget = specs.reduce((sum, cat) => sum + calculateCategoryTotal(cat.items), 0)
    const totalItems = specs.reduce((sum, cat) => sum + cat.items.length, 0)

    // Filter specs based on search
    const filteredSpecs = searchQuery
        ? specs.filter(cat =>
            cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cat.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        : specs

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header with Summary */}
            <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-xl font-bold text-gray-900">Event Specifications</h2>
                        <Badge variant="outline" className="capitalize">
                            {event?.type || 'Wedding'} Template
                        </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                        Detailed line items across {specs.length} categories for your {event?.type || 'wedding'} event
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center gap-4">
                    <div className="text-center px-4">
                        <p className="text-2xl font-bold text-gray-900">{specs.length}</p>
                        <p className="text-xs text-gray-500">Categories</p>
                    </div>
                    <div className="text-center px-4 border-l">
                        <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
                        <p className="text-xs text-gray-500">Line Items</p>
                    </div>
                    <div className="text-center px-4 border-l">
                        <p className="text-2xl font-bold text-green-600">₹{(totalBudget / 100000).toFixed(2)}L</p>
                        <p className="text-xs text-gray-500">Total Est.</p>
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700">
                        <Save className="w-4 h-4 mr-2" /> Save
                    </Button>
                </div>
            </div>

            {/* Search and Controls */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search categories or items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button variant="outline" size="sm" onClick={expandAll}>
                    <ChevronsUpDown className="w-4 h-4 mr-2" /> Expand All
                </Button>
                <Button variant="outline" size="sm" onClick={collapseAll}>
                    Collapse All
                </Button>
            </div>

            {/* Category Summary Bar */}
            <div className="bg-white rounded-xl border p-4 overflow-x-auto">
                <div className="flex gap-2 min-w-max">
                    {specs.map(cat => {
                        const colors = getColorClasses(cat.color)
                        const total = calculateCategoryTotal(cat.items)
                        return (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    if (!expandedCategories.includes(cat.id)) {
                                        setExpandedCategories([...expandedCategories, cat.id])
                                    }
                                    document.getElementById(`cat-${cat.id}`)?.scrollIntoView({ behavior: 'smooth' })
                                }}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm hover:shadow transition-all ${colors.light} ${colors.border}`}
                            >
                                <span className="font-medium">{cat.name}</span>
                                <Badge variant="secondary" className="text-xs">₹{(total / 1000).toFixed(0)}K</Badge>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Category Cards */}
            <div className="space-y-4">
                {filteredSpecs.map(category => {
                    const Icon = category.icon
                    const colors = getColorClasses(category.color)
                    const isExpanded = expandedCategories.includes(category.id)
                    const categoryTotal = calculateCategoryTotal(category.items)

                    return (
                        <Card key={category.id} id={`cat-${category.id}`} className={`overflow-hidden ${colors.border}`}>
                            {/* Header */}
                            <div
                                className={`flex items-center justify-between p-4 cursor-pointer ${colors.light}`}
                                onClick={() => toggleCategory(category.id)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                                        <p className="text-sm text-gray-500">{category.vendor} • {category.items.length} items</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="font-bold text-lg">₹{(categoryTotal / 100000).toFixed(2)}L</p>
                                    {isExpanded ? (
                                        <ChevronUp className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                            </div>

                            {/* Expanded Content */}
                            {isExpanded && (
                                <CardContent className="p-4 pt-0">
                                    <div className="border rounded-lg overflow-hidden mt-4">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="text-left p-3 font-medium text-gray-600">Item</th>
                                                    <th className="text-center p-3 font-medium text-gray-600 w-24">Qty</th>
                                                    <th className="text-left p-3 font-medium text-gray-600 w-24">Unit</th>
                                                    <th className="text-right p-3 font-medium text-gray-600 w-28">Unit Price</th>
                                                    <th className="text-right p-3 font-medium text-gray-600 w-28">Total</th>
                                                    <th className="text-left p-3 font-medium text-gray-600">Notes</th>
                                                    <th className="w-10"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {category.items.map((item, idx) => (
                                                    <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                                                        <td className="p-3">
                                                            <Input
                                                                value={item.name}
                                                                className="h-8 text-sm"
                                                                onChange={(e) => {
                                                                    setSpecs(prev => prev.map(cat => {
                                                                        if (cat.id === category.id) {
                                                                            return {
                                                                                ...cat,
                                                                                items: cat.items.map(i =>
                                                                                    i.id === item.id ? { ...i, name: e.target.value } : i
                                                                                )
                                                                            }
                                                                        }
                                                                        return cat
                                                                    }))
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="p-3 text-center">
                                                            <Input
                                                                type="number"
                                                                value={item.quantity}
                                                                onChange={(e) => updateItemQuantity(category.id, item.id, Number(e.target.value))}
                                                                className="h-8 text-sm text-center w-20"
                                                                min={0}
                                                            />
                                                        </td>
                                                        <td className="p-3 text-gray-500">{item.unit}</td>
                                                        <td className="p-3 text-right">
                                                            {item.unitPrice !== undefined ? `₹${item.unitPrice.toLocaleString()}` : '-'}
                                                        </td>
                                                        <td className="p-3 text-right font-medium">
                                                            {item.unitPrice !== undefined
                                                                ? `₹${(item.quantity * item.unitPrice).toLocaleString()}`
                                                                : '-'
                                                            }
                                                        </td>
                                                        <td className="p-3">
                                                            <Input
                                                                value={item.notes || ''}
                                                                placeholder="Add notes..."
                                                                onChange={(e) => updateItemNotes(category.id, item.id, e.target.value)}
                                                                className="h-8 text-sm"
                                                            />
                                                        </td>
                                                        <td className="p-3">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                                onClick={() => removeItem(category.id, item.id)}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Add Item Button */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-3"
                                        onClick={() => addItem(category.id)}
                                    >
                                        <Plus className="w-4 h-4 mr-2" /> Add Item
                                    </Button>
                                </CardContent>
                            )}
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
