<template>
  <div>
    <div style="padding:30px;">
      <el-alert :closable="false" title="menu 2" />
    </div>
    <div id="app">
      <cropper ref="cropper" class="cropper" :src="data.image.src" />
      <div class="button-wrapper">
        <button class="button" @click="$refs.file.click()">
          <input type="file" ref="file" @change="uploadImage($event)" accept="image/*" />
          Upload image
        </button>
        <button class="button" @click="cropImage">Crop image</button>
      </div>
      <div class="cropped-images">
        <div v-for="(croppedImage, index) in data.croppedImages" :key="index" class="cropped-image">
          <img :src="croppedImage" alt="Cropped Image" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
export default {
  name: 'Menu2',
  components: {
    Cropper
  },
  data() {
    return {
      data: {
        image: {
          src: null,
          type: 'image/jpg'
        },
        croppedImages: []
      }
    }
  },
  methods: {
    cropImage() {
      const result = this.$refs.cropper.getResult()
      console.log('this.$refs.cropper.', this.$refs.cropper) // Xem result
      console.log('result', result) // Xem result
      console.log('result.canvas', result.canvas) // Xem canvas
      const croppedImage = result.canvas.toDataURL(this.data.image.type)
      this.data.croppedImages.push(croppedImage)
      console.log(this.data.croppedImages) // Xem mảng
    },
    uploadImage(event) {
      const { files } = event.target
      if (files && files[0]) {
        if (this.data.image.src) {
          URL.revokeObjectURL(this.data.image.src)
        }
        const blob = URL.createObjectURL(files[0])
        this.data.image = {
          src: blob,
          type: files[0].type
        }
        this.data.croppedImages = []
      }
    }
  },
  destroyed() {
    if (this.image.src) {
      URL.revokeObjectURL(this.image.src)
    }
  }
}
</script>

<style lang="scss" scoped>
.cropper {
  min-height: 300px;
  width: 100%;
}
.button-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 17px;
}
.button {
  color: white;
  font-size: 16px;
  padding: 10px 20px;
  width: 100%;
  background: #151515;
  cursor: pointer;
  transition: background 0.5s;
  border: none;
  &:not(:last-of-type) {
    margin-right: 10px;
  }
  &:hover {
    background: #2F2F2F;
  }
  input {
    display: none;
  }
}
.cropped-images {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
}
.cropped-image {
  margin: 10px;
}
.cropped-image img {
  max-width: 100px;
  max-height: 100px;
  border: 1px solid #ddd;
  padding: 5px;
  background: #fff;
}
</style>
