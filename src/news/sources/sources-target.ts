interface theNYTData {
  response: {
    docs: {
      headline: {
        main: string;
      };
      web_url: string;
      pub_date: string;
    }[];
  };
}
interface theGuardianData {
  response: {
    results: {
      webTitle: string;
      webUrl: string;
      webPublicationDate: string;
    }[];
  };
}
interface gNewsData {
  articles: {
    title: string;
    url: string;
    publishedAt: string;
    source: { name: string };
  }[];
}
