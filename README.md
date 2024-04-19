# Match Stats Viewer

A consistent use case that I have is pulling together CSVs of data for a tournament or investigation and then making views of processed data to display a cool statistic.

My usual case is when organizing a gaming tournament with friends or other such. Then wanting to know simple things, like who has the highest value for this measurement. But how many games contributed to that statistic? And the questions and desire to know more continue.

This project uses a SQL relational model to display some example data from a recent tournament of mine for [Valorant](https://playvalorant.com/en-us/). The data is provided in the `./example-data` folder and can be input on the frontend.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Then, configure access to a PostgreSQL database. For the ease of startup a `docker-compose.yaml` is provided in the `./docker` folder.
To start the dockerized database:

```bash
docker compose -f docker/docker-compose.yaml up --build --detach
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Code

This project uses a PostgreSQL database to store the data and model the data.

To connect I use:

-   [Postgres.JS](https://github.com/porsager/postgres)
-   [Drizzle](https://orm.drizzle.team/)

### Linting and Formatting

The usual suspects of:

-   [Prettier](https://prettier.io/)
-   [ESLint](https://eslint.org/)

Linting and formatting is enforced with a pre-commit hook maintained by [Husky](https://typicode.github.io/husky/).

There is also a GitHub action to double check this, maybe a stray `--no-verify` commit is done.

## NextJS

### Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
