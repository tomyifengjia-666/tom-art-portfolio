// api/notion.js
const { Client } = require('@notionhq/client');

// 初始化Notion客户端
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

module.exports = async (req, res) => {
  try {
    const databaseId = '30ed872b-594c-8188-859b-00376a084601';
    
    // 查询数据库
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [{ property: "排序", direction: "ascending" }],
    });
    
    // 转换数据格式
    const works = response.results.map(item => {
      return {
        id: item.id,
        title: item.properties.标题.title[0]?.plain_text || "未命名作品",
        category: item.properties.分类.select?.name || "未分类",
        desc: item.properties.描述.rich_text[0]?.plain_text || "无描述",
        imgUrl: item.properties.图片.files[0]?.file?.url || item.properties.图片.files[0]?.external?.url || ""
      };
    });
    
    res.status(200).json(works);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '获取数据失败' });
  }
};
