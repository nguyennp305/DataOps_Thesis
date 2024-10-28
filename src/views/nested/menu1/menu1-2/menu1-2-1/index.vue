<template>
  <div class="main-content">
    <div class="container">
      <h1>Object Detector</h1>
      <button @click="showInstructions">Instrucciones</button>
      <input type="file" id="imageInput" ref="imageInput" accept="image/*" style="display: none;" @change="onImageChange" />
      <button @click="uploadImage">Subir imagen</button>
      <button @click="detectObjects">Detectar objetos</button>
      <button @click="resetImage">Reiniciar</button>
      <div class="image-container">
        <img :src="imgSrc" id="img" crossorigin width="300" height="227" />
        <canvas v-if="imgSrc" ref="canvas" width="300" height="227"></canvas>
      </div>
      <div id="result" class="result-container" v-html="resultHtml"></div>
    </div>

    <div v-if="modalVisible" class="modal">
      <h2>Instrucciones de Uso</h2>
      <p>1. Haga clic en "Subir imagen" para cargar una imagen desde su dispositivo.</p>
      <p>2. Una vez cargada la imagen, haga clic en "Detectar objetos" para ver los objetos detectados.</p>
      <p>3. Puede ver las etiquetas de los objetos detectados en la imagen y en la parte inferior de la página.</p>
      <p>4. Si necesita volver a cargar la imagen, haga clic en "Reiniciar".</p>
      <p>5. En caso de error, reinicia la página o comprueba tu conectividad a internet :)</p>
      <p>6. ¡Disfrute de la detección de objetos!</p>
      <button @click="closeModal">Cerrar</button>
    </div>
  </div>
</template>

<script>
/* global cocoSsd */
export default {
  data() {
    return {
      net: null,
      imgSrc: '',
      resultHtml: '',
      modalVisible: false
    }
  },
  methods: {
    async loadModel() {
      try {
        this.net = await cocoSsd.load()
        console.log('COCO-SSD model loaded.')
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
    async detectObjects() {
      if (this.imgSrc) {
        await this.displayObjectDetection()
      } else {
        this.resultHtml = 'Please select an image first.'
      }
    },
    async displayObjectDetection() {
      try {
        this.resultHtml = 'Detecting objects...'
        const img = document.getElementById('img')
        const canvas = this.$refs.canvas
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Run object detection
        const predictions = await this.net.detect(img)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        predictions.forEach(prediction => {
          const [x, y, width, height] = prediction.bbox

          // Draw bounding box
          ctx.strokeStyle = '#00FF00'
          ctx.lineWidth = 2
          ctx.strokeRect(x, y, width, height)

          // Draw label
          ctx.fillStyle = '#00FF00'
          ctx.font = '16px Arial'
          ctx.fillText(`${prediction.class} - ${(prediction.score * 100).toFixed(2)}%`, x, y > 10 ? y - 5 : 10)
        })

        this.resultHtml = predictions.length
          ? predictions.map(prediction => `<p>${prediction.class}: ${(prediction.score * 100).toFixed(2)}%</p>`).join('')
          : 'No objects detected.'
      } catch (e) {
        console.error(e)
        this.resultHtml = 'An error occurred. Please try again.'
      }
    },
    resetImage() {
      this.imgSrc = ''
      this.resultHtml = ''
      const canvas = this.$refs.canvas
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
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
.main-content {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.container {
    text-align: center;
}

.image-container {
    position: relative;
    margin-top: 20px;
}

canvas {
    position: absolute;
    top: 0;
    left: 0;
}

.result-container {
    margin-top: 20px;
}
</style>
