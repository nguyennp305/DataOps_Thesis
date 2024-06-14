import faker from 'faker'
import { Response, Request } from 'express'

let domainList: any[] = []
const domainCount = 100

for (let i = 0; i < domainCount; i++) {
  domainList.push({
    id: i,
    author: faker.name.findName(),
    type: faker.random.arrayElement(['CN', 'US', 'JP', 'EU']),
    title: faker.lorem.sentence(6, 10),
    timestamp: faker.date.past().getTime(),
    status: faker.random.arrayElement(['published', 'draft', 'deleted']),
    reviewer: faker.name.findName()
  })
}

export const getDomains = (req: Request, res: Response) => {
  const { page = 1, limit = 10, title, status, type, author, reviewer, sort } = req.query
  let mockList = domainList.filter(item => {
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

export const updateDomain = (req: Request, res: Response) => {
  const { id } = req.params
  const domain = req.query
  let updated = false
  for (let i = 0; i < domainList.length; i++) {
    if (parseInt(domainList[i].id) === parseInt(id)) {
      domainList[i] = { ...domainList[i], ...domain }
      updated = true
      return res.json({
        code: 20000,
        data: domainList[i]
      })
    }
  }
  if (!updated) {
    return res.json({
      code: 70001,
      message: 'Domain not found'
    })
  }
}

export const deleteDomainByID = (req: Request, res: Response) => {
  const { id } = req.params
  domainList = domainList.filter((item) => parseInt(item.id) !== parseInt(id))
  console.log('domainList-domainList', domainList.length, id)
  return res.json({
    code: 20000
  })
}
