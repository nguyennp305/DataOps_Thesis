import faker from 'faker'
import { Response, Request } from 'express'
import { IUserData } from '../src/api/types'
import axios from 'axios'

const BASE_URL = 'http://localhost:8089/api/'

const userList: IUserData[] = [
  {
    id: 0,
    username: 'admin',
    password: '123456aA@',
    name: 'Super Admin',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    introduction: 'I am a super administrator',
    email: 'admin@test.com',
    phone: '1234567890',
    roles: ['admin']
  },
  {
    id: 2,
    username: 'admin_project',
    password: 'any',
    name: 'Normal Admin Project',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    introduction: 'I am an admin project',
    email: 'editor@test.com',
    phone: '1234567890',
    roles: ['admin_project']
  }
]
const userCount = 100

// random user
for (let i = 2; i < userCount; i++) {
  userList.push({
    id: i,
    username: 'user_' + faker.random.alphaNumeric(9),
    password: faker.random.alphaNumeric(20),
    name: faker.name.findName(),
    avatar: faker.image.imageUrl(),
    introduction: faker.lorem.sentence(20),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    roles: ['visitor']
  })
}

export const register = (req: Request, res: Response) => {
  return res.json({
    code: 20000
  })
}

export const login = async(req: Request, res: Response) => {
  const url = BASE_URL + 'login'
  const data = req.body
  let newToken = ''
  await axios.post(url, data)
    .then(response => {
    // moi set token trong truong hop admin
      if (response.data.data.user.roleName.toLowerCase() === 'admin') {
        newToken = response.data.data.user.roleName.toLowerCase() + '-token'
      } else {
        newToken = 'test' + '-token'
      }
      return res.json({
        code: 20000,
        data: { accessToken: newToken, idUserLogin: response.data.data.user.id }
      })
    })
    .catch(err => {
      console.log('err', err)
      return res.json({
        code: 50006,
        messaege: 'Invalid User'
      })
    })
  // for (const user of userList) {
  //   if (user.username === username) {
  //     return res.json({
  //       code: 20000,
  //       data: {
  //         accessToken: username + '-token'
  //       }
  //     })
  //   }
  // }
  // return res.status(400).json({
  //   code: 50004,
  //   messaege: 'Invalid User'
  // })
}

export const logout = (req: Request, res: Response) => {
  return res.json({
    code: 20000
  })
}

export const getUsers = (req: Request, res: Response) => {
  const { name } = req.query
  const users = userList.filter(user => {
    const lowerCaseName = user.name.toLowerCase()
    return !(name && lowerCaseName.indexOf((name as string).toLowerCase()) < 0)
  })
  return res.json({
    code: 20000,
    data: {
      items: users
    }
  })
}

export const getUserInfo = async(req: Request, res: Response) => {
  const token = req.header('X-Access-Token')
  const idUserLogin = req.body.idUserLogin
  if (!token) {
    return res.status(400).json({
      code: 40000,
      message: 'Token is missing'
    })
  }
  let user = userList.find(user => (user.username + '-token') === token)
  if (!user) {
    return res.status(401).json({
      code: 40100,
      message: 'Unauthorized'
    })
  }
  await axios.get(`${BASE_URL}user/${idUserLogin}`)
    .then(response => {
      user = { ...user, ...response.data.data }
    })
    .catch(err => {
      console.log('err', err)
    })
  return res.json({
    code: 20000,
    data: { user }
  })
}

export const getUserByName = (req: Request, res: Response) => {
  const { username } = req.params
  for (const user of userList) {
    if (user.username === username) {
      return res.json({
        code: 20000,
        data: {
          user
        }
      })
    }
  }
  return res.status(400).json({
    code: 50004,
    messaege: 'Invalid User'
  })
}

export const updateUser = (req: Request, res: Response) => {
  const { username } = req.params
  const { user } = req.body
  for (const v of userList) {
    if (v.username === username) {
      return res.json({
        code: 20000,
        data: {
          user
        }
      })
    }
  }
  return res.status(400).json({
    code: 50004,
    messaege: 'Invalid User'
  })
}

export const deleteUser = (req: Request, res: Response) => {
  return res.json({
    code: 20000
  })
}
