import { activeCampaignAxiosClient } from '~/services/activeCampaignAxiosClient'

interface Props {
  email: string
  listId: string
}

export async function addExistingUserToInterestedActiveCampaignList({
  email,
  listId,
}: Props) {
  const getContactResponse = await activeCampaignAxiosClient.get(`/contacts`, {
    params: {
      email,
    },
  })

  const contactId = getContactResponse.data.contacts[0].id

  const SUBSCRIBE_CONTACT_TO_LIST_STATUS = 1

  await activeCampaignAxiosClient.post(`/contactLists`, {
    contactList: {
      list: listId,
      contact: contactId,
      status: SUBSCRIBE_CONTACT_TO_LIST_STATUS,
    },
  })
}
