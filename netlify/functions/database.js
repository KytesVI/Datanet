const { Client } = require('@notionhq/client');

exports.handler = async function(event, context) {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const databaseId = process.env.DATABASE_ID;
  if (!databaseId || !process.env.NOTION_API_KEY) {
    return { statusCode: 500, body: 'Missing Notion credentials' };
  }

  try {
    const response = await notion.databases.query({ database_id: databaseId });
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(response.results)
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: 'Error fetching database' };
  }
};
