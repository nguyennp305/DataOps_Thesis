import request from '@/utils/request'

export const getDatasetList = (params: any) =>
  request({
    url: '/datasets',
    method: 'get',
    params
  })

export const deleteDatasetById = (params: any) =>
  request({
    url: '/datasets/' + params.id,
    method: 'delete',
    params
  })

export const createDataset = (data: any) =>
  request({
    url: '/datasets',
    method: 'post',
    data
  })

export const updateDatasetById = (data: any) =>
  request({
    url: '/datasets/' + data.id,
    method: 'put',
    data
  })
