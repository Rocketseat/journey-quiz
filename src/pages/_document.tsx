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

        <script
          id="active-campaign"
          dangerouslySetInnerHTML={{
            __html: `
            (function(e,t,o,n,p,r,i){e.visitorGlobalObjectAlias=n;e[e.visitorGlobalObjectAlias]=e[e.visitorGlobalObjectAlias]||function(){(e[e.visitorGlobalObjectAlias].q=e[e.visitorGlobalObjectAlias].q||[]).push(arguments)};e[e.visitorGlobalObjectAlias].l=(new Date).getTime();r=t.createElement("script");r.src=o;r.async=true;i=t.getElementsByTagName("script")[0];i.parentNode.insertBefore(r,i)})(window,document,"https://diffuser-cdn.app-us1.com/diffuser/diffuser.js","vgo");
              vgo('setAccount', '27615630');
              vgo('setTrackByDefault', true);

              vgo('process');`,
          }}
        />
      </Head>
      <body className="bg-zinc-900 text-zinc-100">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
