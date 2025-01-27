import { Client } from '@notionhq/client';

const NOTION_API_KEY = process.env.NOTION_API_KEY ?? '';
const NOTION_PHOTOS_DB_ID = process.env.NOTION_PHOTOS_DATABASE_ID ?? '';

const formatResponse = (items) => {
    if (!items.length) {
        return [];
    }

  return items.map((item) => ({
    priority: item['Priority'].number ?? -1,
    name: item['Name']['title'][0]['plain_text'] ?? '',
    caption: item['Caption']['rich_text'][0]['plain_text'] ?? '',
    file: item['Files & media']['files'][0]['file'] ?? null,
    src: item['Files & media']['files'][0]['file']['url'] ?? null,
    alt: item['Name']['title'][0]['plain_text'] ?? ''
  }));
};

export default async function handler(req, res) {
    const notion = new Client({
		auth: NOTION_API_KEY,
    });
    
    const data = await notion.databases.query({
		database_id: NOTION_PHOTOS_DB_ID
    });
    
    const content = data.results.map((i) => i.properties);

    res.status(200).json({ data: formatResponse(content) });
}
