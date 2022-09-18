import Head from 'next/head'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { Check } from 'phosphor-react'
import Link from 'next/link'
import { trpc } from '../../../utils/trpc'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Countdown } from '../../../components/Countdown'

export default function Submission() {
  const router = useRouter()
  const submissionId = String(router.query.id)

  const { data: submission, isLoading: isLoadingSubmision } = trpc.useQuery([
    'submission.get',
    { submissionId },
  ])

  const {
    data: question,
    isLoading: isLoadingQuestion,
    refetch: fetchAnotherQuestion,
  } = trpc.useQuery(['submission.fetchQuestion', { submissionId }])

  return (
    <>
      <Head>
        <title>Teste: {submission?.quiz.title} | Rocketseat</title>
      </Head>

      <div>
        <h4 className="sr-only">Status</h4>

        <div aria-hidden="true">
          <div className="bg-zinc-700 rounded-sm overflow-hidden">
            <div
              className="h-2 bg-violet-500"
              style={{
                width: `${
                  ((question?.currentQuestionNumber ?? 0) * 100) / 20
                }%`,
              }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-md font-medium p-3">
            Questão {question?.currentQuestionNumber} de 20
            <span
              className="hidden sm:inline sm:mx-1 text-gray-400"
              aria-hidden="true"
            >
              &middot;
            </span>{' '}
            <strong className="block sm:inline">
              {submission?.quiz.title}
            </strong>
          </p>
          <p className="text-md align-right font-medium p-3">
            Tempo p/ resposta:
            {question?.remainingTimeInSeconds && (
              <Countdown
                remainingTimeInSeconds={question.remainingTimeInSeconds}
              />
            )}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl py-4 px-6">
        <div className="mt-4">
          <h2 className="text-2xl font-bold">
            Questão {question?.currentQuestionNumber}
          </h2>
          <p className="text-lg leading-8 mt-4">{question?.description}</p>

          <RadioGroup.Root className="mt-6 space-y-4">
            {question?.answers?.map((answer) => {
              return (
                <RadioGroup.Item
                  key={answer.id}
                  value={answer.id}
                  className="w-full flex items-center justify-between bg-zinc-800 border border-zinc-800 rounded-md px-6 py-4 focus:outline-none checked:border-violet-500"
                >
                  <span className="font-medium text-zinc-300">
                    {answer.description}
                  </span>

                  <RadioGroup.Indicator>
                    <Check className="w-5 h-5 ml-auto text-violet-500" />
                  </RadioGroup.Indicator>
                </RadioGroup.Item>
              )
            })}
          </RadioGroup.Root>

          <div className="mt-6 grid grid-cols-2 md:flex md:flex-row md:justify-end">
            <button
              type="button"
              className="inline-flex mr-4 justify-center rounded-md shadow-sm px-8 py-3 bg-zinc-700 text-base font-medium text-zinc-300 hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Desistir
            </button>

            <Link href="/submissions/1/result">
              <a
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-8 py-3 bg-violet-600 text-base font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Confirmar resposta
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
