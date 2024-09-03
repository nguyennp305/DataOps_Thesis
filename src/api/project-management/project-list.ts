import request from '@/utils/request'

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
