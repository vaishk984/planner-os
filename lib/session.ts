import { createClient } from '@/lib/supabase/server'

export async function getSession() {
    const supabase = await createClient()

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        return null
    }

    // Check if user has a vendor record (direct check)
    const { data: vendorRecord, error: vendorError } = await supabase
        .from('vendors')
        .select('id, company_name')
        .eq('user_id', user.id)
        .single()

    console.log('[getSession] User:', user.email, 'Vendor record:', vendorRecord, 'Error:', vendorError)

    // Determine role: vendor if has vendor record, otherwise planner
    let role = 'planner'
    let displayName = user.email

    if (vendorRecord) {
        role = 'vendor'
        displayName = vendorRecord.company_name || user.email
    }

    console.log('[getSession] Final role:', role, 'displayName:', displayName)

    return {
        userId: user.id,
        email: user.email,
        role: role,
        displayName: displayName,
    }
}

export async function getUserId() {
    const session = await getSession()
    return session?.userId || null
}

export async function getUserRole() {
    const session = await getSession()
    return session?.role || null
}
