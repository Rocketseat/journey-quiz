import { activeCampaignAxiosClient } from '~/services/activeCampaignAxiosClient'

interface SubscribeUserEmailToActiveCampaignListProps {
  email: string
  listId: string
  customFields: {
    field: string
    value: string
  }[]
}

export async function subscribeEmailToActiveCampaignList({
  email,
  listId,
  customFields,
}: SubscribeUserEmailToActiveCampaignListProps) {
  const getContactResponse = await activeCampaignAxiosClient.get(`/contacts`, {
    params: {
      email,
    },
  })

  let contactId

  const contactDoesNotExists = getContactResponse.data.meta.total === `0`

  if (contactDoesNotExists) {
    const createContactResponse = await activeCampaignAxiosClient.post(
      `/contacts`,
      {
        contact: {
          email,
          fieldValues: customFields,
        },
      },
    )

    contactId = createContactResponse.data.contact.id
  } else {
    contactId = getContactResponse.data.contacts[0].id

    await activeCampaignAxiosClient.put(`/contacts/${contactId}`, {
      contact: {
        fieldValues: customFields,
      },
    })
  }

  const SUBSCRIBE_CONTACT_TO_LIST_STATUS = 1

  await activeCampaignAxiosClient.post(`/contactLists`, {
    contactList: {
      list: listId,
      contact: contactId,
      status: SUBSCRIBE_CONTACT_TO_LIST_STATUS,
    },
  })
}
