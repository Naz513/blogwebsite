import type { Site, Info, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Mohd Saquib",
  EMAIL: "nsaquib96@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 2,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const INFO: Info = {
  LOCATION: "WAshington DC, US",
  TITLE: "Cloud Solutions Architect",
};

export const HOME: Metadata = {
  TITLE: "Home",
};

export const WORK: Metadata = {
  TITLE: "Work",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
};

export const SOCIALS: Socials = [
  { 
    NAME: "github",
    HREF: "https://github.com/Naz513"
  },
  { 
    NAME: "linkedin",
    HREF: "https://www.linkedin.com/in/mohdnsaquib/",
  }
];
