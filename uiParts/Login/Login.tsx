import type { Provider } from "@supabase/supabase-js"

import GitHub from "~uiParts/Icon/GitHub"
import Google from "~uiParts/Icon/Google"

type Props = {
  onOAuthLogin: (provider: Provider, scopes?: string) => void
}

function Login(props: Props) {
  return (
    <>
      <div className="py-3 leading-5">
        新規登録、ログインのどちらも以下のボタンから行えます。
        <br />
        <a
          href="https://wheatandcat.github.io/MarkyLinky/TERMS"
          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
          target="_blank"
          rel="noopener noreferrer">
          利用規約
        </a>
        、
        <a
          href="https://wheatandcat.github.io/MarkyLinky/PRIVACY"
          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
          target="_blank"
          rel="noopener noreferrer">
          プライバシーポリシー
        </a>
        に同意したい方は、以下のボタンからログインしてください。
      </div>

      <button
        className="bg-blue-500 hover:bg-blue-700 relative flex justify-center items-center text-white font-bold py-2 px-4 rounded-full"
        onClick={() => {
          props.onOAuthLogin("google")
        }}>
        <div className="absolute left-3">
          <Google />
        </div>
        Googleでログイン
      </button>
      <br />
      <button
        className="bg-gray-500 hover:bg-gray-700 relative flex justify-center items-center text-white font-bold py-2 px-4 rounded-full"
        onClick={() => {
          props.onOAuthLogin("github")
        }}>
        <div className="absolute left-3">
          <GitHub />
        </div>
        GitHubでログイン
      </button>
      <br />
    </>
  )
}

export default Login
