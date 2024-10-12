import { Response, Request } from 'express'
import axios from 'axios'

const BASE_URL = 'http://localhost:8089/api/'

export const getDataList = async(req: Request, res: Response) => {
  const {
    page = 1,
    size = 10,
    createdBy,
    description,
    ids,
    name,
    projectId,
    status
  } = req.query
  const url = BASE_URL + 'data'
  let params = `?page=${parseInt(page.toString()) - 1}&size=${size}`
  if (createdBy) {
    params += `&createdBy=${createdBy}`
  }
  if (description) {
    params += `&description=${description}`
  }
  if (ids) {
    params += `&ids=${ids}`
  }
  if (name) {
    params += `&name=${name}`
  }
  if (ids) {
    params += `&ids=${ids}`
  }
  if (projectId) {
    params += `&projectId=${projectId}`
  }
  if (status) {
    params += `&status=${status}`
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

export const deleteDataById = async(req: Request, res: Response) => {
  const { id } = req.query
  const url = BASE_URL + 'data/' + id
  const response = await axios.delete(url)
  return res.json({
    code: 20000,
    data: response.data
  })
}
