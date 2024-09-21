import request from '@/utils/request'

export const getLabelGroupList = (params: any) =>
  request({
    url: '/labels-set',
    method: 'get',
    params
  })

export const deleteLabelGroupById = (params: any) =>
  request({
    url: '/labels-set/' + params.id,
    method: 'delete',
    params
  })

export const createLabelGroup = (data: any) =>
  request({
    url: '/labels-set',
    method: 'post',
    data
  })

export const updateLabelGroupById = (data: any) =>
  request({
    url: '/labels-set/' + data.id,
    method: 'put',
    data
  })
