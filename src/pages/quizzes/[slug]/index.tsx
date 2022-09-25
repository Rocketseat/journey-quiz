import { GetStaticPaths, GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'

import { trpc } from '~/utils/trpc'
import { trpcSSG } from '~/server/trpc-ssg'
import {
  ArrowRight,
  ClockAfternoon,
  ListBullets,
  Spinner,
} from 'phosphor-react'

import rocketseatLogoImg from '~/assets/logo-rocketseat.svg'
import Image from 'next/image'
import { getBaseUrl } from '~/utils/get-base-url'

export default function Quiz() {
  const router = useRouter()
  const slug = String(router.query.slug)

  const { data } = trpc.useQuery(['quiz.get', { slug }])

  const quiz = data!

  const { mutateAsync: startSubmission, isLoading: isStartingSubmission } =
    trpc.useMutation(['submission.start'], {
      async onSuccess(data) {
        await router.push(`/submissions/${data.submissionId}`)
      },
    })

  return (
    <>
      <NextSeo
        title={`Teste seus conhecimentos em ${quiz.title}`}
        description={quiz.description}
        openGraph={{
          images: [
            {
              url: `${getBaseUrl()}/og-${quiz.imageUrl}.png`,
              width: 1200,
              height: 630,
              type: 'image/png',
            },
          ],
        }}
        twitter={{
          cardType: 'summary_large_image',
        }}
      />

      <main className="max-w-2xl mx-auto py-24 px-8 flex flex-col items-center">
        <Image src={rocketseatLogoImg} alt="" />

        <img
          className="w-36 mt-16"
          src={`${getBaseUrl()}/logo-${quiz.imageUrl}.svg`}
          alt=""
        />

        <h1 className="text-3xl sm:text-4xl mt-8 text-zinc-100 font-bold text-center leading-tight">
          Quiz: {quiz.title}
        </h1>

        <div className="flex text-zinc-400 mt-2 divide-x divide-zinc-600">
          <span className="inline-flex items-center gap-2 text-sm px-4">
            <ClockAfternoon />
            10 - 40min
          </span>

          <span className="inline-flex items-center gap-2 text-sm px-4">
            <ListBullets />
            20 questões
          </span>
        </div>

        <p className="text-zinc-300 text-center mt-4 leading-relaxed">
          {quiz.description}
        </p>

        <button
          type="button"
          onClick={() => startSubmission({ quizId: quiz.id })}
          disabled={isStartingSubmission}
          className="inline-flex items-center gap-2 justify-center rounded-md w-56 px-8 py-3 bg-violet-600 font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-violet-400 disabled:opacity-40 disabled:cursor-not-allowed mt-6"
        >
          {isStartingSubmission ? (
            <Spinner className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Iniciar quiz
              <ArrowRight />
            </>
          )}
        </button>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string

  await trpcSSG.prefetchQuery('quiz.get', { slug })

  return {
    props: {
      trpcState: trpcSSG.dehydrate(),
    },
  }
}
