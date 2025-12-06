import { useApiSupabase } from "~/composables/useApiSupabase"

export default defineNuxtRouteMiddleware(async(to) => {
    const apiSupabase = useApiSupabase()
    const isAuthenticated = apiSupabase.isAuthenticated()
    if (to.path != '/auth/login' && !isAuthenticated) {
      return navigateTo('/auth/login')
    }

    if (to.path === '/auth/login' && isAuthenticated) {
      return navigateTo('/')
    }

})