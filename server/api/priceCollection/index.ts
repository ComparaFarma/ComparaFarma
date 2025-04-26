import { serverSupabaseClient } from '#supabase/server'
import type { Tables } from '~~/types/database.types'
export interface PriceCollectionItem extends Tables<'view_pricecollection'> {
    cities: { city: Tables<'City'> }[],
    name: string,
    description: string,
    createdAt: string,
    updatedAt: string,
}
export default eventHandler(async (event) => {

    const client = await serverSupabaseClient<Tables<'view_pricecollection'>>(event)
    const { limit, offset, orderBy, cityId, name } = getQuery<{
        limit: number,
        offset: number,
        orderBy: string,
        cityId?: number,
        name?: string
    }>(event)

    const select = client
        .from('view_pricecollection')
        .select(`*, cities: PriceCollectionCity!inner(
            city:City!inner(
                id,
                name,
                state
                )
            )`,
        )
        .order(orderBy ?? 'createdAt', { ascending: true })
        .range(Number(offset), Number(offset) + Number(limit-1))
    if (cityId) {
        select.eq('cities.city.id', cityId)
    }

    if (name) {
        select.ilike('name', `%${name}%`)
    }

    const { data, error } = await select
    if (error) {
        throw createError({ statusCode: 500, statusMessage: error.message })
    }
    if (!data) {
        throw createError({ statusCode: 404, statusMessage: 'No data found' })
    }


    return (data as PriceCollectionItem[])

})