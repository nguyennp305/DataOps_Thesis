import request from '@/utils/request'

export const getLabelDataList = (params: any) =>
  request({
    url: '/labels-data',
    method: 'get',
    params
  })

export const deleteLabelDataById = (params: any) =>
  request({
    url: '/labels-data/' + params.id,
    method: 'delete',
    params
  })

export const createLabelData = (data: any) =>
  request({
    url: '/labels-data',
    method: 'post',
    data
  })

export const updateLabelDataById = (data: any) =>
  request({
    url: '/labels-data/' + data.id,
    method: 'put',
    data
  })
