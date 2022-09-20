import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="pt">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
          rel="stylesheet"
        />

        <link
          rel="shortcut icon"
          href="https://www.rocketseat.com.br/favicon.ico"
          type="image/x-icon"
        />
      </Head>
      <body className="bg-zinc-900 text-zinc-100">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
