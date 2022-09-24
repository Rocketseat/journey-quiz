import { GetServerSideProps } from 'next'
import { FormEvent, useCallback, useState } from 'react'
import { useQueryClient } from 'react-query'
import { useRouter } from 'next/router'
import { ArrowRight, Check, Spinner } from 'phosphor-react'
import * as Dialog from '@radix-ui/react-dialog'
import * as RadioGroup from '@radix-ui/react-radio-group'

import { trpc } from '~/utils/trpc'
import { Countdown } from '~/components/Countdown'
import { trpcSSG } from '~/server/trpc-ssg'
import { NextSeo } from 'next-seo'

export default function Submission() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const submissionId = String(router.query.id)

  const [questionAnswerId, setQuestionAnswerId] = useState<string>()
  const [isFinishingQuiz, setIsFinishingQuiz] = useState(false)

  const { data: submission } = trpc.useQuery([
    'submission.get',
    { submissionId },
  ])

  const { data: question, refetch: fetchAnotherQuestion } = trpc.useQuery(
    ['submission.fetchQuestion', { submissionId }],
    {
      onSuccess(data) {
        if (data.status === 'finished') {
          setIsFinishingQuiz(true)
          router.push(`/submissions/${submissionId}/result`)
        }
      },
    },
  )

  const { mutateAsync: sendAnswer, isLoading: isSendingAnswer } =
    trpc.useMutation('submission.sendAnswer')

  async function handleSendAnswer(event: FormEvent) {
    event.preventDefault()

    if (!questionAnswerId || !question?.submissionQuestionAnswerId) {
      return
    }

    await sendAnswer({
      submissionQuestionAnswerId: question.submissionQuestionAnswerId,
      answerId: questionAnswerId,
    })

    setQuestionAnswerId(undefined)

    await fetchAnotherQuestion()
  }

  async function handleSendLateAnswer() {
    if (!question?.submissionQuestionAnswerId) {
      return
    }

    await sendAnswer({
      submissionQuestionAnswerId: question.submissionQuestionAnswerId,
    })

    await fetchAnotherQuestion()
  }

  const onCountdownFinish = useCallback(() => {
    queryClient.setQueryData(
      ['submission.fetchQuestion', { submissionId }],
      (data: any) => {
        return {
          ...data,
          status: 'late',
        }
      },
    )
  }, [submissionId, queryClient])

  return (
    <>
      <NextSeo title={`Teste: ${submission?.quiz.title}`} />

      {isFinishingQuiz ? (
        <div className="w-screen h-screen flex items-center justify-center gap-2 text-zinc-400">
          <Spinner className="w-6 h-6 animate-spin" />
          Calculando resultado...
        </div>
      ) : (
        <>
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
                {question?.remainingTimeInSeconds !== undefined &&
                  question.remainingTimeInSeconds >= 0 && (
                    <Countdown
                      id={question.submissionQuestionAnswerId}
                      remainingTimeInSeconds={question.remainingTimeInSeconds}
                      onCountdownFinish={onCountdownFinish}
                    />
                  )}
              </p>
            </div>
          </div>

          <form
            className="mx-auto max-w-4xl py-4 px-6 mt-4"
            onSubmit={handleSendAnswer}
          >
            <h2 className="text-2xl font-bold">
              Questão {question?.currentQuestionNumber}
            </h2>
            <p className="text-lg leading-8 mt-4">{question?.description}</p>

            <RadioGroup.Root
              className="mt-6 space-y-4"
              onValueChange={setQuestionAnswerId}
              value={questionAnswerId}
            >
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

              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent shadow-sm w-56 px-8 py-3 bg-violet-600 text-base font-medium text-white hover:bg-violet-700 disabled:hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={!questionAnswerId || question?.status === 'late'}
              >
                {isSendingAnswer ? (
                  <Spinner className="w-6 h-6 animate-spin text-white" />
                ) : (
                  'Confirmar resposta'
                )}
              </button>
            </div>
          </form>

          {question?.status === 'late' && (
            <Dialog.Root open>
              <Dialog.Overlay className="fixed inset-0 bg-black/60" />

              <Dialog.Content className="bg-zinc-800 rounded-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fixed p-6 w-full max-w-md">
                <Dialog.Title className="text-2xl font-bold">
                  Tempo esgotado!
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-zinc-300">
                  O tempo para responder essa pergunta esgotou...
                </Dialog.Description>

                <button
                  type="button"
                  onClick={handleSendLateAnswer}
                  className="mt-6 flex w-full gap-2 justify-center items-center rounded-md border border-transparent bg-violet-600 py-3 px-8 text-md font-medium text-white shadow-sm hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
                >
                  Pular pergunta
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Dialog.Content>
            </Dialog.Root>
          )}
        </>
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const submissionId = params?.id as string

  await trpcSSG.prefetchQuery('submission.get', { submissionId })
  await trpcSSG.prefetchQuery('submission.fetchQuestion', {
    submissionId,
  })

  return {
    props: {
      trpcState: trpcSSG.dehydrate(),
    },
  }
}
