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

Then, configure access to a LibSQL database. For the ease of startup a `docker-compose.yaml` is provided in the `./docker` folder.
Then additionally use [Drizzle Kit](https://orm.drizzle.team/kit-docs) to initialize the schema. To start the dockerized database:

```bash
docker compose -f docker/docker-compose.yaml up --build --detach
# test with Turso CLI that you can connect
# turso db shell http://localhost:8080
# if using nvm
# nvm use

# setup the .env.local file
cp .env.template .env.local
# default of template is to use a localhost PostgreSQL database
npm run push
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Code

This project uses a LibSQL database to store the data and model the data.

To connect I use:

-   [Turso](https://docs.turso.tech/sdk/ts/quickstart)
-   [Drizzle](https://orm.drizzle.team/)

### Linting and Formatting

The usual suspects of:

-   [Prettier](https://prettier.io/)
-   [ESLint](https://eslint.org/)

Linting and formatting is enforced with a pre-commit hook maintained by [Husky](https://typicode.github.io/husky/).

There is also a GitHub action to double check this, maybe a stray `--no-verify` commit is done.

### Database Migrations

While iterating I might, need to change the tables in my Postgres database. And instead of taking time to reload data, I can use [Drizzle Kit](https://orm.drizzle.team/kit-docs) to do the migration for me

```bash
npm run generate
npm run push
```

## Database Host

Happily using [Turso](https://turso.tech/) for a distributed and replicated SQL database near the edge.

## NextJS

### Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
