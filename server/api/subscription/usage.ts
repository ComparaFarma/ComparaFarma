import { getSubscriptionUsage } from '../../utils/subscription'

export default eventHandler(async (event) => {
  return await getSubscriptionUsage(event)
})
