
export default defineNuxtRouteMiddleware(async(to) => {
    const session = useSupabaseSession()

    if (to.path != '/auth/login' && !session.value) {
      return navigateTo('/auth/login')
    }

    if (to.path === '/auth/login' && session.value) {
      return navigateTo('/')
    }

})