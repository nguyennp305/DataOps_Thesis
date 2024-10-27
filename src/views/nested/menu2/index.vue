<template>
  <div class="main-content">
    <div class="container">
      <h1>Image Classifier</h1>
      <button @click="showInstructions">Instrucciones</button>
      <input type="file" id="imageInput" ref="imageInput" accept="image/*" style="display: none;" @change="onImageChange" />
      <button @click="uploadImage">Subir imagen</button>
      <button @click="classifyImage">Clasificar imagen</button>
      <button @click="resetImage">Reiniciar</button>
      <div class="image-container">
        <img :src="imgSrc" id="img" crossorigin width="300" height="227" />
      </div>
      <div class="progress-container">
        <div class="progress-bar" :style="{width: progressBarWidth}"></div>
      </div>
      <div id="result" class="result-container" v-html="resultHtml"></div>
    </div>

    <div v-if="modalVisible" class="modal">
      <h2>Instrucciones de Uso</h2>
      <p>1. Haga clic en "Subir imagen" para cargar una imagen desde su dispositivo.</p>
      <p>2. Una vez cargada la imagen, haga clic en "Clasificar imagen" para obtener predicciones.</p>
      <p>3. Puede ver las predicciones en la parte inferior de la página.</p>
      <p>4. Si necesita volver a cargar la imagen, haga clic en "Reiniciar".</p>
      <p>5. En caso de error, reinicia la página o comprueba tu conectividad a internet :)</p>
      <p>6. ¡Disfrute de la clasificación de imágenes!</p>
      <button @click="closeModal">Cerrar</button>
    </div>
  </div>
</template>

<script>
/* global mobilenet */
export default {
  data() {
    return {
      net: null,
      imgSrc: '',
      resultHtml: '',
      progressBarWidth: '0%',
      modalVisible: false
    }
  },
  methods: {
    async loadModel() {
      try {
        this.net = await mobilenet.load()
      } catch (e) {
        console.error('Failed to load the model:', e)
      }
    },
    async onImageChange(e) {
      const file = e.target.files[0]
      if (file) {
        this.imgSrc = URL.createObjectURL(file)
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
        this.progressBarWidth = '0%'

        const result = await this.net.classify(document.getElementById('img'), 3)
        this.progressBarWidth = '100%'

        const predictionsContainer = document.createElement('div')
        predictionsContainer.classList.add('predictions-container')

        result.forEach((item, index) => {
          const predictionCard = document.createElement('div')
          predictionCard.classList.add('prediction-card')

          predictionCard.innerHTML = `<strong>Prediction ${index + 1}:</strong> ${item.className}<br>
                                      <strong>Probability:</strong> ${(item.probability * 100).toFixed(2)}%`
          predictionsContainer.appendChild(predictionCard)
        })

        this.resultHtml = predictionsContainer.outerHTML
      } catch (e) {
        console.error(e)
        this.resultHtml = 'An error occurred. Please try again.'
      }
    },
    resetImage() {
      this.imgSrc = ''
      this.resultHtml = ''
      this.progressBarWidth = '0%'
    },
    showInstructions() {
      this.modalVisible = true
    },
    closeModal() {
      this.modalVisible = false
    },
    uploadImage() {
      this.$refs.imageInput.click()
    }
  },
  mounted() {
    this.loadModel()
  }
}
</script>

<style scoped>
/* Thêm các kiểu CSS của bạn tại đây */
</style>
