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
      <div class="image-container" v-if="imgSrc">
        <img :src="imgSrc" id="img" crossorigin width="300" height="227" />
      </div>
      <div class="progress-container" v-if="resultHtml">
        <span>Progress:</span>
        <el-progress :percentage="progressBarWidth" />
      </div>
      <div id="result" class="result-container" v-html="resultHtml"></div>
      <el-button
        v-if="resultHtml"
        size="mini"
        type="info"
        class="button-hide-auto-label-classification"
        @click="hideContentAutoLabel"
      >
        Hide
      </el-button>
    </div>
  </div>
</template>

<script>
/* global mobilenet */
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
        this.net = await mobilenet.load()
        this.isModelLoaded = true // Cập nhật trạng thái khi model đã được tải thành công
      } catch (e) {
        console.error('Failed to load the model:', e)
        this.isModelLoaded = false // Đảm bảo trạng thái là false nếu có lỗi
      }
    },
    async classifyImage() {
      if (this.imgSrc) {
        await this.displayImagePrediction()
      } else {
        this.resultHtml = 'Please select an image first.'
      }
    },
    async displayImagePrediction() {
      try {
        this.resultHtml = 'Classifying...'
        this.progressBarWidth = 0

        const result = await this.net.classify(
          document.getElementById('img'),
          3
        )
        this.progressBarWidth = 100

        const predictionsContainer = document.createElement('div')
        predictionsContainer.classList.add('predictions-container')

        result.forEach((item, index) => {
          const predictionCard = document.createElement('div')
          predictionCard.classList.add('prediction-card')

          // Tách chuỗi className thành một mảng
          const classNames = item.className
            .split(',')
            .map((name) => name.trim())

          // Tạo một chuỗi HTML cho từng className
          const classNamesHtml = classNames
            .map(
              (name) =>
                `<div class="class-name-auto-classification">${name}</div>`
            )
            .join('')

          predictionCard.innerHTML = `<strong>Prediction ${
            index + 1
          }:</strong><br>
                              <div class="class-names-auto-classification">Labels: ${classNamesHtml}</div>
                              <span>Probability:</span> <span style="color: red;">${(
                                item.probability * 100
                              ).toFixed(2)}%</span>`
          predictionsContainer.appendChild(predictionCard)
        })

        this.resultHtml = predictionsContainer.outerHTML
      } catch (e) {
        console.error(e)
        this.resultHtml = 'An error occurred. Please try again.'
      }
    },
    hideContentAutoLabel() {
      this.resultHtml = ''
      this.progressBarWidth = 0
    }
  },
  mounted() {
    this.loadModel()
  }
}
</script>

<style lang="scss" scoped>
/* Thêm các kiểu CSS của bạn tại đây */
.image-container {
  display: none;
}
.result-container {
  margin-left: 3rem;
}
.button-hide-auto-label-classification {
  margin-left: 3rem;
}
</style>

<style lang="scss">
.class-names-auto-classification {
  display: flex;
  flex-wrap: wrap;
  column-gap: 5px;
}

.class-name-auto-classification {
  background-color: #f0f0f0; /* Màu nền cho từng box */
  border: 1px solid #ccc; /* Viền cho từng box */
  border-radius: 4px; /* Bo góc */
  padding: 0px 5px; /* Padding cho từng box */
}
</style>
