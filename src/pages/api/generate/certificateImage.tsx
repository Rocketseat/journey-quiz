/* eslint-disable react/no-unknown-property */
import { ImageResponse } from '@vercel/og'
import { format } from 'date-fns'
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'

export const config = {
  runtime: 'experimental-edge',
}

const robotoMedium = fetch(
  new URL('../../../assets/Roboto-Medium.ttf', import.meta.url),
).then((res) => res.arrayBuffer())

const robotoLight = fetch(
  new URL('../../../assets/Roboto-Light.ttf', import.meta.url),
).then((res) => res.arrayBuffer())

const queryParamsSchema = z.object({
  name: z.string().min(1),
  masterclassSlug: z.string().min(1),
})

const certificates = {
  react: {
    title: 'React',
  },
}

export default async function createImage(req: NextRequest) {
  const { searchParams } = req.nextUrl

  const params = queryParamsSchema.safeParse({
    name: searchParams.get('name'),
    masterclassSlug: searchParams.get('masterclassSlug'),
  })

  if (!params.success) {
    return new Response(JSON.stringify(fromZodError(params.error).details), {
      status: 400,
    })
  }

  const masterclassSlug = params.data
    .masterclassSlug as keyof typeof certificates

  const userName = params.data.name

  const certificateData = certificates[masterclassSlug]

  const [mediumFont, lightFont] = await Promise.all([robotoMedium, robotoLight])

  const currentDate = format(new Date(), 'dd/MM/yyyy')

  return new ImageResponse(
    (
      <div tw="flex w-full h-full relative">
        <img
          src={`${process.env.NEXT_PUBLIC_BASE_URL}/certificate-react-bg.png`}
          tw="w-full h-full"
        />
        <div
          tw="flex flex-col absolute top-[354px] right-0 left-0"
          style={{ paddingLeft: 363 * 1.5, paddingRight: 107 * 1.5 }}
        >
          <span tw="text-[36px]">{userName}</span>
          <span
            tw="text-[24px] max-w-[522px] flex leading-[42px] mt-[7.5px]"
            style={{ fontFamily: 'Roboto-Light' }}
          >
            Completou a masterclass da Rocketseat com foco em{' '}
            {certificateData.title}, com carga horária de 4h, na data de{' '}
            {currentDate}.
          </span>
        </div>
      </div>
    ),
    {
      width: 842 * 1.5,
      height: 595 * 1.5,
      fonts: [
        {
          name: 'Roboto-Medium',
          data: mediumFont,
          style: 'normal',
        },
        {
          name: 'Roboto-Light',
          data: lightFont,
          style: 'normal',
        },
      ],
    },
  )
}
