import { Html, Head, Main, NextScript } from "next/document";
import { getCssText } from "../stitches.config";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>TicTacToe - capy.lol</title>
        <style
          id="stitches"
          dangerouslySetInnerHTML={{ __html: getCssText() }}
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="capy.lol" />
        <meta property="og:title" content="Capybara Tic Tac Toe" />
        <meta
          property="og:description"
          content="Join your friends to play capybara tic-tac-toe!"
        />
        <meta name="twitter:creator" content="@devlooskie" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ffffff" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#E9E2D8" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
