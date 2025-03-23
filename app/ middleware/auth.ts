
export default defineNuxtRouteMiddleware(async(to, from) => {
    const supabase = useSupabase();
    const isAuthenticated = await supabase.auth.getSession();
    // isAuthenticated() is an example method verifying if a user is authenticated
    if (from.path !== '/auth/login' && !isAuthenticated) {
      return navigateTo('/auth/login')
    }

    if (to.path === '/auth/login' && isAuthenticated) {
      return navigateTo('/')
    }
})