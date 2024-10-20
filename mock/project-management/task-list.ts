import { Response, Request } from 'express'
import axios from 'axios'

const BASE_URL = 'http://localhost:8089/api/'

export const getTaskList = async(req: Request, res: Response) => {
  const {
    page = 1,
    size = 10,
    name,
    projectId
  } = req.query
  const url = BASE_URL + 'task'
  let params = `?page=${parseInt(page.toString()) - 1}&size=${size}`
  if (name) {
    params += `&name=${name}`
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

export const deleteTaskById = async(req: Request, res: Response) => {
  const { id } = req.query
  const url = BASE_URL + 'task/' + id
  const response = await axios.delete(url)
  return res.json({
    code: 20000,
    data: response.data
  })
}

export const createTask = async(req: Request, res: Response) => {
  const data = req.body
  const url = BASE_URL + 'task'
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

export const updateTaskById = async(req: Request, res: Response) => {
  const data = req.body
  const url = BASE_URL + 'task'
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

export const assignTaskByProjectId = async(req: Request, res: Response) => {
  const data = req.body
  const url = BASE_URL + 'task/assign'
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
