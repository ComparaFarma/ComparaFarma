import { createClient } from '@supabase/supabase-js';

let supabaseClient: ReturnType<typeof createClient> | null = null;

export const useSupabase = () => {
    const config = useRuntimeConfig();

    if (!config.app.supabaseUrl || !config.app.supabaseKey) {
        throw new Error("Supabase URL and key are required");
    }

    // Only create a new client if one doesn't already exist
    if (!supabaseClient) {
        supabaseClient = createClient(config.app.supabaseUrl, config.app.supabaseKey);
    }

    return supabaseClient;
};
