import api from 'axios'
import { URLSearchParams } from 'node:url'

export async function trackEvent<T = unknown>(eventName: string, eventData: T) {
  const params = new URLSearchParams({
    actid: '27615630',
    key: 'fed9e77287550beacac80a256f3134a28b0e740e',
    event: eventName,
    eventdata: JSON.stringify(eventData),
    visit: JSON.stringify({ email: 'cleiton@rocketseat.team' }),
  })

  await api.post('https://trackcmp.net/event', params.toString(), {
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
  })

  console.log(`Tracked ${eventName}`)
}
