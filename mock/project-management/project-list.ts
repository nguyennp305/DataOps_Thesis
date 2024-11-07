import { Response, Request } from 'express'
import axios from 'axios'

const BASE_URL = 'http://localhost:8089/api/'

export const getProjectList = async(req: Request, res: Response) => {
  let {
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
    isDelete,
    ids
  } = req.query
  // Giải mã các tham số từ URL để khôi phục tiếng Việt có dấu
  const decodeParam = (param: any) => (param ? decodeURIComponent(param.toString()) : param)
  name = decodeParam(name)
  description = decodeParam(description)
  memberId = decodeParam(memberId)
  createTimeFrom = decodeParam(createTimeFrom)
  createTimeTo = decodeParam(createTimeTo)
  startTimeFrom = decodeParam(startTimeFrom)
  startTimeTo = decodeParam(startTimeTo)
  endTimeFrom = decodeParam(endTimeFrom)
  endTimeTo = decodeParam(endTimeTo)
  isDelete = decodeParam(isDelete)
  ids = decodeParam(ids)
  const url = BASE_URL + 'project'
  let params = `?page=${parseInt(page.toString()) - 1}&size=${size}`
  // Mã hóa lại các tham số trước khi gửi lên API
  const encodeParam = (param: any) => (param ? encodeURIComponent(param) : '')
  if (name) {
    params += `&name=${encodeParam(name)}`
  }
  if (description) {
    params += `&description=${encodeParam(description)}`
  }
  if (memberId) {
    params += `&memberId=${encodeParam(memberId)}`
  }
  if (createTimeFrom && createTimeTo) {
    params += `&createTimeFrom=${encodeParam(
      createTimeFrom
    )}&createTimeTo=${encodeParam(createTimeTo)}`
  }
  if (startTimeFrom && startTimeTo) {
    params += `&startTimeFrom=${encodeParam(
      startTimeFrom
    )}&startTimeTo=${encodeParam(startTimeTo)}`
  }
  if (endTimeFrom && endTimeTo) {
    params += `&endTimeFrom=${encodeParam(endTimeFrom)}&endTimeTo=${encodeParam(
      endTimeTo
    )}`
  }
  if (isDelete) {
    params += `&isDelete=${encodeParam(isDelete)}`
  }
  if (ids) {
    params += `&ids=${encodeParam(ids)}`
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
  await axios
    .post(url, data)
    .then((response) => {
      return res.json({
        code: 20000,
        data: response.data
      })
    })
    .catch((err) => {
      return res.json({
        code: 50006,
        message: err.response.data.message
      })
    })
}

export const updateProjectById = async(req: Request, res: Response) => {
  const data = req.body
  const url = BASE_URL + 'project'
  await axios
    .put(url, data)
    .then((response) => {
      return res.json({
        code: 20000,
        data: response.data
      })
    })
    .catch((err) => {
      return res.json({
        code: 50006,
        message: err.response.data.message
      })
    })
}
