import request from '@/utils/request'

export const getTaskList = (params: any) =>
  request({
    url: '/tasks',
    method: 'get',
    params
  })

export const deleteTaskById = (params: any) =>
  request({
    url: '/tasks/' + params.id,
    method: 'delete',
    params
  })

export const createTask = (data: any) =>
  request({
    url: '/tasks',
    method: 'post',
    data
  })

export const updateTaskById = (data: any) =>
  request({
    url: '/tasks/' + data.id,
    method: 'put',
    data
  })
