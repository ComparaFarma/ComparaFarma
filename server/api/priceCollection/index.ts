import { serverSupabaseClient } from '#supabase/server'
import type { Tables } from '~~/types/database.types'
export interface PriceCollectionItem extends Tables<'view_pricecollection'> {
    cities: { city: Tables<'City'> }[],
}
export default eventHandler(async (event) => {

    const client = await serverSupabaseClient<Tables<'view_pricecollection'>>(event)
    const { limit, offset } = getQuery(event)

    const { data, error } = await client
        .from('view_pricecollection')
        .select(`*, cities: PriceCollectionCity(
            city:City(
                id,
                name,
                state
                )
            )`,
        )
        .order('createdAt', { ascending: false })
        .range(Number(offset), Number(offset) + Number(limit))

    if (error) {
        throw createError({ statusCode: 500, statusMessage: error.message })
    }
    if (!data) {
        throw createError({ statusCode: 404, statusMessage: 'No data found' })
    }


    return (data as PriceCollectionItem[])

})