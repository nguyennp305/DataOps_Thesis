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
