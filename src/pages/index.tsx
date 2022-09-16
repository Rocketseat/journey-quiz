import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { CaretRight } from 'phosphor-react'

import { trpc } from '../utils/trpc'

import rocketseatLogoImg from '../assets/logo-rocketseat.svg'

const Home: NextPage = () => {
  const { data: quizzes, isLoading: isLoadingQuizzes } = trpc.useQuery([
    'quiz.getAll',
  ])

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
            return (
              <li key={quiz.id}>
                <div className="relative group py-4 flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-amber-300">
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 80 57"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M79.1787 37.3803C78.3004 31.905 74.73 27.308 64.1559 23.0191C60.4829 21.3309 56.3878 20.1219 55.1673 17.3385C54.7338 15.7187 54.6768 14.8061 54.9506 13.8252C55.7376 10.6426 59.5361 9.65025 62.5475 10.5628C64.4867 11.213 66.3232 12.7074 67.4296 15.0913C72.6084 11.7378 72.5969 11.7605 76.2129 9.45646C74.8897 7.40322 74.1825 6.45634 73.3156 5.57813C70.2015 2.09904 65.9582 0.308162 59.1711 0.445044C57.9962 0.593333 56.81 0.752915 55.635 0.901318C52.2473 1.75683 49.019 3.5363 47.1255 5.92033C41.4449 12.3652 43.0646 23.6465 49.9772 28.2892C56.7871 33.3994 66.7909 34.5629 68.0684 39.3424C69.3118 45.1941 63.7682 47.0875 58.2585 46.4146C54.1977 45.5705 51.9393 43.5059 49.4981 39.753C45.0039 42.3538 45.0039 42.3538 40.3841 45.0116C41.4792 47.407 42.6312 48.4907 44.4678 50.5667C53.1598 59.3842 74.9125 58.9507 78.8138 45.6047C78.9734 45.1484 80.0229 42.0913 79.1787 37.3803V37.3803ZM34.2357 1.15216H23.0114C23.0114 10.848 22.9659 20.4754 22.9659 30.1712C22.9659 36.3423 23.2853 42.0001 22.2815 43.7339C20.6389 47.1444 16.3841 46.7225 14.445 46.0608C12.4716 45.0912 11.4678 43.711 10.3043 41.7605C9.9849 41.2016 9.74535 40.7681 9.66539 40.7339C6.61988 42.5932 3.58554 44.4638 0.539917 46.3233C2.05714 49.4373 4.29277 52.1407 7.15589 53.8973C11.4335 56.4638 17.1825 57.2509 23.194 55.8707C27.1066 54.73 30.4829 52.3689 32.2509 48.7757C34.8061 44.0647 34.2585 38.3613 34.2357 32.0533C34.2928 21.7643 34.2357 11.4753 34.2357 1.15216Z"
                          fill="#323330"
                        />
                      </svg>
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="group-hover:text-violet-400 font-medium">
                      <Link
                        href={`/api/quizzes/${quiz.id}/start`}
                        className="font-medium"
                      >
                        <a className="font-medium">
                          <span
                            className="absolute inset-0"
                            aria-hidden="true"
                          />
                          {quiz.title}
                        </a>
                      </Link>
                    </div>
                    <p className="text-sm text-zinc-400 mt-1">
                      {quiz.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0 self-center">
                    <CaretRight
                      className="h-5 w-5 text-zinc-400"
                      aria-hidden="true"
                    />
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

export default Home
