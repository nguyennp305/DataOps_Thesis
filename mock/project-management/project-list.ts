import { Response, Request } from 'express'
import axios from 'axios'

const BASE_URL = 'http://localhost:8089/api/'

export const getProjectList = async(req: Request, res: Response) => {
  const {
    page = 1,
    size = 10,
    name,
    description,
    memberId,
    createTimeFrom,
    createTimeTo,
    startTimeFrom,
    startTimeTo,
    endTimeFrom,
    endTimeTo,
    isDelete
  } = req.query
  const url = BASE_URL + 'project'
  let params = `?page=${parseInt(page.toString()) - 1}&size=${size}`
  if (name) {
    params += `&name=${name}`
  }
  if (description) {
    params += `&description=${description}`
  }
  if (memberId) {
    params += `&memberId=${memberId}`
  }
  if (createTimeFrom && createTimeTo) {
    params += `&createTimeFrom=${createTimeFrom}&createTimeTo=${createTimeTo}`
  }
  if (startTimeFrom && startTimeTo) {
    params += `&startTimeFrom=${startTimeFrom}&startTimeTo=${startTimeTo}`
  }
  if (endTimeFrom && endTimeTo) {
    params += `&endTimeFrom=${endTimeFrom}&endTimeTo=${endTimeTo}`
  }
  if (isDelete) {
    params += `&isDelete=${isDelete}`
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

export const deleteProjectById = async(req: Request, res: Response) => {
  const { id } = req.query
  const url = BASE_URL + 'project/' + id
  const response = await axios.delete(url)
  return res.json({
    code: 20000,
    data: response.data
  })
}

export const createProject = async(req: Request, res: Response) => {
  const data = req.body
  const url = BASE_URL + 'project'
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

export const updateProjectById = async(req: Request, res: Response) => {
  const data = req.body
  const url = BASE_URL + 'project'
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
