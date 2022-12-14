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

  // Caso não encontre nenhum contato com o e-mail, cria ele
  if (getContactResponse.data.meta.total === `0`) {
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

  await activeCampaignAxiosClient.post(`/contactLists`, {
    contactList: {
      list: listId,
      contact: contactId,
      status: 1,
    },
  })
}
