import request from '@/utils/request'
import data from './../../views/pdf/content'

export const getProjectList = (params: any) =>
  request({
    url: '/projects',
    method: 'get',
    params
  })

export const deleteProjectById = (params: any) =>
  request({
    url: '/projects/' + params.id,
    method: 'delete',
    params
  })

export const createProject = (data: any) =>
  request({
    url: '/projects',
    method: 'post',
    data
  })

export const updateProjectById = (data: any) =>
  request({
    url: '/projects/' + data.id,
    method: 'put',
    data
  })
