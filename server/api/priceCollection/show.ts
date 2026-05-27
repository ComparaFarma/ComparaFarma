import { serverSupabaseClient } from '#supabase/server'
import type { Tables } from '~~/types/database.types'
import { assertSubscriptionAccess } from '../../utils/subscription'
export interface PriceCollectionItem extends Tables<'view_pricecollection'> {
    cities: { city: Tables<'City'> }[],
    name: string,
    description: string,
    createdAt: string,
    updatedAt: string,
}
export default eventHandler(async (event) => {

    await assertSubscriptionAccess(event)

    const client = await serverSupabaseClient<Tables<'view_pricecollection'>>(event)
    const { id } = getQuery(event)

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
        .eq('id', id)
        .single()

    if (error) {
        throw createError({ statusCode: 500, statusMessage: error.message })
    }
    if (!data) {
        throw createError({ statusCode: 404, statusMessage: 'No data found' })
    }


    return (data as PriceCollectionItem)

})