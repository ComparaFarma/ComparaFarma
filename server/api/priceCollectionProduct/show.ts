import { serverSupabaseClient } from '#supabase/server'

export interface GetPriceCollectionPriceHistory {
    barcode: string, 
    description: string, 
    image: string, 
    updatedAt: string, 
    lastCheckDate: string, 
    unit: string, 
    cnpj: string, 
    endDistrict: string, 
    endStreet: string, 
    name: string, 
    phone: string, 
    city_name: string, 
    state: string
}

export default eventHandler(async (event) => {

    const { limit, offset, priceCollectionId, cityId, productEanOrDescription, storeCnpj } = getQuery<{
        limit: number,
        offset: number,
        cityId?: number,
        priceCollectionId: number,
        productEanOrDescription: string
        storeCnpj?: number
    }>(event)

    const client = await serverSupabaseClient(event)
    
    const { data, error } = await client.rpc('get_price_history',
        ({
            p_city_id: cityId,
            p_limit: limit ?? 10,
            p_offset: offset ?? 0,
            p_price_collection_id: priceCollectionId,
            p_product_ean_or_description: productEanOrDescription,
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


    return (data as GetPriceCollectionPriceHistory[])

})