# Datanet

This project displays data from a Notion database. It can be deployed to Netlify using serverless functions.

## Deploying to Netlify

1. Create a new site in Netlify and link this repository.
2. In the site settings, add two environment variables:
   - `NOTION_API_KEY` – your Notion integration token.
   - `DATABASE_ID` – the ID of the database to query.
3. The provided `netlify.toml` routes `/database` and `/page/:id` requests to serverless functions located in `netlify/functions`.
4. Push your code and Netlify will build and deploy the site automatically.

During local development you can run the functions with [Netlify CLI](https://docs.netlify.com/cli/get-started/):

```bash
npm install -g netlify-cli
netlify dev
```
