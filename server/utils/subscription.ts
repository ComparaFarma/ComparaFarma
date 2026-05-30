import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { H3Event } from 'h3'
import type { Tables } from '~~/types/database.types'

const DEFAULT_SUBSCRIPTION_REQUEST_LIMIT = 0

async function getUserSubscriptionRequestLimit(event: H3Event, userId: string) {
  const client = await serverSupabaseClient<Tables<'User'>>(event)
  const { data, error } = await client
    .from('User')
    .select('subscriptionRequestLimit')
    .eq('id', userId)
    .single()

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  if (data?.subscriptionRequestLimit === null || data?.subscriptionRequestLimit === undefined) {
    return null
  }

  const requestLimit = Number(data.subscriptionRequestLimit)

  if (Number.isFinite(requestLimit) && requestLimit > 0) {
    return requestLimit
  }

  return DEFAULT_SUBSCRIPTION_REQUEST_LIMIT
}

function getCurrentPeriodStartIso() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
}

export async function getSubscriptionUsage(event: H3Event) {
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Não autorizado',
    })
  }

  const client = await serverSupabaseClient<Tables<'LogRequest'>>(event)
  const periodStart = getCurrentPeriodStartIso()
  const { count, error } = await client
    .from('LogRequest')
    .select('id', { count: 'exact', head: true })
    .eq('userId', user.id)
    .gte('createdAt', periodStart)

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  const usedRequests = count ?? 0
  const requestLimit = await getUserSubscriptionRequestLimit(event, user.id)

  return {
    userId: user.id,
    usedRequests,
    requestLimit,
    remainingRequests: requestLimit === null ? null : Math.max(requestLimit - usedRequests, 0),
    periodStart,
  }
}

export async function assertSubscriptionAccess(event: H3Event) {
  const usage = await getSubscriptionUsage(event)

  if (usage.requestLimit !== null && usage.usedRequests >= usage.requestLimit) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Limite da assinatura atingido',
    })
  }

  return {
    requestCount: usage.usedRequests,
    requestLimit: usage.requestLimit,
  }
}
