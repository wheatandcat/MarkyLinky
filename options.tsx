import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"
import type { Provider, User } from "@supabase/supabase-js"
import titleImage from "data-base64:~assets/title.png"
import { useEffect, useState } from "react"

import { supabase } from "~core/supabase"

import { type Data } from "./lib/storage"

import "./style.css"

const storage = new Storage()

function IndexOptions() {
  const [user, setUser] = useStorage<User>({
    key: "user",
    instance: new Storage({
      area: "local"
    })
  })

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    async function init() {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error(error)
        return
      }
      if (data.session) {
        setUser(data.session.user)
        sendToBackground({
          name: "init-session",
          body: {
            refresh_token: data.session.refresh_token,
            access_token: data.session.access_token
          }
        })
      }
    }

    init()
  }, [])

  const handleEmailLogin = async (
    type: "LOGIN" | "SIGNUP",
    username: string,
    password: string
  ) => {
    try {
      const {
        error,
        data: { user }
      } =
        type === "LOGIN"
          ? await supabase.auth.signInWithPassword({
              email: username,
              password
            })
          : await supabase.auth.signUp({ email: username, password })

      if (error) {
        alert(`Error with auth: ${error.message}`)
      } else if (!user) {
        alert("Signup successful, confirmation mail should be sent soon!")
      } else {
        setUser(user)
      }
    } catch (error) {
      console.log("error", error)
      alert(error.error_description || error)
    }
  }

  const handleOAuthLogin = async (provider: Provider, scopes = "email") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        scopes,
        redirectTo: location.href
      }
    })
  }

  const handleAsync = async () => {
    const items = (await storage.get<Data[]>("saveItems")) ?? []

    const { data: getItems, error: getErr } = await supabase
      .from("items")
      .select()
      .eq("uuid", user.id)
    if (getErr) {
      alert(`取得に失敗しました。:${getErr.message}`)
    }

    const filterURL = getItems?.map((item) => item.url)

    const saveItems = items
      .filter((item) => {
        return !filterURL?.includes(item.url)
      })
      .map((item) => ({
        uuid: user.id,
        title: item.title,
        url: item.url,
        favIconUrl: item.favIconUrl,
        created: item.created
      }))

    if (saveItems.length === 0) {
      await dataSync(saveItems, getItems)
      return
    }

    console.log("save:", saveItems)

    const { error } = await supabase.from("items").insert(saveItems)
    if (error) {
      alert(`同期に失敗しました。:${error.message}`)
    }
    await dataSync(saveItems, getItems)
  }

  const dataSync = async (saveItems, getItems) => {
    const mixItems = [...saveItems, ...getItems]
      .map((item) => ({
        uuid: user.id,
        title: item.title,
        url: item.url,
        favIconUrl: item.favIconUrl,
        created: item.created
      }))
      .sort(function (a, b) {
        return new Date(b.created).getTime() - new Date(a.created).getTime()
      })

    await storage.set("saveItems", mixItems)
  }

  return (
    <main>
      <div className="py-3 pl-3 bg-primary-300">
        <img src={titleImage} alt="title logo" width={200} />
      </div>
      <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
      <div className="container mx-auto px-4 py-4">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 360,
            justifyContent: "space-between",
            gap: 4.2
          }}>
          {user && (
            <>
              <div>
                <label className="block mb-1 text-xs font-medium text-gray-400 dark:text-white">
                  Email:
                </label>
                <p className="text-base font-semibold text-gray-600 dark:text-white">
                  {user.email}
                </p>
                <br />
                <label className="block mb-1 text-xs font-medium text-gray-400 dark:text-white">
                  User ID:
                </label>
                <p className="text-base font-semibold text-gray-600 dark:text-white">
                  {user.id}
                </p>
              </div>
              <br />

              <div className="flex flex-col justify-center py-5">
                <button
                  className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                  onClick={() => handleAsync()}>
                  データ同期
                </button>
                <br />
                <button
                  className=" bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
                  onClick={() => {
                    supabase.auth.signOut()
                    setUser(null)
                  }}>
                  ログアウト
                </button>
              </div>
            </>
          )}
          {!user && (
            <>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Email
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="text"
                placeholder="Your Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <br />
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Password
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <br />
              <br />
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                onClick={() => {
                  handleEmailLogin("SIGNUP", username, password)
                }}>
                新規登録
              </button>
              <br />
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                onClick={() => {
                  handleEmailLogin("LOGIN", username, password)
                }}>
                ログイン
              </button>
              <br />
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                onClick={() => {
                  handleOAuthLogin("github")
                }}>
                GitHubでログイン
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  )
}

export default IndexOptions
