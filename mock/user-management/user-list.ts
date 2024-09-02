import { Response, Request } from 'express'
import axios from 'axios'
import data from './../../src/views/pdf/content'

const BASE_URL = 'http://localhost:8089/api/'

export const getUserList = async(req: Request, res: Response) => {
  const {
    page = 1,
    size = 10,
    username,
    status,
    startTime,
    endTime,
    roleId,
    isDelete
  } = req.query
  const url = BASE_URL + 'user'
  let params = `?page=${parseInt(page.toString()) - 1}&size=${size}`
  if (username) {
    params += `&username=${username}`
  }
  if (status) {
    params += `&status=${status}`
  }
  if (startTime) {
    params += `&startTime=${startTime}`
  }
  if (endTime) {
    params += `&endTime=${endTime}`
  }
  if (roleId) {
    params += `&roleId=${roleId}`
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
