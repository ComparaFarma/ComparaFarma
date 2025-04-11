
export const useApiSupabase = () => {
    const supabase = useSupabaseClient()
    const { value } = useSupabaseUser()
    const session = useSupabaseSession()
    const isAuthenticated = () => {
        if (session.value) {
            return true
        }
        return false
    }
    const getUser = async () => {
        if (value) {
            return await supabase.auth.getUser()
        }
        return null
    }

    const signIn = async (email: string, password: string) => {
        return await supabase.auth.signInWithPassword({ email, password })
    }

    const signOut = async () => {
        return await supabase.auth.signOut()
    }

    const signUp = async (email: string, password: string) => {
        return await supabase.auth.signUp({ email, password })
    }
    const resetPasswordForEmail = async (email: string, params: {
        redirectTo: string
    }) => {
        const { redirectTo } = params

        return await supabase.auth.resetPasswordForEmail(email, { redirectTo: redirectTo })
    }

    const updatePassword = async (password: string) => {
        return await supabase.auth.updateUser({ password: password })
    }
    return {
        getUser,
        signIn,
        signOut,
        signUp,
        isAuthenticated,
        updatePassword,
        resetPasswordForEmail
    }    
}