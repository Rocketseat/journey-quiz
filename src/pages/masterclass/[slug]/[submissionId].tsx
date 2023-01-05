import { useState } from 'react'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Youtube, { YouTubeEvent } from 'react-youtube'
import PDFDocument from 'pdfkit/js/pdfkit.standalone'

import blobStream from 'blob-stream'

import { trpcSSG } from '~/server/trpc-ssg'

import rocketseatLogoImg from '~/assets/logo-rocketseat.svg'
import * as Dialog from '@radix-ui/react-dialog'
import { BookOpen, Spinner } from 'phosphor-react'
import { trpc } from '~/utils/trpc'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '~/contexts/ToastProvider'

const page = {
  react: {
    pageName: 'React',
    videoId: 'pDbcC-xSat4',
  },
  'fundamentos-web': {
    pageName: 'Fundamentos WEB',
    videoId: 'EOGN5ltRqOc',
  },
  'react-native': {
    pageName: 'React Native',
    videoId: 'ApSHnjXeAq0',
  },
}

const GenerateCertificateFormSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  phone: z.string().min(1, 'O telefone é obrigatório'),
})

type GenerateCertificateFormData = z.infer<typeof GenerateCertificateFormSchema>

export default function Masterclass() {
  const [isCertificateAvailable, setIsCertificateAvailable] = useState(false)
  const [isGenerateCertificateModalOpen, setIsGenerateCertificateModalOpen] =
    useState(false)

  const router = useRouter()

  const slug = String(router.query.slug) as keyof typeof page
  const submissionId = String(router.query.submissionId)

  const { addToast } = useToast()

  const { pageName, videoId } = page[slug]

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GenerateCertificateFormData>({
    resolver: zodResolver(GenerateCertificateFormSchema),
  })

  const {
    mutateAsync: generateCertificate,
    isLoading: isGeneratingCertificate,
    data: generateCertificateResult,
  } = trpc.useMutation('masterclass.generateCertificate')

  const checkElapsedTime = (e: YouTubeEvent<number>) => {
    const duration = e.target.getDuration()
    const currentTime = e.target.getCurrentTime()

    const videoProgressTargetMultiplier = 0.9 // 90% of video conclusion
    const targetProgress = duration * videoProgressTargetMultiplier

    if (currentTime >= targetProgress) {
      setIsCertificateAvailable(true)
    }
  }

  async function generateCertificatePDFFile(imageBase64: string) {
    const doc = new PDFDocument({ size: [842, 595] })

    const stream = doc.pipe(blobStream())

    const imageBuffer = Buffer.from(imageBase64, 'base64')

    doc.image(imageBuffer, 0, 0, { width: 842, height: 595 })

    doc.end()

    stream.on('finish', () => {
      const blob = stream.toBlob('application/pdf')

      window.open(URL.createObjectURL(blob), '_blank')
    })
  }

  async function handleGenerateUserCertificate({
    name,
    phone,
  }: GenerateCertificateFormData) {
    const { certificate } = await generateCertificate({
      name,
      phone,
      submissionId,
    })

    generateCertificatePDFFile(certificate)

    setIsGenerateCertificateModalOpen(false)

    addToast({
      title: 'Certificado gerado com sucesso',
      type: 'success',
    })
  }

  function handleOpenCertificateModal() {
    setIsGenerateCertificateModalOpen(true)
  }

  return (
    <main className="max-w-3xl mx-auto py-16 px-8">
      <Image src={rocketseatLogoImg} alt="Logo Rocketseat" />
      <h1 className="text-xl font-medium mt-6">
        Alcance seu próximo nível em {pageName}!
      </h1>
      <p className="mt-1 text-sm text-zinc-400">
        Ao final dessa masterclass você irá receber um certificado de
        participação.
      </p>

      <Youtube
        className="mt-4 aspect-video w-full"
        videoId={videoId}
        opts={{
          width: '100%',
        }}
        onStateChange={checkElapsedTime}
      />

      <ul className="mt-6 grid grid-cols-2 gap-6">
        <li
          className={`hover:border-violet-400 cursor-pointer relative group p-6 flex flex-col items-start gap-4 border border-zinc-700 rounded-lg`}
        >
          <div className="min-w-0 flex-1">
            <div className={`group-hover:text-violet-400 font-medium`}>
              <Link href={`/quizzes/material`}>
                <a className="font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Material complementar
                </a>
              </Link>
            </div>
            <p className="text-sm text-zinc-400 mt-1">
              📚 Acesse o material complementar para acelerar o seu
              desenvolvimento
            </p>
          </div>
        </li>
        <li
          className={` ${
            isCertificateAvailable
              ? 'hover:border-violet-400 cursor-pointer'
              : 'opacity-[0.6]'
          } relative group p-6 flex flex-col items-start gap-4 border border-zinc-700 rounded-lg`}
        >
          <div className="min-w-0 flex-1">
            <div
              className={`${
                isCertificateAvailable ? 'group-hover:text-violet-400' : ''
              } font-medium`}
            >
              {isCertificateAvailable ? (
                <button onClick={handleOpenCertificateModal}>
                  <a className="font-medium">
                    <span className="absolute inset-0" aria-hidden="true" />
                    Certificado
                  </a>
                </button>
              ) : (
                <p>Certificado</p>
              )}
            </div>
            <p className="text-sm text-zinc-400 mt-1">
              🎉 Parabéns! Agora você pode gerar seu certificado clicando aqui.
            </p>
          </div>
        </li>
        <Dialog.Root
          open={isGenerateCertificateModalOpen}
          onOpenChange={setIsGenerateCertificateModalOpen}
        >
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-30 bg-black/60" />

            <Dialog.Content className="bg-zinc-800 z-40 rounded-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fixed p-6 w-full max-w-sm">
              <Dialog.Title className="text-2xl font-bold">
                Preencha os campos...
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-zinc-300">
                E receba seu certificado de conclusão da masterclass.
              </Dialog.Description>

              <form
                onSubmit={handleSubmit(handleGenerateUserCertificate)}
                noValidate={true}
                className="pt-4 mt-4 border-t border-t-zinc-700"
              >
                <input
                  type="string"
                  placeholder="Digite seu nome completo"
                  className={`bg-zinc-900 px-3 py-3 rounded block mt-1 w-full border disabled:opacity-50  ${
                    errors?.name ? 'border-red-500' : 'border-zinc-900'
                  }`}
                  required
                  disabled={generateCertificateResult?.success === true}
                  {...register('name')}
                />

                {errors?.name && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.name.message}
                  </p>
                )}

                <input
                  type="string"
                  placeholder="Digite seu telefone"
                  className={`bg-zinc-900 px-3 py-3 rounded block mt-2 w-full border disabled:opacity-50  ${
                    errors?.phone ? 'border-red-500' : 'border-zinc-900'
                  }`}
                  required
                  disabled={generateCertificateResult?.success === true}
                  {...register('phone')}
                />

                {errors?.phone && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {errors.phone.message}
                  </p>
                )}

                <button
                  type="submit"
                  className="mt-6 flex w-full gap-2 justify-center items-center rounded-md border border-transparent bg-violet-600 py-3 px-8 text-md font-medium text-white shadow-sm hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={
                    isGeneratingCertificate ||
                    generateCertificateResult?.success
                  }
                >
                  {isGeneratingCertificate ? (
                    <Spinner className="animate-spin w-5 h-5" />
                  ) : (
                    <>
                      <BookOpen className="w-5 h-5" weight="bold" />
                      Receber certificado
                    </>
                  )}
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
      </ul>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const slug = String(query.slug)
  const submissionId = String(query.submissionId)

  if (!(slug in page) || !submissionId) {
    return {
      notFound: true,
    }
  }

  await trpcSSG.fetchQuery('masterclass.interested', { submissionId })

  return {
    props: {},
  }
}
