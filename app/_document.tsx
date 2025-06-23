import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        {/* 카카오 SDK 스크립트 추가 */}
        <script 
          src="https://developers.kakao.com/sdk/js/kakao.js" 
          async
          defer
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
