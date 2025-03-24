
export default defineNuxtRouteMiddleware(async(to) => {
    const supabase = useSupabase();
    const isAuthenticated = (await supabase.auth.getUser()).data.user !== null;

    if (to.path != '/auth/login' && !isAuthenticated) {
      return navigateTo('/auth/login')
    }

    if (to.path === '/auth/login' && isAuthenticated) {
      return navigateTo('/')
    }

})