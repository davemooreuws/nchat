# NChat

Realtime chat using Websockets, Next.js, [Nitric](https://nitric.io) and Clerk.

![NChat App](/src/app/opengraph-image.png)

## Tools used

- Clerk
- Next.js
- Nitric
- Tailwind CSS

## Demo

You can view and participate in a live demo [here](https://nchat.nitric.rocks/).

> Apologies if the demo is down, if you're interested in trying it out let me know in issues or you can also run it on your local machine or deploy it to your own AWS account.

## Local Development

### Requirements

- [Nitric CLI](https://nitric.io/docs/guides/getting-started/installation)
- Node.js
- yarn

### Steps

1. `yarn install`
2. Install the [Nitric CLI](https://nitric.io/docs/guides/getting-started/installation)
3. Create a [Clerk App](https://dashboard.clerk.com/apps/new) for development purposes.
4. Add GitHub as a social connection under User & Authentication -> Social Connections.
5. Get your Clerk API Keys under Developers -> API Keys
6. `cp .env.example .env` and add values for `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` from step 5.
7. `yarn dev:server`
8. `yarn dev`

## Deploy to Production

### Requirements

- [Nitric CLI](https://nitric.io/docs/guides/getting-started/installation)
- Node.js
- yarn
- Pulumi configured on your machine
- AWS configured on your machine

### Steps

1. Fork and Push this repo to GitHub
2. Create a [Clerk App](https://dashboard.clerk.com/apps/new) for production purposes.
3. Deploy backend to AWS using `nitric up`
4. Deploy to Vercel and add `.env` values (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `NEXT_PUBLIC_NITRIC_API_BASE_URL`\*, `CLERK_SECRET_KEY`)

\* `NEXT_PUBLIC_NITRIC_API_BASE_URL` is your production API endpoint. You can find this from the **cli output** after using `nitric up` to deploy to the cloud.
