import { activeCampaignAxiosClient } from '~/services/activeCampaignAxiosClient'

interface AddTagToActiveCampaignContactProps {
  email: string
  tagId: string
  customFields?: {
    field: string
    value: string
  }[]
  user?: {
    firstName: string
    phone: string
  }
}

interface ContactData {
  email: string
  fieldValues?: {
    field: string
    value: string
  }[]
  user?: {
    firstName: string
    phone: string
  }
}

export async function addTagToActiveCampaignContact({
  email,
  tagId,
  customFields,
  user,
}: AddTagToActiveCampaignContactProps) {
  const getContactResponse = await activeCampaignAxiosClient.get(`/contacts`, {
    params: {
      email,
    },
  })

  const contactData: ContactData = {
    email,
    ...(user || {}),
    ...({ fieldValues: customFields } || {}),
  }

  let contactId

  const contactDoesNotExists = getContactResponse.data.meta.total === `0`

  if (contactDoesNotExists) {
    const createContactResponse = await activeCampaignAxiosClient.post(
      `/contacts`,
      {
        contact: contactData,
      },
    )

    contactId = createContactResponse.data.contact.id
  } else {
    contactId = getContactResponse.data.contacts[0].id

    await activeCampaignAxiosClient.put(`/contacts/${contactId}`, {
      contact: contactData,
    })
  }

  await activeCampaignAxiosClient.post(`/contactTags`, {
    contactTag: {
      tag: tagId,
      contact: contactId,
    },
  })
}
