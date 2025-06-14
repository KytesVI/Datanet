const { Client } = require('@notionhq/client');

exports.handler = async function(event, context) {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const id = event.path.split('/').pop();
  if (!id) {
    return { statusCode: 400, body: 'Missing page id' };
  }

  try {
    const response = await notion.blocks.children.list({ block_id: id, page_size: 100 });
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(response.results)
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: 'Error fetching page' };
  }
};
