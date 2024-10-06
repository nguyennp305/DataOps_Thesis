import { Response, Request } from 'express'
import axios from 'axios'

const BASE_URL = 'http://localhost:8089/api/'

export const getEnterprises = async(req: Request, res: Response) => {
  const { page = 1, size = 10, word, startDate, enbDate, ids } = req.query
  const url = BASE_URL + 'enterprise'
  let params = `?page=${parseInt(page.toString()) - 1}&size=${size}`
  if (word) {
    params += `&word=${word}`
  }
  if (startDate) {
    params += `&startDate=${startDate}`
  }
  if (enbDate) {
    params += `&enbDate=${enbDate}`
  }
  if (ids) {
    params += `&ids=${ids}`
  }
  const response = await axios.get(url + params)
  return res.json({
    code: 20000,
    data: {
      items: response.data.data,
      total: response.data.total,
      limit: parseInt(size.toString()),
      page: parseInt(page.toString())
    }
  })
}

export const deleteEnterprise = async(req: Request, res: Response) => {
  const { id } = req.query
  const url = BASE_URL + `enterprise?id=${id}`
  const response = await axios.delete(url)
  return res.json({
    code: 20000,
    data: response.data
  })
}

export const createEnterprise = async(req: Request, res: Response) => {
  const data = req.body
  const url = BASE_URL + 'enterprise'
  await axios.post(url, data)
    .then(response => {
      return res.json({
        code: 20000,
        data: response.data
      })
    })
    .catch(err => {
      return res.json({
        code: 50006,
        message: err.response.data.message
      })
    })
}

export const updateEnterpriseById = async(req: Request, res: Response) => {
  const data = req.body
  const url = BASE_URL + 'enterprise'
  await axios.put(url, data)
    .then(response => {
      return res.json({
        code: 20000,
        data: response.data
      })
    })
    .catch(err => {
      return res.json({
        code: 50006,
        message: err.response.data.message
      })
    })
}
