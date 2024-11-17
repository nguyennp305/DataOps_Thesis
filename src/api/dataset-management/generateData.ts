import request from '@/utils/request'

export const generateDataset = (data: any) =>
  request({
    url: '/generate-dataset',
    method: 'post',
    data
  })
