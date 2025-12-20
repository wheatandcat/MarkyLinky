export type Data = {
  title: string;
  url: string;
  favIconUrl: string;
  created: string;
};

export type Item = Data & {
  uuid: string;
};

export type ApiToken = {
  id: number;
  uuid: string;
  title: string;
  token: string;
  created: string;
};