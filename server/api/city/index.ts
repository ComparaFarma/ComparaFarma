import { serverSupabaseClient } from '#supabase/server'
import type { Tables } from '~~/types/database.types'

export type City = Pick<Tables<'City'>, "name" | "id">;

export default eventHandler(async (event) => {

    const client = await serverSupabaseClient<Tables<'City'>>(event)

    const { data, error } = await client
        .from('City')
        .select(`id, name`)
        .order('name', { ascending: true })
    if (error) {
        throw createError({ statusCode: 500, statusMessage: error.message })
    }
    if (!data) {
        throw createError({ statusCode: 404, statusMessage: 'No data found' })
    }
    return data as City[]
})