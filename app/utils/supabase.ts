
import { createClient } from "@supabase/supabase-js";

export const useSupabase = () => {
    const config = useRuntimeConfig();
    return createClient(config.app.supabaseUrl, config.app.supabaseKey);
};
        