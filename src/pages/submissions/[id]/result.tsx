import dynamic from 'next/dynamic'

import Head from 'next/head'
import { useRouter } from 'next/router'
import {
  BookOpen,
  FacebookLogo,
  InstagramLogo,
  TwitterLogo,
} from 'phosphor-react'
import * as Dialog from '@radix-ui/react-dialog'

import { trpc } from '../../../utils/trpc'
import { GetServerSideProps } from 'next'
import { trpcSSG } from '../../../server/trpc-ssg'
import ResultChart from '../../../components/ResultChart'

function getLevelFromResult(result: number) {
  if (result >= 200) {
    return 'Expert'
  } else if (result >= 100) {
    return 'Proficiente'
  }

  return 'Novato'
}

export default function Results() {
  const router = useRouter()
  const submissionId = String(router.query.id)

  const response = trpc.useQuery([
    'submission.result',
    {
      submissionId,
    },
  ])

  const result = response.data!

  const level = getLevelFromResult(result.result)

  return (
    <>
      <Head>
        <title>{`Resultado: ${result.quizTitle} | Rocketseat`}</title>
      </Head>

      <div className="mx-auto h-screen text-center flex flex-col items-stretch justify-center max-w-lg py-6 px-4">
        <div className="flex items-center justify-center flex-col">
          <ResultChart score={result.result} />
        </div>

        <h1 className="text-2xl font-bold">
          {result.quizTitle}: <span className="text-emerald-500">{level}</span>
        </h1>

        <p className="text-md text-zinc-400 mt-2">
          Seu nível está acima de{' '}
          <span className="font-bold">{result.betterThanPercentage}%</span> dos
          outros usuários
        </p>

        <Dialog.Root>
          <Dialog.Trigger
            type="button"
            className="mt-6 inline-flex gap-2 justify-center items-center rounded-md border border-transparent bg-violet-600 py-3 px-8 text-md font-medium text-white shadow-sm hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
          >
            <BookOpen className="w-5 h-5" />
            Visualizar relatório completo
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/60" />

            <Dialog.Content className="bg-zinc-800 rounded-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fixed p-6 w-full max-w-sm">
              <Dialog.Title className="text-2xl font-bold">
                Acessar relatório completo
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-zinc-300">
                <p>Ao inserir seu e-mail, você:</p>
                <ul className="list-disc list-inside mt-2 leading-relaxed">
                  <li>Recebe o gabarito do questionário;</li>
                  <li>Salva seu progresso para o futuro;</li>
                  <li>Recebe dicas para melhorar suas skills.</li>
                </ul>
              </Dialog.Description>

              <form
                // onSubmit={() => {}}
                className="pt-4 mt-4 border-t border-t-zinc-700"
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Deixe seu melhor e-mail"
                  className="bg-zinc-900 px-3 py-3 rounded block mt-1 w-full"
                  required
                />

                <button
                  type="submit"
                  className="mt-6 flex w-full gap-2 justify-center items-center rounded-md border border-transparent bg-violet-600 py-3 px-8 text-md font-medium text-white shadow-sm hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
                >
                  <BookOpen className="w-5 h-5" />
                  Receber relatório
                </button>

                <Dialog.Trigger
                  type="button"
                  className="mt-2 flex w-full gap-2 justify-center items-center rounded-md border border-transparent py-3 px-8 text-md font-medium text-zinc-300 hover:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
                >
                  Cancelar
                </Dialog.Trigger>
              </form>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <div className="relative my-6 mx-12">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-zinc-500" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-zinc-900 text-sm text-zinc-500">
              Compartilhe
            </span>
          </div>
        </div>

        <div className="inline space-x-4 text-md text-gray-500">
          <a href="#" className="text-zinc-400 hover:text-violet-300">
            <span className="sr-only">Facebook</span>
            <FacebookLogo className="h-6 w-6 inline" />
          </a>
          <a href="#" className="text-zinc-400 hover:text-violet-300">
            <span className="sr-only">Instagram</span>
            <InstagramLogo className="h-6 w-6 inline" />
          </a>
          <a href="#" className="text-zinc-400 hover:text-violet-300">
            <span className="sr-only">Twitter</span>
            <TwitterLogo className="h-6 w-6 inline" />
          </a>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const submissionId = params?.id as string

  await trpcSSG.prefetchQuery('submission.result', { submissionId })

  return {
    props: {
      trpcState: trpcSSG.dehydrate(),
    },
  }
}
