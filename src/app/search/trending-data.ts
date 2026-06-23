export interface TrendingDeveloperRepo {
  name: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  updated: string;
}

export interface TrendingDeveloperLang {
  name: string;
  color: string;
  percentage: number;
}

export interface TrendingDeveloper {
  rank: number;
  displayName: string;
  username: string;
  bio: string;
  location: string;
  website: string;
  twitter: string;
  avatarColor: string;
  followers: number;
  following: number;
  type?: string;
  topLanguages: TrendingDeveloperLang[];
  pinnedRepos: TrendingDeveloperRepo[];
  repos: TrendingDeveloperRepo[];
  popularRepo: {
    name: string;
    description: string;
  };
}
