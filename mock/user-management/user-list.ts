import { Response, Request } from 'express'
import axios from 'axios'

const BASE_URL = 'http://localhost:8089/api/'

export const getUserList = async(req: Request, res: Response) => {
  let {
    page = 1,
    size = 10,
    username,
    status,
    startTime,
    endTime,
    roleId,
    isDelete,
    ids
  } = req.query
  const url = BASE_URL + 'user'
  let params = `?page=${parseInt(page.toString()) - 1}&size=${size}`
  if (username) {
    username = decodeURIComponent(username.toString())
    params += `&username=${encodeURIComponent(username)}`
  }
  if (status) {
    params += `&status=${status}`
  }
  if (startTime) {
    startTime = decodeURIComponent(startTime.toString())
    params += `&startTime=${encodeURIComponent(startTime)}`
  }
  if (endTime) {
    endTime = decodeURIComponent(endTime.toString())
    params += `&endTime=${encodeURIComponent(endTime)}`
  }
  if (roleId) {
    params += `&roleId=${roleId}`
  }
  if (isDelete) {
    params += `&isDelete=${isDelete}`
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

export const deleteUserById = async(req: Request, res: Response) => {
  const { id } = req.query
  const url = BASE_URL + 'user/' + id
  const response = await axios.delete(url)
  return res.json({
    code: 20000,
    data: response.data
  })
}

export const createUser = async(req: Request, res: Response) => {
  const data = req.body
  const url = BASE_URL + 'user'
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

export const updateUserById = async(req: Request, res: Response) => {
  const data = req.body
  const url = BASE_URL + 'user'
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

export const getAllRoles = async(req: Request, res: Response) => {
  const url = BASE_URL + 'user/roles'
  const response = await axios.get(url)
  return res.json({
    code: 20000,
    data: {
      items: response.data.data,
      total: response.data.total
    }
  })
}
