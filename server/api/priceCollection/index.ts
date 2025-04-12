import { serverSupabaseClient } from '#supabase/server'
import type { Tables } from '~~/types/database.types'

export default eventHandler(async (event) => {
    
    const client = await serverSupabaseClient<Tables<'PriceCollection'>>(event)

    return await client
        .from('PriceCollection')
        .select()
    
})