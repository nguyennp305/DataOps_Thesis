import request from '@/utils/request'

export const getListEnterprise = (params: any) =>
  request({
    url: '/enterprises',
    method: 'get',
    params
  })

export const deleteEnterprise = (id: number) =>
  request({
    url: `/enterprises/${id}`,
    method: 'delete'
  })

export const updateEnterprise = (id: number, data: any) =>
  request({
    url: `/enterprises/${id}`,
    method: 'put',
    data
  })
