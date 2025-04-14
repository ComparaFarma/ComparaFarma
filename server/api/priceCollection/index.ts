import { serverSupabaseClient } from '#supabase/server'
import type { Tables } from '~~/types/database.types'
export interface PriceCollectionItem extends Tables<'PriceCollection'> {
    cities: { city: Tables<'City'> }[],
    lastcheckdate: string | undefined
}
export default eventHandler(async (event) => {

    const client = await serverSupabaseClient<Tables<'PriceCollection'>>(event)
    const { limit, offset } = getQuery(event)

    const { data, error } = await client
        .from('PriceCollection')
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

    const { data: priceCollectionWithDate } = await client
        .from('view_pricecollection')
        .select<'*', PriceCollectionItem>('*')
        .in('id', (data as PriceCollectionItem[]).map(item => item.id))

    console.log('response:' + priceCollectionWithDate)


    return (data as PriceCollectionItem[]).map(item => {
        return {
            ...item,
            lastcheckdate: priceCollectionWithDate?.find(e => e.id == item.id)?.lastcheckdate ?? undefined
        }
    })

})