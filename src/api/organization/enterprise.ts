import request from '@/utils/request'

export const getListEnterprise = async(params: any) => {
  const response = await request({
    url: '/enterprises',
    method: 'get',
    params
  })
  return response
}

export const deleteEnterprise = (params: any) => {
  request({
    url: `/enterprises/${params.id}`,
    method: 'delete',
    params
  })
}

export const updateEnterpriseById = async(data: any) => {
  const response = await request({
    url: `/enterprises/${data.id}`,
    method: 'put',
    data
  })
  return response
}

export const createEnterprise = async(data: any) => {
  const reponse = await request({
    url: '/enterprises',
    method: 'post',
    data
  })
  return reponse
}
