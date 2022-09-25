import type { GetStaticProps, NextPage } from 'next'
import Image from 'next/image'

import { trpc } from '../utils/trpc'
import { trpcSSG } from '../server/trpc-ssg'
import { NextSeo } from 'next-seo'

import rocketseatLogoImg from '../assets/logo-rocketseat.svg'
import { CaretRight, ClockAfternoon, ListBullets } from 'phosphor-react'
import Link from 'next/link'

const Home: NextPage = () => {
  const { data: quizzes } = trpc.useQuery(['quiz.getAll'])

  return (
    <>
      <NextSeo title="Teste seus conhecimentos em programação" />

      <main className="max-w-3xl mx-auto py-16 px-8">
        <Image src={rocketseatLogoImg} alt="" />

        <h2 className="text-xl font-medium mt-6">
          Qual teste você quer realizar?
        </h2>

        <p className="mt-1 text-sm text-zinc-400">
          Inicie escolhendo um dos testes da lista abaixo
        </p>

        <ul role="list" className="mt-6 grid grid-cols-2 gap-6">
          {quizzes?.map((quiz) => {
            return (
              <li
                key={quiz.id}
                className="relative group p-6 flex flex-col items-start gap-4 border border-zinc-700 rounded-lg hover:border-violet-400"
              >
                <img
                  className="w-10"
                  src={`/logo-${quiz.imageUrl}.svg`}
                  alt=""
                />
                <div className="min-w-0 flex-1">
                  <div className="group-hover:text-violet-400 font-medium">
                    <Link href={`/quizzes/${quiz.slug}`}>
                      <a className="font-medium">
                        <span className="absolute inset-0" aria-hidden="true" />
                        {quiz.title}
                      </a>
                    </Link>
                  </div>
                  <p className="text-sm text-zinc-400 mt-1">
                    {quiz.description}
                  </p>
                  <div className="flex text-zinc-400 text-xs gap-3 mt-4">
                    <span className="inline-flex items-center gap-1">
                      <ClockAfternoon />
                      10 - 40min
                    </span>

                    <span className="inline-flex items-center gap-1">
                      <ListBullets />
                      20 questões
                    </span>
                  </div>
                </div>
              </li>
            )
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
