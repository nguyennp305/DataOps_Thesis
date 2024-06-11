import request from '@/utils/request'

export const getListDomain = (params: any) =>
  request({
    url: '/articles',
    method: 'get',
    params
  })
