import { serverSupabaseClient } from '#supabase/server'
import type { Tables } from '~~/types/database.types'

export default eventHandler(async (event) => {

    const client = await serverSupabaseClient<Tables<'view_pricecollectionproduct'>>(event)
    const { limit, offset, priceCollectionId } = getQuery(event)

    const { data, error } = await client
        .from('view_pricecollectionproduct')
        .select(`*`)
        .eq('priceCollectionId', priceCollectionId)
        .range(Number(offset ?? 0), Number(offset ?? 0) + Number(limit ?? 10))

    if (error) {
        throw createError({ statusCode: 500, statusMessage: error.message })
    }
    if (!data) {
        throw createError({ statusCode: 404, statusMessage: 'No data found' })
    }


    return (data as Tables<'view_pricecollectionproduct'>[])

})