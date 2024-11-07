import { Response, Request } from 'express'
import axios from 'axios'

const BASE_URL = 'http://localhost:8089/api/'

export const getDatasetList = async(req: Request, res: Response) => {
  let {
    page = 1,
    size = 10,
    name,
    description,
    projectId,
    ids,
    labelType
  } = req.query
  const url = BASE_URL + 'dataset'
  let params = `?page=${parseInt(page.toString()) - 1}&size=${size}`
  if (name) {
    name = decodeURIComponent(name.toString())
    params += `&name=${encodeURIComponent(name)}`
  }
  if (description) {
    description = decodeURIComponent(description.toString())
    params += `&description=${encodeURIComponent(description)}`
  }
  if (projectId) {
    params += `&projectId=${projectId}`
  }
  if (ids) {
    params += `&ids=${ids}`
  }
  if (labelType) {
    params += `&labelType=${labelType}`
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

export const deleteDatasetById = async(req: Request, res: Response) => {
  const { id } = req.query
  const url = BASE_URL + 'dataset/' + id
  const response = await axios.delete(url)
  return res.json({
    code: 20000,
    data: response.data
  })
}

export const createDataset = async(req: Request, res: Response) => {
  const data = req.body
  const url = BASE_URL + 'dataset'
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

export const updateDatasetById = async(req: Request, res: Response) => {
  const data = req.body
  const url = BASE_URL + 'dataset'
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
