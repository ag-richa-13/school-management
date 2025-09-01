import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="scroll-smooth">
      <Head>
        {/* Basic Meta */}
        <meta charSet="UTF-8" />
        <meta
          name="description"
          content="School Management System - Add and view schools easily"
        />
        <meta name="theme-color" content="#2563eb" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Fonts (optional, can use Google Fonts in _app.tsx instead) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="antialiased bg-gray-50 text-gray-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
