'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Plus } from 'lucide-react'
import { createBookingRequest } from '@/actions/bookings'
import { useRouter } from 'next/navigation'
import { VendorData } from '@/src/backend/entities/Vendor'

interface AssignVendorDialogProps {
    eventId: string
    availableVendors: VendorData[]
}

export function AssignVendorDialog({ eventId, availableVendors }: AssignVendorDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedVendorId, setSelectedVendorId] = useState('')
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        formData.append('eventId', eventId)

        try {
            const result = await createBookingRequest(formData)
            if (result.success) {
                setOpen(false)
                router.refresh()
            } else {
                alert(result.error)
            }
        } catch (error) {
            console.error(error)
            alert('Failed to assign vendor')
        } finally {
            setLoading(false)
        }
    }

    const handleVendorChange = (vendorId: string) => {
        setSelectedVendorId(vendorId)
        // Auto-fill category if possible? 
        // We'll let user select category in the form, but could default it.
        // But select component control is separate.
    }

    const selectedVendor = availableVendors.find(v => v.id === selectedVendorId)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                    <Plus className="w-4 h-4" /> Assign Vendor
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Assign Vendor to Event</DialogTitle>
                </DialogHeader>

                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="vendorId">Select Vendor</Label>
                        <Select name="vendorId" onValueChange={handleVendorChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose a vendor..." />
                            </SelectTrigger>
                            <SelectContent>
                                {availableVendors.map(v => (
                                    <SelectItem key={v.id} value={v.id}>
                                        {v.companyName} ({v.category})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="serviceCategory">Service Category</Label>
                        <Select name="serviceCategory" defaultValue={selectedVendor?.category || 'other'}
                            key={selectedVendorId}> {/* Force re-render on vendor change to update default */}
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="venue">Venue</SelectItem>
                                <SelectItem value="catering">Catering</SelectItem>
                                <SelectItem value="photography">Photography</SelectItem>
                                <SelectItem value="videography">Videography</SelectItem>
                                <SelectItem value="decoration">Decoration</SelectItem>
                                <SelectItem value="music">Music/DJ</SelectItem>
                                <SelectItem value="makeup">Makeup Artist</SelectItem>
                                <SelectItem value="transportation">Transportation</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Initial Status</Label>
                        <Select name="status" defaultValue="draft">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft (Planning)</SelectItem>
                                <SelectItem value="quote_requested">Quote Requested</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            name="notes"
                            placeholder="Specific requirements..."
                            className="h-20"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Assigning...' : 'Assign Vendor'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
