import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import type { Tables } from "~~/types/database.types";

export default eventHandler(async (event) => {

  const user = await serverSupabaseUser(event);
  const client = await serverSupabaseClient<Tables<"PriceCollection">>(event);
  const { id } = await readBody<{
    id: number;
  }>(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Não autorizado",
    });
  }

  
  return  await client.from("PriceCollection").delete().eq("id", id);

});
