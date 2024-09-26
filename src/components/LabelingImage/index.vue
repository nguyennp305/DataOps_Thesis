<template>
  <div class="app-container">
    <!-- <input
      ref="input"
      type="file"
      name="image"
      accept="image/*"
      @change="setImage"
    /> -->

    <div class="content">
      <section class="cropper-area">
        <div class="img-cropper">
          <vue-cropper
            ref="cropper"
            :aspect-ratio="NaN"
            :src="imgSrc"
            preview=".preview"
          />
          <!-- :aspect-ratio="NaN" // Không khóa tỷ lệ, cho phép crop tự do
          :view-mode="1" // Cho phép crop mà không vượt quá vùng ảnh -->
        </div>
        <div class="actions">
          <a href="#" role="button" @click.prevent="zoom(0.2)"> Zoom In </a>
          <a href="#" role="button" @click.prevent="zoom(-0.2)"> Zoom Out </a>
          <a href="#" role="button" @click.prevent="move(-10, 0)">
            Move Left
          </a>
          <a href="#" role="button" @click.prevent="move(10, 0)">
            Move Right
          </a>
          <a href="#" role="button" @click.prevent="move(0, -10)"> Move Up </a>
          <a href="#" role="button" @click.prevent="move(0, 10)"> Move Down </a>
          <a href="#" role="button" @click.prevent="rotate(90)">
            Rotate +90deg
          </a>
          <a href="#" role="button" @click.prevent="rotate(-90)">
            Rotate -90deg
          </a>
          <a ref="flipX" href="#" role="button" @click.prevent="flipX">
            Flip X
          </a>
          <a ref="flipY" href="#" role="button" @click.prevent="flipY">
            Flip Y
          </a>
          <a href="#" role="button" @click.prevent="cropImage"> Crop </a>
          <a href="#" role="button" @click.prevent="reset"> Reset </a>
          <a href="#" role="button" @click.prevent="getData"> Get Data </a>
          <a href="#" role="button" @click.prevent="setData"> Set Data </a>
          <a href="#" role="button" @click.prevent="getCropBoxData">
            Get CropBox Data
          </a>
          <a href="#" role="button" @click.prevent="setCropBoxData">
            Set CropBox Data
          </a>
          <!-- <a href="#" role="button" @click.prevent="showFileChooser">
            Upload Image
          </a> -->
        </div>

        <textarea v-model="showData" />
      </section>
      <section class="preview-area">
        <div class="preview css-and-hover-image" />
        <p>Preview</p>

        <div class="cropped-image">
          <img v-if="cropImg" :src="cropImg" alt="Cropped Image" class="css-and-hover-image" />
          <div v-else class="crop-placeholder" />
        </div>
        <p>Cropped Image</p>
      </section>
    </div>
  </div>
</template>

<script>
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'

export default {
  components: {
    VueCropper
  },
  props: {
    imgUrl: {
      type: String
    },
    labeledImages: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      imgSrc: null,
      cropImg: '',
      cropData: null,
      cropBoxData: null,
      showData: null,
      localLabeledImages: []
    }
  },
  watch: {
    imgUrl: {
      handler(newVal) {
        this.imgSrc = newVal
      },
      immediate: true,
      deep: true
    },
    labeledImages: {
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.localLabeledImages = newVal
          console.log('this.localLabeledImages', this.localLabeledImages)
        } else {
          this.localLabeledImages = []
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    cropImage() {
      // get image data for post processing, e.g. upload or setting image src
      this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL()
    },
    flipX() {
      const dom = this.$refs.flipX
      let scale = dom.getAttribute('data-scale')
      scale = scale ? -scale : -1
      this.$refs.cropper.scaleX(scale)
      dom.setAttribute('data-scale', scale)
    },
    flipY() {
      const dom = this.$refs.flipY
      let scale = dom.getAttribute('data-scale')
      scale = scale ? -scale : -1
      this.$refs.cropper.scaleY(scale)
      dom.setAttribute('data-scale', scale)
    },
    getCropBoxData() {
      this.cropBoxData = JSON.stringify(this.$refs.cropper.getCropBoxData(), null, 4)
      this.showData = this.cropBoxData
    },
    getData() {
      this.cropData = JSON.stringify(this.$refs.cropper.getData(), null, 4)
      this.showData = this.cropData
    },
    move(offsetX, offsetY) {
      this.$refs.cropper.move(offsetX, offsetY)
    },
    reset() {
      this.$refs.cropper.reset()
    },
    rotate(deg) {
      this.$refs.cropper.rotate(deg)
    },
    // Hàm này dùng để đặt dữ liệu liên quan đến crop box (hộp khung crop), tức là vùng hình chữ nhật mà bạn dùng để xác định khu vực sẽ crop.
    // Hàm này thay đổi vị trí và kích thước của khung crop mà không thay đổi dữ liệu về ảnh.
    setCropBoxData() {
      if (!this.cropBoxData) return
      this.$refs.cropper.setCropBoxData(JSON.parse(this.cropBoxData))
    },
    // Hàm này dùng để đặt dữ liệu về khu vực crop của ảnh, tức là các thông số về vị trí, kích thước, và tỉ lệ của phần ảnh bạn đang muốn crop.
    setData() {
      if (!this.cropData) return

      this.$refs.cropper.setData(JSON.parse(this.cropData))
    },
    // setImage(e) {
    //   const file = e.target.files[0];
    //   if (file.type.indexOf("image/") === -1) {
    //     alert("Please select an image file");
    //     return;
    //   }
    //   if (typeof FileReader === "function") {
    //     const reader = new FileReader();
    //     reader.onload = (event) => {
    //       this.imgSrc = event.target.result;
    //       // rebuild cropperjs with the updated source
    //       this.$refs.cropper.replace(event.target.result);
    //     };
    //     reader.readAsDataURL(file);
    //   } else {
    //     alert("Sorry, FileReader API not supported");
    //   }
    // },
    // showFileChooser() {
    //   this.$refs.input.click()
    // },
    zoom(percent) {
      this.$refs.cropper.relativeZoom(percent)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content {
  display: flex;
  justify-content: space-around;
  gap: 40px;
}

.cropper-area {
  width: 614px;
}

.actions {
  margin-top: 1rem;
}

.actions a {
  display: inline-block;
  padding: 5px 15px;
  background: #0062cc;
  color: white;
  text-decoration: none;
  border-radius: 3px;
  margin-right: 1rem;
  margin-bottom: 1rem;
}

textarea {
  width: 100%;
  height: 100px;
}

.preview-area {
  width: 307px;
}

.preview-area p {
  font-size: 1.25rem;
  margin: 0;
  margin-bottom: 1rem;
}

.preview-area p:last-of-type {
  margin-top: 1rem;
}

.preview {
  width: 100%;
  height: calc(372px * (9 / 16));
  overflow: hidden;
}

.crop-placeholder {
  width: 100%;
  height: 200px;
  background: #ccc;
}

.cropped-image img {
  max-width: 100%;
}

.css-and-hover-image {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.1);
  }
}
</style>
