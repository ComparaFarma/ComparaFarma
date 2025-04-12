import { serverSupabaseClient } from '#supabase/server'
import type { Tables } from '~~/types/database.types'

export default eventHandler(async (event) => {
    
    const client = await serverSupabaseClient<Tables<'PriceCollection'>>(event)
    const body = await readBody(event)

    const newRecord = {
        id: body.id,
        description: body.description,
        name: body.name,
        userId: body.userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }

    return await client
        .from('PriceCollection')
        .insert([newRecord])
        .select()
        .single()
    
})