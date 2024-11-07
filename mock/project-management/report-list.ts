import e, { Response, Request } from 'express'
import axios from 'axios'

const BASE_URL = 'http://localhost:8089/api/'

export const getReportList = async(req: Request, res: Response) => {
  let {
    page = 1,
    size = 10,
    description,
    name,
    projectId,
    reportType
  } = req.query
  const url = BASE_URL + 'report'
  let params = `?page=${parseInt(page.toString()) - 1}&size=${size}`
  if (description) {
    params += `&description=${description}`
  }
  if (name) {
    name = decodeURIComponent(name.toString())
    params += `&name=${encodeURIComponent(name)}`
  }
  if (projectId) {
    params += `&projectId=${projectId}`
  }
  if (reportType) {
    params += `&reportType=${reportType}`
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

export const deleteReportById = async(req: Request, res: Response) => {
  const { id } = req.query
  const url = BASE_URL + 'report/' + id
  const response = await axios.delete(url)
  return res.json({
    code: 20000,
    data: response.data
  })
}

export const createReport = async(req: Request, res: Response) => {
  const data = req.body
  const url = BASE_URL + 'report'
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

export const updateReportById = async(req: Request, res: Response) => {
  const data = req.body
  const url = BASE_URL + 'report'
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
