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
  const myTaskByUserId = responseGetMyTaskByUserId.data.data.filter(
    (task: any) => task.assigneeId === userId
  )
  return res.json({
    code: 20000,
    data: {
      tasks: myTaskByUserId
    }
  })
}

export const getAnalysticDatasetPanelGroup = async(
  req: Request,
  res: Response
) => {
  let labels = 0
  let images = 0
  let labeledImages = 0
  const { projectId } = req.query
  const urlGetDataset =
    BASE_URL + 'dataset?page=0&size=1000000&projectId=' + projectId
  const responseDataset = await axios.get(urlGetDataset)
  if (getUniqueLabelGroupIds(responseDataset.data.data)) {
    const urlGetLabelSetData =
      BASE_URL +
      'label-set?page=0&size=1000000&ids=' +
      getUniqueLabelGroupIds(responseDataset.data.data)
    const responseLabelSetData = await axios.get(urlGetLabelSetData)
    if (responseLabelSetData) {
      labels = countUniqueLabels(responseLabelSetData.data.data)
    }
  }
  if (getUniqueLabeledImageIds(responseDataset.data.data)) {
    const urlGetLabeledImageData =
      BASE_URL +
      'data?page=0&size=100000000&ids=' +
      getUniqueLabeledImageIds(responseDataset.data.data)
    const responseLabeledImageData = await axios.get(urlGetLabeledImageData)
    if (responseLabeledImageData) {
      images = responseLabeledImageData.data.data.length
      labeledImages = responseLabeledImageData.data.data.filter(
        (item: any) => item.status === 'labeled'
      ).length
    }
  }
  return res.json({
    code: 20000,
    data: {
      datasets: responseDataset.data.data.length,
      labels: labels,
      images: images,
      labeledImages: labeledImages
    }
  })
}

export const getAnalysticDatasetMixedChart = async(
  req: Request,
  res: Response
) => {
  const dataChart: any = []
  const { projectId } = req.query
  const urlGetDataset =
    BASE_URL + 'dataset?page=0&size=1000000&projectId=' + projectId
  const responseDataset = await axios.get(urlGetDataset)

  for (const item of responseDataset.data.data) {
    let labelsInDataset = 0
    if (item.labelGroupIds.length > 0) {
      const urlGetLabelSetData =
        BASE_URL +
        'label-set?page=0&size=1000000&ids=' +
        item.labelGroupIds.join(',')
      const responseLabelSetData = await axios.get(urlGetLabelSetData)
      if (responseLabelSetData) {
        labelsInDataset = countUniqueLabels(responseLabelSetData.data.data)
      }
    }
    dataChart.push({
      name: item.name,
      labelGroups: item.labelGroupIds.length,
      image: item.labeledImageIds.length,
      labels: labelsInDataset
    })
  }

  return res.json({
    code: 20000,
    data: {
      dataChart: dataChart
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

function getUniqueLabelGroupIds(data: any) {
  const labelGroupIds: string[] = []
  data.forEach((item: any) => {
    item.labelGroupIds.forEach((id: string) => {
      if (!labelGroupIds.includes(id)) {
        labelGroupIds.push(id)
      }
    })
  })
  return labelGroupIds.join(',')
}

function countUniqueLabels(data: any) {
  const uniqueLabels: string[] = []
  data.forEach((labelSet: any) => {
    labelSet.labelIds.forEach((labelId: string) => {
      if (!uniqueLabels.includes(labelId)) {
        uniqueLabels.push(labelId)
      }
    })
  })
  return uniqueLabels.length
}

function getUniqueLabeledImageIds(data: any) {
  const labeledImageIds: string[] = []
  data.forEach((item: any) => {
    item.labeledImageIds.forEach((id: string) => {
      if (!labeledImageIds.includes(id)) {
        labeledImageIds.push(id)
      }
    })
  })
  return labeledImageIds.join(',')
}
