
import { CaptureClientWrapper } from './capture-client'
import { getCurrentUser } from '@/actions/auth/login'
import { redirect } from 'next/navigation'
import { randomUUID } from 'crypto'

export default async function CapturePage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect('/login')
    }

    const token = `capture_${randomUUID()}`

    return <CaptureClientWrapper token={token} plannerId={user.id} />
}
