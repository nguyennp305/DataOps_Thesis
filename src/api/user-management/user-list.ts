import request from '@/utils/request'

export const getUserList = (params: any) =>
  request({
    url: '/user-management/user-list',
    method: 'get',
    params
  })

export const deleteUserById = (params: any) =>
  request({
    url: '/user-management/user-list/' + params.id,
    method: 'delete',
    params
  })

export const createUser = (data: any) =>
  request({
    url: '/user-management/user-list',
    method: 'post',
    data
  })

export const updateUserById = (data: any) =>
  request({
    url: '/user-management/user-list/' + data.id,
    method: 'put',
    data
  })

export const getAllRoles = (params: any) =>
  request({
    url: '/user-management/roles',
    method: 'get',
    params
  })
