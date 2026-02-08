import { getVendors } from '@/actions/vendors'
import { VendorsClient } from './vendors-client'

export const dynamic = 'force-dynamic'

export default async function VendorsPage() {
    const { data: vendors, error } = await getVendors()

    if (error) {
        throw new Error(error) // Error boundary will catch
    }

    return <VendorsClient vendors={vendors || []} />
}
