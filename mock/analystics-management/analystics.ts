import { Response, Request } from 'express'
import axios from 'axios'

const BASE_URL = 'http://localhost:8089/api/'

export const getAnalysticUserList = async(req: Request, res: Response) => {
  const urlGetUser = BASE_URL + 'user?page=0&size=1'
  const responseGetUser = await axios.get(urlGetUser)
  const urlGetDataset = BASE_URL + 'dataset?page=0&size=1'
  const responseGetDataset = await axios.get(urlGetDataset)
  const urlGetLabelData = BASE_URL + 'label?page=0&size=1'
  const responseGetLabelData = await axios.get(urlGetLabelData)
  const urlGetImage = BASE_URL + 'data?page=0&size=1'
  const responseGetImageData = await axios.get(urlGetImage)
  return res.json({
    code: 20000,
    data: {
      users: responseGetUser.data.total,
      datasets: responseGetDataset.data.total,
      labels: responseGetLabelData.data.total,
      images: responseGetImageData.data.total
    }
  })
}

export const getAnalysticProjectList = async(req: Request, res: Response) => {
  const urlGetProject = BASE_URL + 'project?page=0&size=10000000'
  const responseGetProject = await axios.get(urlGetProject)
  const topProjects = getTopProjectsByMemberCount(responseGetProject.data.data)
  return res.json({
    code: 20000,
    data: {
      projects: topProjects
    }
  })
}

export const getMyTaskByUserId = async(req: Request, res: Response) => {
  const { userId } = req.query
  const urlGetMyTaskByUserId = BASE_URL + 'task?page=0&size=10000000'
  const responseGetMyTaskByUserId = await axios.get(urlGetMyTaskByUserId)
  const myTaskByUserId = responseGetMyTaskByUserId.data.data.filter((task: any) => task.assigneeId === userId)
  return res.json({
    code: 20000,
    data: {
      tasks: myTaskByUserId
    }
  })
}

// Hàm để lấy top 5 project có nhiều member nhất
function getTopProjectsByMemberCount(projects: any) {
  return projects
    .map((project: any) => ({
      id: project.id,
      name: project.name,
      memberCount: project.members.length
    }))
    .sort((a: any, b: any) => b.memberCount - a.memberCount) // Sắp xếp theo số lượng thành viên giảm dần
    .slice(0, 5) // Lấy 5 dự án đầu tiên
}
