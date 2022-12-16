import axios from 'axios'

const ACTIVE_CAMPAIGN_URL = process.env.ACTIVE_CAMPAIGN_URL!
const ACTIVE_CAMPAIGN_API_KEY = process.env.ACTIVE_CAMPAIGN_API_KEY!

export const activeCampaignAxiosClient = axios.create({
  baseURL: `${ACTIVE_CAMPAIGN_URL}/api/3`,
  headers: {
    'Api-Token': ACTIVE_CAMPAIGN_API_KEY,
  },
})
