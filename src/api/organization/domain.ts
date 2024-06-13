import request from '@/utils/request'

export const getListDomain = (params: any) =>
  request({
    url: '/domains',
    method: 'get',
    params
  })

export const deleteDomain = (id: number) =>
  request({
    url: `/domains/${id}`,
    method: 'delete'
  })

export const updateDomain = (id: number, data: any) =>
  request({
    url: `/domains/${id}`,
    method: 'put',
    data
  })
