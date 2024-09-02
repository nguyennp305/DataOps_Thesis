import faker from 'faker'
import { Response, Request } from 'express'
// import axios from 'axios'

const BASE_URL = 'http://localhost:8089/api/'

let enterpriseList: any[] = []
const enterpriseCount = 100

for (let i = 0; i < enterpriseCount; i++) {
  enterpriseList.push({
    id: i,
    author: faker.name.findName(),
    type: faker.random.arrayElement(['CN', 'US', 'JP', 'EU']),
    title: faker.lorem.sentence(6, 10),
    timestamp: faker.date.past().getTime(),
    status: faker.random.arrayElement(['published', 'draft', 'deleted']),
    reviewer: faker.name.findName()
  })
}

export const getEnterprises = async(req: Request, res: Response) => {
  // const { page = 0, size = 10, word, startDate, enbDate } = req.query
  // const url = BASE_URL + 'enterprise'
  // let params = `?page=${page}&size=${size}`
  // if (word) {
  //   params += `&word=${word}`
  // }
  // if (startDate) {
  //   params += `&startDate=${startDate}`
  // }
  // if (enbDate) {
  //   params += `&enbDate=${enbDate}`
  // }
  // const response = await axios.get(url + params)
  //   return res.json({
  //     code: 20000,
  //     data: {
  //       items: response.data.data,
  //       total: response.data.total,
  //       limit: parseInt(size.toString()),
  //       page: parseInt(page.toString()),
  //     },
  //   });

  const { page = 1, limit = 10, title, status, type, author, reviewer, sort } = req.query
  let mockList = enterpriseList.filter(item => {
    if (title && item.title.indexOf(title as string) < 0) return false
    if (author && item.author.indexOf(author as string) < 0) return false
    if (reviewer && item.reviewer.indexOf(reviewer as string) < 0) return false
    if (type && item.type !== type) return false
    if (status && item.status !== status) return false
    return true
  })
  if (sort === '-id') {
    mockList = mockList.reverse()
  }
  const pageList = mockList.filter((_, index) =>
    index < (limit as number) * (page as number) &&
    index >= (limit as number) * (page as number - 1)
  )
  return res.json({
    code: 20000,
    data: {
      items: pageList,
      total: mockList.length,
      limit: parseInt(limit.toString()),
      page: parseInt(page.toString())
    }
  })
}

export const updateEnterprise = (req: Request, res: Response) => {
  const { id } = req.params
  const enterprise = req.query
  let updated = false
  for (let i = 0; i < enterpriseList.length; i++) {
    if (parseInt(enterpriseList[i].id) === parseInt(id)) {
      enterpriseList[i] = { ...enterpriseList[i], ...enterprise }
      updated = true
      return res.json({
        code: 20000,
        data: enterpriseList[i]
      })
    }
  }
  if (!updated) {
    return res.json({
      code: 70001,
      message: 'Enterprise not found'
    })
  }
}

export const deleteEnterprise = (req: Request, res: Response) => {
  const { id } = req.params
  enterpriseList = enterpriseList.filter((item) => parseInt(item.id) !== parseInt(id))
  console.log('enterpriseList-enterpriseList', enterpriseList.length, id)
  return res.json({
    code: 20000
  })
}
