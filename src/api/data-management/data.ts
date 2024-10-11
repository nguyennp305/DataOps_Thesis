import request from '@/utils/request'

export const getDataList = (params: any) =>
  request({
    url: '/datas',
    method: 'get',
    params
  })

export const deleteDataById = (params: any) =>
  request({
    url: '/datas/' + params.id,
    method: 'delete',
    params
  })

export const createData = (data: any) =>
  request({
    url: '/datas',
    method: 'post',
    data
  })

export const updateDataById = (data: any) =>
  request({
    url: '/datas/' + data.id,
    method: 'put',
    data
  })
