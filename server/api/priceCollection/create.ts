import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import type { Tables } from "~~/types/database.types";

export default eventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const client = await serverSupabaseClient<Tables<"PriceCollection">>(event);
  const body = await readBody(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Não autorizado",
    });
  }

  // 1. Primeiro criamos a PriceCollection
  const newCollection = {
    name: body.name,
    description: body.description || null,
    userId: user.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Inserir na tabela principal
  const { data: collection, error: collectionError } = await client
    .from("PriceCollection")
    .insert(newCollection)
    .select()
    .single();

  if (collectionError) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create price collection",
      data: collectionError,
    });
  }

  // 2. Inserir cidades relacionadas (PriceCollectionCity)
  const citiesInsert = body.cities.map((cityId: number) => ({
    cityId,
    priceCollectionId: collection.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  const { error: citiesError } = await client
    .from("PriceCollectionCity")
    .insert(citiesInsert);

  if (citiesError) {
    // Rollback - deleta a coleção criada se falhar
    await client.from("PriceCollection").delete().eq("id", collection.id);

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to add cities to collection",
      data: citiesError,
    });
  }

  // 3. Inserir produtos relacionados (PriceCollectionProduct)
  const productsInsert = body.products.map((barcode: string) => ({
    barcode,
    priceCollectionId: collection.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  const { error: productsError } = await client
    .from("PriceCollectionProduct")
    .insert(productsInsert);

  if (productsError) {
    // Rollback - deleta tudo se falhar
    await client
      .from("PriceCollectionCity")
      .delete()
      .eq("priceCollectionId", collection.id);

    await client.from("PriceCollection").delete().eq("id", collection.id);

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to add products to collection",
      data: productsError,
    });
  }

  // Retorna a coleção criada com todos os relacionamentos
  return {
    ...collection,
    cities: citiesInsert,
    products: productsInsert,
  };

});
