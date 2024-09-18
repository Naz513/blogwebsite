export type Site = {
  NAME: string;
  EMAIL: string;
  TITLE: String;
  LOCATION: string;
  NUM_POSTS_ON_HOMEPAGE: number;
  NUM_WORKS_ON_HOMEPAGE: number;
  NUM_PROJECTS_ON_HOMEPAGE: number;
};

export type Metadata = {
  TITLE: string;
};

export type Socials = {
  NAME: string;
  HREF: string;
}[];
