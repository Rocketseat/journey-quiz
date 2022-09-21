import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import { trpc } from '../utils/trpc'
import rocketseatLogoImg from '../assets/logo-rocketseat.svg'
import { QuizItem } from '../components/QuizItem'
import { trpcSSG } from '../server/trpc-ssg'

const Home: NextPage = () => {
  const { data: quizzes } = trpc.useQuery(['quiz.getAll'])

  return (
    <>
      <Head>
        <title>Teste seus conhecimentos | Rocketseat</title>
      </Head>

      <main className="max-w-xl mx-auto py-16 px-8">
        <Image src={rocketseatLogoImg} alt="" />

        <h2 className="text-xl font-medium mt-6">
          Qual teste você quer realizar?
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          Inicie escolhendo um dos testes da lista abaixo
        </p>

        <ul
          role="list"
          className="mt-6 border-t border-b border-zinc-800 divide-y divide-zinc-800"
        >
          {quizzes?.map((quiz) => {
            return <QuizItem key={quiz.id} quiz={quiz} />
          })}
        </ul>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  await trpcSSG.prefetchQuery('quiz.getAll')

  return {
    props: {
      trpcState: trpcSSG.dehydrate(),
    },
    revalidate: 60 * 60 * 2, // 2 hours
  }
}

export default Home
