import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { motion } from 'framer-motion'

import { trpc } from '~/utils/trpc'
import { trpcSSG } from '~/server/trpc-ssg'
import ResultChart from '~/components/ResultChart'
import { getLevelFromResult } from '~/utils/get-level-from-result'
import { ArrowRight, Check, VideoCamera, X } from 'phosphor-react'
import { useState } from 'react'
import Link from 'next/link'

export default function Report() {
  const router = useRouter()
  const submissionId = String(router.query.id)

  const [isMasterclassBannerMinimized, setIsMasterclassBannerMinimized] =
    useState(false)

  const response = trpc.useQuery([
    'submissionSession.report',
    {
      submissionId,
    },
  ])

  const report = response.data!

  const level = getLevelFromResult(report.result)

  return (
    <>
      <NextSeo title={`Relatório: ${report.quiz?.title}`} noindex />

      <div className="mx-auto flex flex-col items-stretch justify-center max-w-2xl py-6 px-4 mb-36">
        <div className="flex items-center justify-center flex-col">
          <ResultChart score={report.result} />
        </div>

        <h1 className="text-3xl font-bold text-center">
          {report.quiz?.title}:{' '}
          <span className="text-emerald-500">{level}</span>
        </h1>

        <ol className="flex flex-col items-stretch divide-y divide-zinc-700 mt-6">
          {report.report?.map((item) => {
            return (
              <li key={item.question.id} className="py-6 space-y-2">
                <strong className="leading-relaxed">
                  {item.question.description}
                </strong>
                <p className="flex items-baseline gap-2 leading-relaxed">
                  {item.userAnswer?.isRightAnswer ? (
                    <Check className="h-4 w-4 text-emerald-400 translate-y-0.5" />
                  ) : (
                    <X className="h-4 w-4 text-red-400 translate-y-0.5" />
                  )}
                  <span className="flex-1">{item.userAnswer?.description}</span>
                </p>

                {!item.userAnswer?.isRightAnswer && (
                  <p className="flex items-baseline gap-2 leading-relaxed">
                    <Check className="h-4 w-4 text-emerald-400 translate-y-0.5" />
                    <span className="flex-1">
                      {item.rightAnswer?.description}
                    </span>
                  </p>
                )}
              </li>
            )
          })}
        </ol>

        <motion.div
          className="fixed flex items-center justify-between gap-8 sm:gap-16 w-full max-w-2xl left-0 right-0 bottom-0 sm:bottom-8 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 bg-zinc-800 p-6 sm:rounded-lg text-left border border-zinc-700 shadow-2xl shadow-black"
          animate={isMasterclassBannerMinimized ? 'minimized' : 'maximized'}
          variants={{
            minimized: {
              opacity: 0,
            },
            maximized: {
              opacity: 1,
            },
          }}
        >
          <button
            onClick={() => setIsMasterclassBannerMinimized(true)}
            className="right-3 top-3 text-zinc-400 absolute hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex-1">
            <strong className="text-zinc-100 text-lg leading-relaxed">
              Assistir Masterclass de React
            </strong>
            <p className="text-zinc-300 leading-relaxed">
              Acelere sua evolução com uma <strong>Masterclass</strong> de 1
              hora em React e seu ecossistema!
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <Link href={`/masterclass/react/${submissionId}`} passHref>
              <a
                type="button"
                className="inline-flex items-center gap-2 justify-center rounded-md px-8 py-3 bg-violet-600 font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-violet-400 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Assistir
                <ArrowRight />
              </a>
            </Link>
          </div>
        </motion.div>

        <motion.button
          onClick={() => setIsMasterclassBannerMinimized(false)}
          className="fixed right-8 bottom-8 bg-zinc-800 border border-zinc-700 rounded-full flex items-center gap-3 justify-center px-6 py-3 hover:bg-zinc-700 shadow-2xl shadow-black"
          animate={isMasterclassBannerMinimized ? 'visible' : 'invisible'}
          variants={{
            visible: {
              opacity: 1,
            },
            invisible: {
              opacity: 0,
            },
          }}
        >
          <VideoCamera className="text-zinc-300 w-5 h-5" />
          <strong className="text-zinc-300 font-medium">
            Masterclass de React
          </strong>
        </motion.button>
      </div>
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
  const submissionId = params?.id as string

  await trpcSSG.prefetchQuery('submissionSession.report', { submissionId })

  return {
    props: {
      trpcState: trpcSSG.dehydrate(),
    },
    revalidate: 60 * 60 * 24 * 15, // 15 days
  }
}
