import request from '@/utils/request'

export const getListDomain = (params: any) =>
  request({
    url: '/domains',
    method: 'get',
    params
  })
