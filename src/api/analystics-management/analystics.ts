import request from '@/utils/request'

export const getAnalysticUserList = () =>
  request({
    url: '/analystics',
    method: 'get'
  })

export const getAnalysticProjectList = () => {
  const result = request({
    url: '/analystics-project',
    method: 'get'
  })
  return result
}

export const getMyTaskByUserId = (params: any) => {
  const result = request({
    url: '/analystics-my-tasks',
    method: 'get',
    params
  })
  return result
}
