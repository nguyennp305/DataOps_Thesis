<template>
  <div>
    <!-- v-if="labeledImages.length > 0 && cropData && cropBoxData" -->
    <div class="content" v-if="labeledImages.length > 0">
      <section class="cropper-area">
        <div class="img-cropper">
          <vue-cropper
            ref="cropperShowTable"
            :aspect-ratio="NaN"
            :src="imgSrc"
            :cropBoxMovable="false"
            :cropBoxResizable="false"
            :toggleDragModeOnDblclick="false"
            :dragMode="'none'"
            :viewMode="1"
            :zoomable="false"
            :zoomOnTouch="false"
            :zoomOnWheel="false"
            :wheelZoomRatio="0"
            preview=".preview-after-cropper"
          />
          <!-- :aspect-ratio="NaN" // Không khóa tỷ lệ, cho phép crop tự do
          :view-mode="1" // Cho phép crop mà không vượt quá vùng ảnh -->
        </div>
      </section>
      <section class="preview-area">
        <div class="preview-after-cropper css-and-hover-image" />
        <p>Preview</p>
      </section>
    </div>
    <div class="table-area">
      <el-table
        v-loading="loading"
        :key="tableKey"
        :data="labeledImages"
        :border="true"
        fit
        highlight-current-row
        style="width: 100%"
        @row-click="handleClickRowWillChangeImageDemoTable"
      >
        <el-table-column
          :label="$t('route.project')"
          :align="'center'"
          width="200px"
        >
          <template slot-scope="{row}">
            <div class="cropped-image">
              <img
                v-if="row.cropImg"
                :src="row.cropImg"
                alt="Cropped Image"
                class="css-and-hover-image"
              />
              <div v-else class="crop-placeholder" />
            </div>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('route.labelGroupName')"
          :align="'center'"
          width="200px"
        >
          <template slot-scope="{row}">
            <el-select
              v-model="row.labelGroupId"
              :placeholder="$t('route.labelGroupName')"
              filterable
              clearable
              @change="handleChangeLabelGroupId(row.labelGroupId)"
            >
              <el-option
                v-for="item in labelGroupTypyOptions"
                :key="item.key"
                :label="item.displayName"
                :value="item.key"
              />
              <div class="component-add-items-to-list-select">
                <span>Total: {{ totalItemsLabelGroupsOptions }}</span>
              </div>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('route.labelNameData')"
          :align="'center'"
          width="200px"
        >
          <template slot-scope="{row}">
            <el-select
              v-model="row.labelId"
              :placeholder="$t('route.labelNameData')"
              filterable
              clearable
            >
              <el-option
                v-for="item in labelDataOptions"
                :key="item.key"
                :label="item.displayName"
                :value="item.key"
              />
              <div class="component-add-items-to-list-select">
                <el-button
                  size="mini"
                  type="primary"
                  :disabled="
                    totalItemsLabelDataOptions === labelDataOptions.length
                  "
                  @click="handleAddLabelsData"
                >
                  Add Items
                </el-button>
                <span>Total: {{ totalItemsLabelDataOptions }}</span>
              </div>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('table.description')"
          :align="'center'"
          width="200px"
        >
        <el-input
          :placeholder="$t('table.description')"
        />
      </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
import { getLabelGroupList } from '@/api/labeling-management/label-group'
import { getLabelDataList } from '@/api/labeling-management/label-data'

export default {
  components: {
    VueCropper
  },
  props: {
    loading: Boolean,
    tableKey: Number,
    imgUrl: {
      type: String
    },
    labeledImages: {
      type: Array,
      default: () => []
    },
    dataset: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      imgSrc: null,
      labelGroupTypyOptions: [],
      totalItemsLabelGroupsOptions: 0,
      labelDataOptions: [],
      labelDataListSelected: [],
      totalItemsLabelDataOptions: 0,
      listQueryLabelDataOptions: {
        page: 1,
        size: 10,
        ids: null
      }
      // cropData: null,
      // cropBoxData: null,
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
    dataset: {
      handler(newVal) {
        if (newVal) {
          const newQuery = {
            page: 1,
            size: 10,
            ids: newVal.labelGroupIds.join(',')
          }
          this.fetchLabelGroupList(newQuery)
        }
      },
      deep: true,
      immediate: true
    },
    labeledImages: {
      handler(newVal) {
        // đang test với chế độ item đầu tiên của mảng
        if (newVal && newVal.length > 0) {
          const newCropperImage = newVal.length - 1
          this.$nextTick(async() => {
            const cropper = this.$refs.cropperShowTable
            if (cropper) {
              setTimeout(() => {
                cropper.setData(newVal[newCropperImage].cropData)
                cropper.setCropBoxData(newVal[newCropperImage].cropBoxData)
                // // cropper.setContainerData(newVal[0].containerData);
                // // Zoom to 50% from the center of the container.
                // cropper.zoomTo(0.5, {
                //   x: newVal[0].containerData.width / 2,
                //   y: newVal[0].containerData.height / 2,
                // });
                // cropper.setImageData(newVal[0].imageData);
                // cropper.setCanvasData(newVal[0].canvasData);
              }, 3000)
            } else {
              console.error('Không thể tìm thấy cropper instance.')
            }
          })
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    async fetchLabelGroupList(queryLabelGroup) {
      const { data } = await getLabelGroupList(queryLabelGroup)
      const newArray = data.items.map((item) => ({
        key: item.id,
        displayName: item.name
      }))
      // Kiểm tra và chỉ thêm những item chưa tồn tại
      newArray.forEach((newItem) => {
        const isExist = this.labelGroupTypyOptions.some(
          (existingItem) => existingItem.key === newItem.key
        )
        if (!isExist) {
          this.labelGroupTypyOptions.push(newItem)
        }
      })
      this.totalItemsLabelGroupsOptions = data.total
    },
    async fetchDataGetLabelData(queryLabelData) {
      const { data } = await getLabelDataList(queryLabelData)
      const newArray = data.items.map((item) => ({
        key: item.id,
        displayName: item.name
      }))
      // Kiểm tra và chỉ thêm những item chưa tồn tại
      newArray.forEach((newItem) => {
        const isExist = this.labelDataOptions.some(
          (existingItem) => existingItem.key === newItem.key
        )
        if (!isExist) {
          this.labelDataOptions.push(newItem)
        }
      })
      this.totalItemsLabelDataOptions = data.total
    },
    async handleAddLabelsData() {
      this.listQueryLabelDataOptions.page += 1
      await this.fetchDataGetLabelData(this.listQueryLabelDataOptions)
    },
    async handleChangeLabelGroupId(id) {
      if (id) {
        const newQuery = {
          page: 1,
          size: 10,
          ids: id
        }
        const groupInfo = null
        this.$nextTick(async() => {
          const { data } = await getLabelGroupList(newQuery)
          newQuery.ids = data.items[0].labelIds.join(',')
          this.labelDataOptions = []
          await this.fetchDataGetLabelData(newQuery)
        }, 3000)
      } else {
        this.labelDataOptions = []
      }
    },
    // Hàm này dùng để đặt dữ liệu liên quan đến crop box (hộp khung crop), tức là vùng hình chữ nhật mà bạn dùng để xác định khu vực sẽ crop.
    // Hàm này thay đổi vị trí và kích thước của khung crop mà không thay đổi dữ liệu về ảnh.
    setCropBoxData(data) {
      if (!data) return
      this.$refs.cropperShowTable.setCropBoxData(data)
    },
    // Hàm này dùng để đặt dữ liệu về khu vực crop của ảnh, tức là các thông số về vị trí, kích thước, và tỉ lệ của phần ảnh bạn đang muốn crop.
    setData(data) {
      if (!data) return
      this.$refs.cropperShowTable.setData(data)
    },
    handleClickRowWillChangeImageDemoTable(row, event, column) {
      console.log('row', row)
      this.$nextTick(async() => {
        const cropper = this.$refs.cropperShowTable
        if (cropper) {
          setTimeout(() => {
            cropper.setData(row.cropData)
            cropper.setCropBoxData(row.cropBoxData)
            // // cropper.setContainerData(newVal[0].containerData);
            // // Zoom to 50% from the center of the container.
            // cropper.zoomTo(0.5, {
            //   x: newVal[0].containerData.width / 2,
            //   y: newVal[0].containerData.height / 2,
            // });
            // cropper.setImageData(newVal[0].imageData);
            // cropper.setCanvasData(newVal[0].canvasData);
          }, 3000)
        } else {
          console.error('Không thể tìm thấy cropper instance.')
        }
      })
    },
    // setContainerData(data) {
    //   if (!data) return;
    //   this.$refs.cropperShowTable.setContainerData(data);
    // },
    // setImageData(data) {
    //   if (!data) return;
    //   this.$refs.cropperShowTable.setImageData(data);
    // },
    // setCanvasData(data) {
    //   if (!data) return;
    //   this.$refs.cropperShowTable.setCanvasData(data);
    // },
    handleUpdateLabelInACropperImage(row) {
      this.$emit('update', row)
    },
    reset() {
      this.$refs.cropperShowTable.reset()
    }
  }
}
</script>

<style lang="scss" scoped>
img {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
  width: 150px;
  transition: transform 0.3s ease; // Thêm hiệu ứng chuyển động cho ảnh khi hover

  &:hover {
    transform: scale(1.1); // Phóng to ảnh lên 10% khi hover
  }
}
.content {
  display: flex;
  justify-content: space-around;
  gap: 40px;
}
.cropper-area {
  width: 614px;
}
.preview-area {
  width: 307px;
}
.table-area {
  margin-top: 1rem;
}
.preview-area p {
  font-size: 1.25rem;
  margin: 0;
  margin-bottom: 1rem;
}
.preview-area p:last-of-type {
  margin-top: 1rem;
}
.preview-after-cropper {
  width: 100%;
  height: calc(372px * (9 / 16));
  overflow: hidden;
}
.cropped-image img {
  max-width: 100%;
  height: 200px;
  object-fit: contain;
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
.crop-placeholder {
  width: 100%;
  height: 200px;
  background: #ccc;
}
</style>
