'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
    ArrowLeft, Save, Camera, Plus, Trash2, Star, MapPin,
    Phone, Mail, Globe, Instagram, Building2
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

// Mock vendor profile data
const INITIAL_PROFILE = {
    businessName: 'Capture Studios',
    category: 'Photography',
    description: 'We specialize in candid wedding photography and cinematic videography. With over 10 years of experience, we have captured 500+ weddings across India.',
    logo: '/vendors/capture-logo.jpg',
    phone: '+91 98765 43210',
    email: 'hello@capturestudios.in',
    website: 'www.capturestudios.in',
    instagram: '@capturestudios',
    address: '42, MG Road, Jaipur, Rajasthan',
    rating: 4.9,
    reviewCount: 156,
    services: [
        { id: 1, name: 'Full Day Photography', price: 50000, unit: 'day' },
        { id: 2, name: 'Full Day Video', price: 40000, unit: 'day' },
        { id: 3, name: 'Photo + Video Combo', price: 80000, unit: 'day' },
        { id: 4, name: 'Pre-Wedding Shoot', price: 35000, unit: 'session' },
        { id: 5, name: 'Drone Coverage', price: 15000, unit: 'session' },
        { id: 6, name: 'Same Day Edit', price: 20000, unit: 'video' },
    ],
    portfolio: [
        '/portfolio/1.jpg',
        '/portfolio/2.jpg',
        '/portfolio/3.jpg',
        '/portfolio/4.jpg',
        '/portfolio/5.jpg',
        '/portfolio/6.jpg',
    ]
}

export default function VendorProfilePage() {
    const [profile, setProfile] = useState(INITIAL_PROFILE)
    const [saving, setSaving] = useState(false)

    const handleSave = async () => {
        setSaving(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        setSaving(false)
        toast.success('Profile updated successfully!')
    }

    const addService = () => {
        const newService = {
            id: Date.now(),
            name: 'New Service',
            price: 0,
            unit: 'session'
        }
        setProfile(prev => ({
            ...prev,
            services: [...prev.services, newService]
        }))
    }

    const removeService = (id: number) => {
        setProfile(prev => ({
            ...prev,
            services: prev.services.filter(s => s.id !== id)
        }))
    }

    const updateService = (id: number, field: string, value: any) => {
        setProfile(prev => ({
            ...prev,
            services: prev.services.map(s =>
                s.id === id ? { ...s, [field]: value } : s
            )
        }))
    }

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/vendor">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Business Profile</h2>
                        <p className="text-gray-500">Manage your profile visible to planners</p>
                    </div>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            {/* Profile Header Card */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-start gap-6">
                        {/* Logo */}
                        <div className="relative">
                            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center">
                                <Camera className="w-10 h-10 text-orange-400" />
                            </div>
                            <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-full border shadow-sm hover:bg-gray-50">
                                <Camera className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>

                        {/* Basic Info */}
                        <div className="flex-1 space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Business Name</label>
                                    <Input
                                        value={profile.businessName}
                                        onChange={e => setProfile(p => ({ ...p, businessName: e.target.value }))}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Category</label>
                                    <Input
                                        value={profile.category}
                                        onChange={e => setProfile(p => ({ ...p, category: e.target.value }))}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Description</label>
                                <Textarea
                                    value={profile.description}
                                    onChange={e => setProfile(p => ({ ...p, description: e.target.value }))}
                                    className="mt-1"
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 mt-6 pt-6 border-t">
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                            <span className="text-xl font-bold">{profile.rating}</span>
                            <span className="text-gray-500">({profile.reviewCount} reviews)</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>How planners and clients can reach you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Phone className="w-4 h-4" /> Phone
                            </label>
                            <Input
                                value={profile.phone}
                                onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Mail className="w-4 h-4" /> Email
                            </label>
                            <Input
                                value={profile.email}
                                onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Globe className="w-4 h-4" /> Website
                            </label>
                            <Input
                                value={profile.website}
                                onChange={e => setProfile(p => ({ ...p, website: e.target.value }))}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Instagram className="w-4 h-4" /> Instagram
                            </label>
                            <Input
                                value={profile.instagram}
                                onChange={e => setProfile(p => ({ ...p, instagram: e.target.value }))}
                                className="mt-1"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> Address
                        </label>
                        <Input
                            value={profile.address}
                            onChange={e => setProfile(p => ({ ...p, address: e.target.value }))}
                            className="mt-1"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Services & Pricing */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Services & Pricing</CardTitle>
                            <CardDescription>Define your service offerings</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={addService}>
                            <Plus className="w-4 h-4 mr-2" /> Add Service
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {profile.services.map(service => (
                            <div key={service.id} className="flex items-center gap-4 p-3 border rounded-lg">
                                <div className="flex-1">
                                    <Input
                                        value={service.name}
                                        onChange={e => updateService(service.id, 'name', e.target.value)}
                                        placeholder="Service name"
                                    />
                                </div>
                                <div className="w-32">
                                    <Input
                                        type="number"
                                        value={service.price}
                                        onChange={e => updateService(service.id, 'price', Number(e.target.value))}
                                        placeholder="Price"
                                    />
                                </div>
                                <div className="w-24 text-sm text-gray-500">
                                    per {service.unit}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => removeService(service.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Portfolio */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Portfolio</CardTitle>
                            <CardDescription>Showcase your best work</CardDescription>
                        </div>
                        <Button variant="outline" size="sm">
                            <Plus className="w-4 h-4 mr-2" /> Add Photos
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        {profile.portfolio.map((_, idx) => (
                            <div
                                key={idx}
                                className="aspect-square rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
                            >
                                <Camera className="w-6 h-6 text-gray-400" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
