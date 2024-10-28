<template>
  <div class="app">
    <h1>Object Detection & Instance Segmentation</h1>
    <input type="file" @change="onImageUpload" accept="image/*" />
    <canvas ref="canvas"></canvas>
    <div v-html="resultHtml" class="result"></div>
  </div>
</template>

<script>
/* global cocoSsd, bodyPix */
export default {
  data() {
    return {
      detectionModel: null,
      segmentationModel: null,
      resultHtml: ''
    }
  },
  methods: {
    // Tải mô hình object detection và instance segmentation
    async loadModels() {
      try {
        this.detectionModel = await cocoSsd.load()
        this.segmentationModel = await bodyPix.load()
        console.log('Models loaded successfully')
      } catch (error) {
        console.error('Error loading models:', error)
      }
    },
    onImageUpload(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const img = new Image()
          img.src = e.target.result
          img.onload = () => this.processImage(img)
        }
        reader.readAsDataURL(file)
      }
    },
    async processImage(img) {
      const canvas = this.$refs.canvas
      const ctx = canvas.getContext('2d')
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      // Phát hiện đối tượng
      const predictions = await this.detectionModel.detect(img)
      this.drawDetection(predictions, ctx)

      // Thực hiện segmentation cho đối tượng người
      const segmentation = await this.segmentationModel.segmentPerson(img)
      this.applySegmentationMask(segmentation, ctx)
    },
    drawDetection(predictions, ctx) {
      this.resultHtml = ''
      predictions.forEach(prediction => {
        const [x, y, width, height] = prediction.bbox

        // Vẽ bounding box
        ctx.beginPath()
        ctx.rect(x, y, width, height)
        ctx.lineWidth = 2
        ctx.strokeStyle = 'red'
        ctx.stroke()

        // Vẽ nhãn đối tượng và độ chính xác
        ctx.fillStyle = 'red'
        ctx.font = '16px Arial'
        ctx.fillText(
          `${prediction.class} (${(prediction.score * 100).toFixed(2)}%)`,
          x,
          y > 10 ? y - 5 : 10
        )

        // Hiển thị thông tin dự đoán
        this.resultHtml += `<div>${prediction.class}: ${(prediction.score * 100).toFixed(2)}%</div>`
      })
    },
    applySegmentationMask(segmentation, ctx) {
      const { data: mask, width, height } = segmentation
      const imageData = ctx.getImageData(0, 0, width, height)

      // Vẽ mặt nạ (mask) màu đỏ cho các pixel thuộc đối tượng người
      for (let i = 0; i < mask.length; i++) {
        if (mask[i] === 1) { // Nếu pixel thuộc về người
          imageData.data[i * 4] = 255 // Red channel
          imageData.data[i * 4 + 1] = 0 // Green channel
          imageData.data[i * 4 + 2] = 0 // Blue channel
          imageData.data[i * 4 + 3] = 100 // Độ trong suốt của mask
        }
      }
      ctx.putImageData(imageData, 0, 0)
    }
  },
  mounted() {
    this.loadModels()
  }
}
</script>

<style scoped>
.app {
  text-align: center;
  font-family: Arial, sans-serif;
}

canvas {
  border: 1px solid #ccc;
  max-width: 100%;
  height: auto;
}

.result {
  margin-top: 20px;
}
</style>
