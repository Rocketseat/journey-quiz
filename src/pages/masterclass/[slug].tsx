import Image from 'next/image'
import Link from 'next/link'
import rocketseatLogoImg from '../../assets/logo-rocketseat.svg'

const buttons = [
  {
    slug: "",
    title: "Material complementar",
    description: "📚 Acesse o material complementar para acelerar o seu desenvolvimento",
    isActive: true,
  },
  {
    slug: "",
    title: "Certificado",
    description: "🎉 Parabéns! Agora você pode gerar seu certificado clicando aqui.",
    isActive: false,
  },
]

export default function Masterclass() {
  return (

    <main className="max-w-3xl mx-auto py-16 px-8">

      <Image src={rocketseatLogoImg} alt="Logo Rocketseat" />

      <h1 className="text-xl font-medium mt-6">
        Alcance seu próximo nível em React!
      </h1>
      <p className="mt-1 text-sm text-zinc-400">
        Ao final dessa masterclass você irá receber um certificado de participação.
      </p>

      <iframe
        className='mt-4 aspect-video'
        width="100%"
        src="https://www.youtube.com/embed/pDbcC-xSat4?modestbranding=1&rel=0"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>

      <ul className="mt-6 grid grid-cols-2 gap-6">
        {buttons?.map((button) => {
          return (
            <li
              key={button.title}
              className={` ${button.isActive ? "hover:border-violet-400 cursor-pointer" : "opacity-[0.6]"} relative group p-6 flex flex-col items-start gap-4 border border-zinc-700 rounded-lg`}
            >
              <div className="min-w-0 flex-1">
                <div className={`${button.isActive ? "group-hover:text-violet-400" : ""} font-medium`}>
                  {button.isActive ?
                    <Link href={`/quizzes/${button.slug}`} >
                      <a className="font-medium">
                        <span className="absolute inset-0" aria-hidden="true" />
                        {button.title}
                      </a>
                    </Link> :
                    button.title
                  }

                </div>
                <p className="text-sm text-zinc-400 mt-1">
                  {button.description}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </main>
  )
}
