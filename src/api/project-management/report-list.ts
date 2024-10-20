import request from '@/utils/request'

export const getReportList = (params: any) =>
  request({
    url: '/reports',
    method: 'get',
    params
  })

export const deleteReportById = (params: any) =>
  request({
    url: '/reports/' + params.id,
    method: 'delete',
    params
  })

export const createReport = (data: any) =>
  request({
    url: '/reports',
    method: 'post',
    data
  })

export const updateReportById = (data: any) =>
  request({
    url: '/reports/' + data.id,
    method: 'put',
    data
  })
