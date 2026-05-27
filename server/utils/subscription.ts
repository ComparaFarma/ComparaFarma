import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { H3Event } from 'h3'
import type { Tables } from '~~/types/database.types'

const DEFAULT_SUBSCRIPTION_REQUEST_LIMIT = 1000

function getSubscriptionRequestLimit() {
  const runtimeConfig = useRuntimeConfig()
  const configuredLimit = Number(runtimeConfig.subscriptionRequestLimit)

  if (Number.isFinite(configuredLimit) && configuredLimit > 0) {
    return configuredLimit
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
  const requestLimit = getSubscriptionRequestLimit()

  return {
    userId: user.id,
    usedRequests,
    requestLimit,
    remainingRequests: Math.max(requestLimit - usedRequests, 0),
    periodStart,
  }
}

export async function assertSubscriptionAccess(event: H3Event) {
  const usage = await getSubscriptionUsage(event)

  if (usage.usedRequests >= usage.requestLimit) {
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

export async function registerLogRequest(
  event: H3Event,
  priceCollectionId: number,
) {
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Não autorizado',
    })
  }

  const client = await serverSupabaseClient<Tables<'LogRequest'>>(event)
  const { error } = await client.from('LogRequest').insert({
    userId: user.id,
    priceCollectionId,
    createdAt: new Date().toISOString(),
  })

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }
}