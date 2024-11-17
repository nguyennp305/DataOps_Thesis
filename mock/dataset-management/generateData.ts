import e, { Response, Request } from 'express'
import axios from 'axios'

const BASE_URL = 'http://localhost:8089/api/'

export const generateDataset = async(req: Request, res: Response) => {
  const data = req.body
  let arrayImageDataInDataset: any[] = []
  let arrayAllLabeledImageDataClassification: any[] = []
  let arrayAllLabeledImageDataObjectDetection: any[] = []
  let fileDataGenerate: any = null
  if (data.labeledImageIds && data.labeledImageIds.length > 0) {
    const urlGetLabeledImageData =
      BASE_URL +
      'data?page=0&size=100000000&ids=' +
      data.labeledImageIds.join(',')
    const responseAPILabeledImageData = await axios.get(urlGetLabeledImageData)
    arrayImageDataInDataset = responseAPILabeledImageData.data.data

    if (data.labelType === 'classification') {
      const urlGetAllLabeledImageData =
        BASE_URL +
        'label?page=0&size=100000000&ids=' +
        getUniqueLabeledIdClassifications(arrayImageDataInDataset).join(',')
      const responseAPIAllLabeledImageData = await axios.get(
        urlGetAllLabeledImageData
      )
      arrayAllLabeledImageDataClassification =
        responseAPIAllLabeledImageData.data.data
    } else if (data.labelType === 'objectDetection') {
      const urlGetAllLabeledImageData =
        BASE_URL +
        'label?page=0&size=100000000&ids=' +
        getUniqueLabelIdsFromCropObjectDetection(arrayImageDataInDataset).join(
          ','
        )
      const responseAPIAllLabeledImageData = await axios.get(
        urlGetAllLabeledImageData
      )
      arrayAllLabeledImageDataObjectDetection =
        responseAPIAllLabeledImageData.data.data
    }
  }
  // check theo label type của dataset:
  if (data.labelType === 'classification') {
    switch (data.modelTrainingLabelImage) {
      case 'ResNet':
      case 'Inception':
      case 'MobileNet':
      case 'EfficientNetV2':
      case 'ConvNeXt':
      case 'ViT':
        if (data.typeFileModelGenerate === 'json') {
          fileDataGenerate = generateJSONFormatClassification(
            arrayImageDataInDataset,
            arrayAllLabeledImageDataClassification
          )
        } else if (data.typeFileModelGenerate === 'csv') {
          fileDataGenerate = generateCSVFormatClassification(
            arrayImageDataInDataset,
            arrayAllLabeledImageDataClassification
          )
        } else if (data.typeFileModelGenerate === 'txt') {
          fileDataGenerate = generateTXTFormatClassification(
            arrayImageDataInDataset,
            arrayAllLabeledImageDataClassification
          )
        } else {
          console.error('Unsupported file format')
        }
        break

      default:
        console.error('Unsupported model')
        break
    }
  } else if (data.labelType === 'objectDetection') {
    switch (data.modelTrainingLabelImage) {
      case 'YOLOv5':
      case 'YOLOv8':
      case 'YOLO-NAS':
      case 'Faster R-CNN':
      case 'DETR':
      case 'RetinaNet':
      case 'SSD Lite':
        if (data.typeFileModelGenerate === 'json') {
          fileDataGenerate = generateJSONFormatObjectDetection(
            arrayImageDataInDataset,
            arrayAllLabeledImageDataObjectDetection
          )
        } else if (data.typeFileModelGenerate === 'csv') {
          fileDataGenerate = generateCSVFormatObjectDetection(
            arrayImageDataInDataset,
            arrayAllLabeledImageDataObjectDetection
          )
        } else if (data.typeFileModelGenerate === 'txt') {
          fileDataGenerate = generateTXTFormatObjectDetection(
            arrayImageDataInDataset,
            arrayAllLabeledImageDataObjectDetection
          )
        } else {
          console.error('Unsupported file format')
        }
        break

      default:
        console.error('Unsupported model')
        break
    }
  }
  return res.json({
    code: 20000,
    data: {
      contentDataGenerate: fileDataGenerate
    }
  })
}

// generate json format for classification
function generateJSONFormatClassification(imageData: any, labelData: any) {
  return imageData.map((image: any) => ({
    imageId: image.id,
    imageName: image.name,
    labels: image.labeledIdClassification
      .map((labelId: string) => {
        const label = labelData.find((l: any) => l.id === labelId)
        return label ? label.name : null
      })
      .filter(Boolean) // Loại bỏ các giá trị null
  }))
}

// generate csv format for classification
function generateCSVFormatClassification(imageData: any, labelData: any) {
  const headers = 'imageId,imageName,labels'
  const rows = imageData.map((image: any) => {
    const labels = image.labeledIdClassification
      .map((labelId: string) => {
        const label = labelData.find((l: any) => l.id === labelId)
        return label ? label.name : null
      })
      .filter(Boolean)
      .join('|') // Các nhãn được phân cách bằng "|"
    return `${image.id},${image.name},${labels}`
  })
  // Thêm BOM để Excel nhận diện UTF-8
  const bom = '\uFEFF'
  return bom + [headers, ...rows].join('\n')
}

// generate txt format for classification
function generateTXTFormatClassification(imageData: any, labelData: any) {
  return imageData
    .map((image: any) => {
      const labels = image.labeledIdClassification
        .map((labelId: string) => {
          const label = labelData.find((l: any) => l.id === labelId)
          return label ? label.name : null
        })
        .filter(Boolean)
        .join(' ') // Các nhãn được phân cách bằng khoảng trắng
      return `${image.name} ${labels}`
    })
    .join('\n')
}

// lấy tất cả id label trong danh sách image của dataset classification, không được trùng.
function getUniqueLabeledIdClassifications(data: any) {
  const uniqueIds = new Set()
  data.forEach((item: any) => {
    if (
      item.labeledIdClassification &&
      Array.isArray(item.labeledIdClassification)
    ) {
      item.labeledIdClassification.forEach((id: string) => uniqueIds.add(id))
    }
  })
  return Array.from(uniqueIds)
}

// lấy tất cả id label trong danh sách image của dataset object detection, không được trùng.
function getUniqueLabelIdsFromCropObjectDetection(
  arrayImageDataInDataset: any
) {
  const uniqueLabelIds = new Set()
  arrayImageDataInDataset.forEach((image: any) => {
    image.labeledImages.forEach((labeledImage: any) => {
      labeledImage.labelCropMulti.forEach((label: any) => {
        uniqueLabelIds.add(label.labelId) // Thêm labelId vào Set để đảm bảo không trùng lặp
      })
    })
  })

  return Array.from(uniqueLabelIds) // Chuyển Set thành mảng
}

function generateJSONFormatObjectDetection(imageData: any, labelData: any) {
  return imageData.map((image: any) => ({
    imageId: image.id,
    imageName: image.name,
    imageUrl: image.imageUrl,
    boundingBoxes: image.labeledImages.map((labeledImage: any) => ({
      cropData: labeledImage.cropData,
      cropBoxData: labeledImage.cropBoxData,
      labels: labeledImage.labelCropMulti.map((label: any) => {
        const foundLabel = labelData.find((l: any) => l.id === label.labelId)
        return {
          labelId: label.labelId,
          labelName: foundLabel ? foundLabel.name : null,
          exactRatio: label.exactRatio
        }
      })
    }))
  }))
}

function generateCSVFormatObjectDetection(imageData: any, labelData: any) {
  const headers = 'imageId,imageName,labelName,x,y,width,height,exactRatio'
  const rows = imageData.flatMap((image: any) =>
    image.labeledImages.flatMap((labeledImage: any) =>
      labeledImage.labelCropMulti.map((label: any) => {
        const foundLabel = labelData.find((l: any) => l.id === label.labelId)
        return [
          image.id,
          image.name,
          foundLabel ? foundLabel.name : null,
          labeledImage.cropData.x,
          labeledImage.cropData.y,
          labeledImage.cropData.width,
          labeledImage.cropData.height,
          label.exactRatio
        ].join(',')
      })
    )
  )

  // Thêm BOM để Excel nhận diện UTF-8
  const bom = '\uFEFF'
  return bom + [headers, ...rows].join('\n')
}

function generateTXTFormatObjectDetection(imageData: any, labelData: any) {
  const labelMap = new Map(
    labelData.map((label: any, index: number) => [label.id, label.id]) // Map labelId thành class ID
  )
  return imageData
    .flatMap((image: any) =>
      image.labeledImages.map((labeledImage: any) => {
        const txtRows = labeledImage.labelCropMulti.map((label: any) => {
          const classId = labelMap.get(label.labelId) ?? -1 // Lấy class ID từ labelMap
          const x = labeledImage.cropData.x
          const y = labeledImage.cropData.y
          const width = labeledImage.cropData.width
          const height = labeledImage.cropData.height
          return `${classId} ${x} ${y} ${width} ${height}`
        })

        return {
          imageName: image.name,
          txtRows: txtRows.join('\n')
        }
      })
    )
    .map(
      (item: any) => `# ${item.imageName}\n${item.txtRows}` // Đánh dấu ảnh bằng comment
    )
    .join('\n\n') // Ngăn cách mỗi ảnh bằng dòng trống
}
