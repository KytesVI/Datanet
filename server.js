const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const DATABASE_ID = process.env.DATABASE_ID;
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_VERSION = '2022-06-28';

app.get('/database.json', async (req, res) => {
  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${NOTION_API_KEY}`,
          'Notion-Version': NOTION_VERSION,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      },
    );

    if (!response.ok) {
      const text = await response.text();
      console.error(text);
      return res.status(response.status).send('Error querying database');
    }

    const data = await response.json();
    // Forward the Notion query payload directly
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching database');
  }
});

app.get('/page/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`https://api.notion.com/v1/pages/${id}`, {
      headers: {
        Authorization: `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': NOTION_VERSION,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(text);
      return res.status(response.status).send('Error fetching page');
    }

    const page = await response.json();
    const props = page.properties || {};
    const titleKey = Object.keys(props).find(key => props[key].type === 'title');
    const nameProp = props[titleKey]?.title || [];
    const name = nameProp.map(t => t.plain_text).join('') || 'Untitled';

    let description = '';
    const descProp = page.properties?.Description || page.properties?.description;
    if (descProp?.rich_text) {
      description = descProp.rich_text.map(t => t.plain_text).join('');
    }

    res.json({ id, name, description });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching page');
  }
});

app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
