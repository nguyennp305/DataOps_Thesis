<template>
  <div class="main-content">
    <div class="container">
      <el-button
        size="mini"
        type="warning"
        :disabled="!isModelLoaded"
        @click="classifyImage"
      >
        Auto label with Tensorflow
      </el-button>
      <div class="content-auto-label-object-detection">
        <div class="image-container" v-if="resultHtml">
          <img :src="imgSrc" id="img" crossorigin width="300" height="227" />
          <canvas v-if="imgSrc" ref="canvas" width="300" height="227"></canvas>
        </div>
        <div class="content-auto-label-object-detection-result">
          <div class="progress-container" v-if="resultHtml">
          <span>Progress:</span>
          <el-progress :percentage="progressBarWidth" />
        </div>
        <div id="result" class="result-container" v-html="resultHtml"></div>
        </div>
      </div>
      <el-button
          v-if="resultHtml"
          size="mini"
          type="info"
          class="button-hide-auto-label-object-detection"
          @click="hideContentAutoLabel"
        >
          Hide
        </el-button>
    </div>
  </div>
</template>

<script>
import { nextTick } from 'vue'
/* global cocoSsd */
export default {
  props: {
    imageLink: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      net: null,
      imgSrc: '',
      resultHtml: '',
      progressBarWidth: 0,
      isModelLoaded: false // Biến theo dõi trạng thái model
    }
  },
  watch: {
    imageLink: {
      handler(newVal) {
        this.imgSrc = ''
        this.resultHtml = ''
        this.progressBarWidth = 0
        if (newVal) {
          this.imgSrc = newVal
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    async loadModel() {
      try {
        this.net = await cocoSsd.load()
        this.isModelLoaded = true // Cập nhật trạng thái khi model đã được tải thành công
      } catch (e) {
        console.error('Failed to load the model:', e)
        this.isModelLoaded = false // Đảm bảo trạng thái là false nếu có lỗi
      }
    },
    async classifyImage() {
      if (this.imgSrc) {
        await this.displayObjectDetection()
      } else {
        this.resultHtml = 'Please select an image first.'
      }
    },
    async displayObjectDetection() {
      try {
        this.resultHtml = 'Detecting objects...'
        this.progressBarWidth = 0

        await nextTick() // Đảm bảo canvas và img đã render đầy đủ

        const img = document.getElementById('img')
        if (!img) {
          this.resultHtml = 'Image not found.'
          console.error('Image element not found.')
          return
        }

        if (!img.complete) {
          // Đảm bảo hình ảnh đã load xong trước khi detect
          await new Promise((resolve) => {
            img.onload = resolve
          })
        }

        const canvas = this.$refs.canvas
        if (canvas) {
          const ctx = canvas.getContext('2d')
          ctx.clearRect(0, 0, canvas.width, canvas.height)

          // Run object detection
          this.progressBarWidth = 100
          const predictions = await this.net.detect(img)
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

          predictions.forEach((prediction) => {
            const [x, y, width, height] = prediction.bbox

            // Draw bounding box
            ctx.strokeStyle = '#00FF00'
            ctx.lineWidth = 2
            ctx.strokeRect(x, y, width, height)

            // Draw label
            ctx.fillStyle = '#00FF00'
            ctx.font = '16px Arial'
            ctx.fillText(
              `${prediction.class} - ${(prediction.score * 100).toFixed(2)}%`,
              x,
              y > 10 ? y - 5 : 10
            )
          })

          this.resultHtml = predictions.length
            ? predictions
              .map(
                (prediction) =>
                    `<p><span class="class-name-auto-object-detection">${
                      prediction.class
                    }</span> : <span style="color: red;">${(
                      prediction.score * 100
                    ).toFixed(2)}%</span></p>`
              )
              .join('')
            : 'No objects detected.'
        } else {
          console.error('Canvas not found.')
          this.resultHtml = 'Canvas not found.'
        }
      } catch (e) {
        console.error(e)
        this.resultHtml = 'An error occurred. Please try again.'
      }
    },
    hideContentAutoLabel() {
      // this.imgSrc = ''
      this.resultHtml = ''
      this.progressBarWidth = 0
      // const canvas = this.$refs.canvas
      // const ctx = canvas.getContext('2d')
      // ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  },
  mounted() {
    this.loadModel()
  }
}
</script>

<style lang="scss" scoped>
/* Thêm các kiểu CSS của bạn tại đây */
.main-content {
  display: flex;
  flex-direction: column;
  padding-left: 20px;
}
.content-auto-label-object-detection {
  margin-top: 1rem;
  display: flex;
  flex-wrap: nowrap;
  column-gap: 2rem;
}
.image-container {
  img {
    display: none;
  }
  // display: none;
}
// canvas {
//     position: absolute;
//     top: 0;
//     left: 0;
// }
.content-auto-label-object-detection-result {
  width: 100%;
}
</style>

<style lang="scss">
.class-names-auto-object-detection {
  display: flex;
  flex-wrap: wrap;
  column-gap: 5px;
}

.class-name-auto-object-detection {
  background-color: #f0f0f0; /* Màu nền cho từng box */
  border: 1px solid #ccc; /* Viền cho từng box */
  border-radius: 4px; /* Bo góc */
  padding: 0px 5px; /* Padding cho từng box */
}
</style>
