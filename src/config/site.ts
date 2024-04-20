export const siteConfig = {
    github: {
        link: "https://github.com/rhyn0/match-stats-viewer",
    },
    metadata: {
        title: {
            default: "Match Stats",
            template: "%s | Match Stats",
        },
        description: "Query and display match statistics from input data",
    },
};

export type SiteConfigType = typeof siteConfig;
