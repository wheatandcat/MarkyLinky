import { supabase } from "~core/supabase";
import type { Item } from "./storage";

export const getAllItems = async (uuid: string) => {
  return await supabase.from("items").select().eq("uuid", uuid);
};

export const insertItem = async (item: Item) => {
  return await supabase.from("items").insert(item);
};

export const insertItems = async (items: Item[]) => {
  return await supabase.from("items").insert(items);
};

export const deleteItem = async (uuid: string, url: string) => {
  return await supabase.from("items").delete().eq("uuid", uuid).eq("url", url);
};

export const deleteItems = async (uuid: string, urls: string[]) => {
  return await supabase.from("items").delete().eq("uuid", uuid).in("url", urls);
};

export const getAllApiKeys = async (uuid: string) => {
  return await supabase.from("api_tokens").select().eq("uuid", uuid);
};

export const deleteApiKey = async (id: number) => {
  return await supabase.from("api_tokens").delete().eq("id", id);
};