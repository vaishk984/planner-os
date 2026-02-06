'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, UserPlus } from 'lucide-react'
import { createGuest } from '@/actions/guests'
import { useRouter } from 'next/navigation'

interface AddGuestDialogProps {
    eventId: string
}

export function AddGuestDialog({ eventId }: AddGuestDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [plusOne, setPlusOne] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        formData.append('eventId', eventId)

        try {
            const result = await createGuest(formData)
            if (result.success) {
                setOpen(false)
                router.refresh()
            } else {
                alert(result.error)
            }
        } catch (error) {
            console.error(error)
            alert('Failed to add guest')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                    <UserPlus className="w-4 h-4" /> Add Guest
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Guest</DialogTitle>
                </DialogHeader>

                <form action={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input id="name" name="name" required placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select name="category" defaultValue="friends">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="vip">VIP</SelectItem>
                                    <SelectItem value="family">Family</SelectItem>
                                    <SelectItem value="friends">Friends</SelectItem>
                                    <SelectItem value="colleagues">Colleagues</SelectItem>
                                    <SelectItem value="bride_side">Bride Side</SelectItem>
                                    <SelectItem value="groom_side">Groom Side</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="john@example.com" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" name="phone" placeholder="+91 98765 43210" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="rsvpStatus">RSVP Status</Label>
                            <Select name="rsvpStatus" defaultValue="pending">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="declined">Declined</SelectItem>
                                    <SelectItem value="maybe">Maybe</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tableNumber">Table No.</Label>
                            <Input id="tableNumber" name="tableNumber" type="number" placeholder="Optional" />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 border p-3 rounded-md">
                        <Checkbox
                            id="plusOne"
                            name="plusOne"
                            checked={plusOne}
                            onCheckedChange={(c) => setPlusOne(!!c)}
                        />
                        <div className="flex-1">
                            <Label htmlFor="plusOne" className="font-medium">Plus One?</Label>
                            <p className="text-xs text-gray-500">Is this guest bringing a partner?</p>
                        </div>
                    </div>

                    {plusOne && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                            <Label htmlFor="plusOneName">Partner's Name</Label>
                            <Input id="plusOneName" name="plusOneName" placeholder="Jane Doe" required />
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="dietaryPreferences">Dietary Preferences</Label>
                        <Textarea
                            id="dietaryPreferences"
                            name="dietaryPreferences"
                            placeholder="Vegetarian, Jain, Allergies, etc."
                            className="h-20"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Guest'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
