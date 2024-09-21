import { Response, Request } from 'express'
import axios from 'axios'

const BASE_URL = 'http://localhost:8089/api/'

export const getLabelGroupList = async(req: Request, res: Response) => {
  const {
    page = 1,
    size = 10,
    name,
    description,
    createdBy,
    projectId
  } = req.query
  const url = BASE_URL + 'label-set'
  let params = `?page=${parseInt(page.toString()) - 1}&size=${size}`
  if (name) {
    params += `&name=${name}`
  }
  if (description) {
    params += `&description=${description}`
  }
  if (createdBy) {
    params += `&createdBy=${createdBy}`
  }
  if (projectId) {
    params += `&projectId=${projectId}`
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

export const deleteLabelGroupById = async(req: Request, res: Response) => {
  const { id } = req.query
  const url = BASE_URL + 'label-set/' + id
  const response = await axios.delete(url)
  return res.json({
    code: 20000,
    data: response.data
  })
}

export const createLabelGroup = async(req: Request, res: Response) => {
  const data = req.body
  console.log('createLabelGroup', data)
  const url = BASE_URL + 'label-set'
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

export const updateLabelGroupById = async(req: Request, res: Response) => {
  const data = req.body
  const url = BASE_URL + 'label-set'
  console.log('updateLabelGroupById', data)
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
