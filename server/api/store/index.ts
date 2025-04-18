import { serverSupabaseClient } from '#supabase/server'
import type { Tables } from '~~/types/database.types'

export type Store = Tables<'Store'>;

export default eventHandler(async (event) => {

    const { priceCollectionId } = getQuery<{
        priceCollectionId: number
    }>(event);

    const client = await serverSupabaseClient<Tables<'Store'>>(event)

    const select = client
        .from('Store')
        .select(`*, City(PriceCollectionCity(*))`)
        .order('name', { ascending: true })
        
    if (priceCollectionId) {
        select.eq('City.PriceCollectionCity.priceCollectionId', priceCollectionId)
    }

    const { data, error } = await select

    if (error) {
        throw createError({ statusCode: 500, statusMessage: error.message })
    }
    if (!data) {
        throw createError({ statusCode: 404, statusMessage: 'No data found' })
    }
    return data as Store[]
})