export type Data = {
  title: string;
  url: string;
  favIconUrl: string;
  created: string;
};

export type Item = Data & {
  uuid: string;
};
