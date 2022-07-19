// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { Client } = require('@notionhq/client');

export default async function handler(req, res) {
  const notion = new Client({ auth: process.env.NEXT_PUBLIC_NOTION_INTEGRATION_TOKEN })
  const pages = await notion.databases.query({
    database_id: process.env.NEXT_PUBLIC_NOTION_TASKS_DATABASE_ID,
    filter:{
      and: [
        {
          property: "status",
          select: {
            does_not_equal: "Completed"
          }
        },
        {
          property: "status",
          select: {
            does_not_equal: "Estudo"
          }
        },
        {
          property: "status",
          select: {
            does_not_equal: "Not Completed"
          }
        }
      ],
    },sorts:[
      {
        property: "status",
        direction: "ascending"
      },
      {
        property: "priority",
        direction: "descending"
      },
      {
        property: "date",
        direction: "ascending"
      },
    ]
  })

  const data = pages.results  
  console.log(data)
  let output = []
  
  await Promise.all(data.map(async(i)=>{
    let page = {
      id: i.id,
      title: i.properties.Name.title[0].text.content,
      date: i.properties.date.date?i.properties.date.date.start:"XXXX-mm-dd",
      done: i.properties.done.checkbox,
      priority: i.properties.priority.select.name,
      status: i.properties.status.select.name,
      subtasks:[],
    }

    const blocks = await notion.blocks.children.list({
      block_id: i.id,
    });  

    blocks.results.map((j)=>{
      if (j.to_do && j.to_do.rich_text[0]) page.subtasks.push(j.to_do.rich_text[0].text.content)
      else page.subtasks.push([])
    })


    output.push(page)
  }))

  return res.json(output)
}
