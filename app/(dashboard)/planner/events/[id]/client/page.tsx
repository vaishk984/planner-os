'use client'

import { useState } from 'react'
import { Check, Copy, ExternalLink, RefreshCw, Smartphone, Laptop } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { generateClientToken, getClientAccessDetails } from '@/actions/client-management'
import { useEffect } from 'react'

export default function ClientManagementPage({ params }: { params: Promise<{ id: string }> }) {
    const [event, setEvent] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()
    const [id, setId] = useState<string>('')

    useEffect(() => {
        params.then(p => {
            setId(p.id)
            loadDetails(p.id)
        })
    }, [params])

    async function loadDetails(eventId: string) {
        setLoading(true)
        const { data, error } = await getClientAccessDetails(eventId)
        if (error) {
            toast({ title: 'Error', description: 'Failed to load client details', variant: 'destructive' })
        } else {
            setEvent(data)
        }
        setLoading(false)
    }

    async function onGenerateToken() {
        setLoading(true)
        const result = await generateClientToken(id)
        if (result.error) {
            toast({ title: 'Error', description: result.error, variant: 'destructive' })
        } else {
            toast({ title: 'Success', description: 'Client access link generated' })
            loadDetails(id) // Refresh
        }
        setLoading(false)
    }

    const publicUrl = event?.public_token
        ? `${window.location.origin}/client/proposal/${event.public_token}`
        : ''

    const copyToClipboard = () => {
        if (!publicUrl) return
        navigator.clipboard.writeText(publicUrl)
        toast({ title: 'Copied', description: 'Link copied to clipboard' })
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Client Portal</h2>
                <p className="text-muted-foreground">Manage client access and proposal status.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Proposal Access</CardTitle>
                        <CardDescription>
                            Share this link with your client to view the proposal, timeline, and budget.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Access Status</Label>
                            <div className="flex items-center gap-2">
                                <Badge variant={event?.public_token ? 'default' : 'secondary'}>
                                    {event?.public_token ? 'Active' : 'Not Generated'}
                                </Badge>
                                {event?.proposal_status && (
                                    <Badge variant="outline" className="capitalize">
                                        Proposal: {event.proposal_status}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {event?.public_token ? (
                            <div className="space-y-2">
                                <Label>Public Link</Label>
                                <div className="flex gap-2">
                                    <Input value={publicUrl} readOnly className="bg-muted" />
                                    <Button size="icon" variant="outline" onClick={copyToClipboard}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="outline" asChild>
                                        <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <Button onClick={onGenerateToken} disabled={loading}>
                                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                Generate Access Link
                            </Button>
                        )}

                        {event?.public_token && (
                            <Button variant="ghost" size="sm" onClick={onGenerateToken} className="text-xs text-muted-foreground">
                                Regenerate Link (Revoke old access)
                            </Button>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Client View Preview</CardTitle>
                        <CardDescription>What your client will see.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-center items-center h-[200px] border-2 border-dashed rounded-lg bg-gray-50 text-gray-400">
                            <div className="text-center space-y-2">
                                <div className="flex justify-center gap-2">
                                    <Laptop className="h-8 w-8" />
                                    <Smartphone className="h-8 w-8" />
                                </div>
                                <p>Responsive Client Portal</p>
                                {event?.public_token && (
                                    <Button variant="link" asChild>
                                        <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                                            Open Preview
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
