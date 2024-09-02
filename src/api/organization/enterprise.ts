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

export const updateEnterpriseById = (data: any) => {
  request({
    url: `/enterprises/${data.id}`,
    method: 'put',
    data
  })
}

export const createEnterprise = (data: any) => {
  console.log('createEnterpriselocal', data)
  request({
    url: '/enterprises',
    method: 'post',
    data
  })
}
