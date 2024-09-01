import request from '@/utils/request'

export const getListEnterprise = async(params: any) => {
  const response = await request({
    url: '/enterprises',
    method: 'get',
    params
  })
  return response
}

export const deleteEnterprise = (id: number) => {
  request({
    url: `/enterprises/${id}`,
    method: 'delete'
  })
}

export const updateEnterprise = (id: number, data: any) => {
  request({
    url: `/enterprises/${id}`,
    method: 'put',
    data
  })
}
