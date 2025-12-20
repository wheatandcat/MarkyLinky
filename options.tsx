import titleImage from "data-base64:~assets/title.png";
import { Storage } from "@plasmohq/storage";
import { useStorage } from "@plasmohq/storage/hook";
import type { Provider, Session, User } from "@supabase/supabase-js";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "~core/supabase";
import Loading from "~uiParts/Loading";
import Information from "~uiParts/Login/Information";
import Login from "~uiParts/Login/Login";
import Success from "~uiParts/Success";
import Tips from "~uiParts/Login/Tips";
import ApiKey from "~uiParts/ApiKey/List";
import {
  getAllItems,
  insertItems,
  getAllApiKeys,
  deleteApiKey,
} from "./lib/database";
import type { Data, ApiToken } from "./lib/storage";

import "./style.css";

const storage = new Storage();

function IndexOptions() {
  const [user, setUser] = useStorage<User>({
    key: "user",
    instance: new Storage({
      area: "local",
    }),
  });
  const [session, setSession] = useStorage<Session | null>({
    key: "session",
    instance: new Storage({ area: "local" }),
  });
  const [loading, setLoading] = useState(false);
  const [fade, setFade] = useState(false);
  const [apiTokens, setApiTokens] = useStorage<ApiToken[]>("apiTokens", []);

  const getApiTokens = useCallback(async () => {
    if (!user) return;
    const { data: apiTokens, error: apiTokensError } = await getAllApiKeys(
      user.id
    );
    if (apiTokensError) {
      alert("API Keyの同期に失敗しました");
    }
    if (apiTokens) {
      setApiTokens(apiTokens);
    }
  }, [user, setApiTokens]);

  useEffect(() => {
    async function init() {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error(error);
        return;
      }
      if (data.session) {
        setUser(data.session.user);
        setSession(data.session);

        chrome.runtime.sendMessage({
          type: "Login",
        });
      }
    }

    init();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);

      if (s) {
        chrome.runtime.sendMessage({ type: "Login" });
      } else {
        chrome.runtime.sendMessage({ type: "Logout" });
      }
    });

    return () => sub.subscription.unsubscribe();
  }, [setUser, setSession]);

  const handleOAuthLogin = async (provider: Provider, scopes = "email") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        scopes,
        redirectTo: location.href,
      },
    });
  };

  const onSuccess = () => {
    setFade(true);

    setTimeout(() => {
      setFade(false);
    }, 2000);
  };

  const handleAsync = async () => {
    setLoading(true);
    setFade(false);
    const items = (await storage.get<Data[]>("saveItems")) ?? [];

    const { data: getItems, error: getErr } = await getAllItems(user.id);
    if (getErr) {
      alert(`取得に失敗しました。:${getErr.message}`);
      setLoading(false);
      return;
    }

    const filterURL = getItems?.map((item) => item.url);

    const saveItems = items
      .filter((item) => {
        return !filterURL?.includes(item.url);
      })
      .map((item) => ({
        uuid: user.id,
        title: item.title,
        url: item.url,
        favIconUrl: item.favIconUrl,
        created: item.created,
      }));

    if (saveItems.length === 0) {
      await dataSync(saveItems, getItems);
      setLoading(false);
      onSuccess();
      return;
    }

    const { error } = await insertItems(saveItems);
    if (error) {
      alert(`同期に失敗しました。:${error.message}`);
      setLoading(false);
      return;
    }
    await dataSync(saveItems, getItems);
    setLoading(false);
    onSuccess();
  };

  const dataSync = async (saveItems, getItems) => {
    const mixItems = [...saveItems, ...getItems]
      .map((item) => ({
        uuid: user.id,
        title: item.title,
        url: item.url,
        favIconUrl: item.favIconUrl,
        created: item.created,
      }))
      .sort(
        (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
      );

    console.log("mixItems", mixItems);

    try {
      await storage.set("saveItems", mixItems);
    } catch (error) {
      console.error("error", error);
    }
  };

  const onAddApiKey = async (title: string) => {
    const response = await fetch(
      `${process.env.PLASMO_PUBLIC_SUPABASE_URL}/functions/v1/create-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ title }),
      }
    );
    if (!response.ok) {
      alert(`API Keyの作成に失敗しました。`);
      return false;
    }

    getApiTokens();

    return true;
  };

  const onDeleteApiKey = async (id: number) => {
    const { error } = await deleteApiKey(id);
    if (error) {
      alert(`API Keyの削除に失敗しました。:${error.message}`);
      return false;
    }

    getApiTokens();

    return true;
  };

  return (
    <main>
      <div
        className={`transition-all duration-200	 ${
          fade ? "opacity-100" : "opacity-0"
        } absolute top-3 right-10`}
      >
        <Success onClose={() => setFade(false)} />
      </div>

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
            gap: 4.2,
          }}
        >
          {user && (
            <>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 text-xs font-medium text-gray-400 dark:text-white"
                >
                  メールアドレス:
                </label>
                <p className="text-base font-semibold text-gray-600 dark:text-white">
                  {user.email}
                </p>
              </div>

              <div className="flex flex-col justify-center py-5">
                <button
                  className=" bg-blue-500 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-600 relative text-white font-bold py-2 px-4 rounded-full"
                  onClick={() => handleAsync()}
                  disabled={loading}
                  type="button"
                >
                  {!!loading && (
                    <div className="absolute left-4">
                      <Loading />
                    </div>
                  )}
                  データ同期
                </button>
                <br />
                <button
                  className=" bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
                  onClick={() => {
                    supabase.auth.signOut();
                    setUser(null);
                    chrome.runtime.sendMessage({
                      type: "Logout",
                    });
                  }}
                  type="button"
                >
                  ログアウト
                </button>
              </div>
            </>
          )}
          {!user && <Login onOAuthLogin={handleOAuthLogin} />}
        </div>
        <Tips />
        {user && (
          <ApiKey
            apiTokens={apiTokens}
            onAddApiKey={onAddApiKey}
            onDeleteApiKey={onDeleteApiKey}
          />
        )}
        <Information />
      </div>
    </main>
  );
}

export default IndexOptions;
