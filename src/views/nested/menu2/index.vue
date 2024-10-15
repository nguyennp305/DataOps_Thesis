<template>
  <div>
    <h2>Phát Hiện Đối Tượng với COCO-SSD</h2>
    <input type="file" @change="onFileChange" accept="image/*" />
    <div v-if="imageSrc">
      <img
        :src="imageSrc"
        id="input-image"
        @load="detectObjects"
        alt="Input"
        style="max-width: 100%;"
      />
      <canvas ref="canvas" style="position: absolute; top: 0; left: 0;"></canvas>
    </div>
    <div v-if="predictions.length">
      <h3>Kết quả phát hiện:</h3>
      <ul>
        <li v-for="(prediction, index) in predictions" :key="index">
          {{ prediction.class }} - {{ (prediction.score * 100).toFixed(2) }}%
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import * as cocoSsd from '@tensorflow-models/coco-ssd'

export default {
  name: 'ObjectDetection',
  data() {
    return {
      imageSrc: null,
      model: null,
      predictions: []
    }
  },
  methods: {
    onFileChange(e) {
      const file = e.target.files[0]
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (event) => {
          this.imageSrc = event.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    async loadModel() {
      if (!this.model) {
        this.model = await cocoSsd.load()
        console.log('Mô hình COCO-SSD đã được tải.')
      }
    },
    async detectObjects() {
      await this.loadModel()
      const img = this.$refs['input-image'] || document.getElementById('input-image')
      const canvas = this.$refs.canvas
      const ctx = canvas.getContext('2d')

      // Đảm bảo hình ảnh đã tải xong
      if (img.complete) {
        // Thiết lập kích thước canvas giống hình ảnh
        canvas.width = img.width
        canvas.height = img.height

        // Vẽ hình ảnh lên canvas
        ctx.drawImage(img, 0, 0, img.width, img.height)

        // Phát hiện đối tượng
        const predictions = await this.model.detect(img)
        this.predictions = predictions

        // Vẽ bounding boxes
        predictions.forEach((prediction) => {
          const [x, y, width, height] = prediction.bbox
          ctx.strokeStyle = '#00FFFF'
          ctx.lineWidth = 2
          ctx.strokeRect(x, y, width, height)

          // Vẽ nhãn
          ctx.fillStyle = '#00FFFF'
          ctx.font = '18px Arial'
          ctx.fillText(
            `${prediction.class} (${(prediction.score * 100).toFixed(2)}%)`,
            x,
            y > 10 ? y - 5 : y + 15
          )
        })
      }
    }
  }
}
</script>

<style scoped>
div {
  position: relative;
}
canvas {
  position: absolute;
}
</style>
