import { serverSupabaseClient } from '#supabase/server'

export interface GetPriceCollectionProducts {
    id: number
    pricecollectionid: number
    barcode: string
    maxvalue: number
    minvalue: number
    description: string
    lastupdateat: string
    countstore: number
    image: string
    maxvaluestorename: string
    minvaluestorename: string
}

export default eventHandler(async (event) => {

    const { limit, offset, priceCollectionId, cityId, productEanOrDescription, storeCnpj } = getQuery<{
        limit: number,
        offset: number,
        cityId?: number,
        priceCollectionId: number,
        productEanOrDescription?: string
        storeCnpj?: number
    }>(event)

    const client = await serverSupabaseClient(event)

    const { data, error } = await client.rpc('get_price_collection_products',
        ({
            p_limit: limit ?? 10,
            p_offset: offset ?? 0,
            p_price_collection_id: priceCollectionId,
            p_city_id: cityId,
            p_barcode_or_description: productEanOrDescription,
            p_store_cnpj: storeCnpj
        } as unknown) as undefined, // working around for stop ts error
        {
            get: true
        });



    if (error) {
        throw createError({ statusCode: 500, statusMessage: error.message })
    }
    if (!data) {
        throw createError({ statusCode: 404, statusMessage: 'No data found' })
    }


    return (data as GetPriceCollectionProducts[])

})