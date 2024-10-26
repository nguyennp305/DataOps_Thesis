<template>
  <div>
    <div class="content" v-if="labeledImagesDataLocal.length > 0">
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
        :data="labeledImagesDataLocal"
        :border="true"
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          :label="$t('route.image')"
          :align="'center'"
          width="200px"
        >
          <template slot-scope="{row}">
            <div
              class="cropped-image"
              @click="handleClickRowWillChangeImageDemoTable(row)"
            >
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
          :label="$t('route.labelNameData')"
          :align="'center'"
          width="200px"
        >
          <template slot-scope="{row}">
            <el-select
              :value="getLabelIds(row)"
              @input="updateLabelIds(row, $event)"
              :placeholder="$t('route.labelNameData')"
              multiple
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
          :label="'Label ExactRatio'"
          :align="'center'"
          width="500px"
        >
          <template slot-scope="{row}">
            <div
              v-for="(item, index) in row.labelCropMulti"
              :key="index"
              class="exact-ratio-row"
            >
              <el-tag>{{ getLabelName(item.labelId) }}</el-tag>
              <label class="label" for="exactRatio">
                Exact ratio:
                <el-input
                  v-model.number="item.exactRatio"
                  type="number"
                  placeholder="Exact Ratio"
                  :min="0"
                  :max="100"
                  style="width: 80px; margin-left: 8px"
                  @input="handleExactRatioInput(item)"
                />
                %
              </label>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('table.actions')"
          :align="'center'"
          width="100px"
          clas-name="fixed-width"
        >
          <template slot-scope="{row, $index}">
            <el-button
              type="primary"
              size="mini"
              @click="handleDeleteItemCropperImage(row, $index)"
            >
              {{ $t("table.delete") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="update-table-button">
      <el-button
        type="warning"
        size="large"
        @click="handleUpdateLabelInACropperImage"
      >
        {{ $t("route.updateCropperImage") }}
      </el-button>
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
      labelDataOptions: [],
      labelDataListSelected: [],
      totalItemsLabelDataOptions: 0,
      listQueryLabelDataOptions: {
        page: 1,
        size: 10,
        ids: null
      },
      labeledImagesDataLocal: []
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
        console.log('dataset', newVal)
        const newQuery = {
          page: 1,
          size: 10,
          ids: newVal.labelGroupIds.join(',') // Tạo mảng mới
        }
        this.fetchDataGetLabelGroupData(newQuery)
      },
      deep: true,
      immediate: true
    },
    labeledImages: {
      handler(newVal) {
        console.log('labeledImagesxxxxxxx', newVal)
        // đang test với chế độ item đầu tiên của mảng
        if (newVal && newVal.length > 0) {
          this.labeledImagesDataLocal = newVal
          const newCropperImage = newVal.length - 1
          this.$nextTick(async() => {
            const cropper = this.$refs.cropperShowTable
            if (cropper) {
              setTimeout(() => {
                cropper.setData(newVal[newCropperImage].cropData)
                cropper.setCropBoxData(newVal[newCropperImage].cropBoxData)
              }, 3000)
            } else {
              console.error('Không thể tìm thấy cropper instance.')
            }
          })
        } else {
          this.labeledImagesDataLocal = []
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    async fetchDataGetLabelGroupData(queryLabelData) {
      const { data } = await getLabelGroupList(queryLabelData)
      const labelIdsSet = new Set()
      data.items.forEach((item) => {
        item.labelIds.forEach((id) => labelIdsSet.add(id))
      })
      this.listQueryLabelDataOptions.ids = Array.from(labelIdsSet).join(',')
      await this.fetchDataGetLabelData(this.listQueryLabelDataOptions)
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
    handleClickRowWillChangeImageDemoTable(row) {
      console.log('row', row)
      this.$nextTick(async() => {
        const cropper = this.$refs.cropperShowTable
        if (cropper) {
          setTimeout(() => {
            cropper.setData(row.cropData)
            cropper.setCropBoxData(row.cropBoxData)
          }, 3000)
        } else {
          console.error('Không thể tìm thấy cropper instance.')
        }
      })
    },
    handleUpdateLabelInACropperImage() {
      this.$emit('update', this.labeledImagesDataLocal)
    },
    reset() {
      this.$refs.cropperShowTable.reset()
    },
    handleDeleteItemCropperImage(data, index) {
      console.log(data)
      this.labeledImagesDataLocal.splice(index, 1)
    },
    // Hàm để lấy danh sách labelId từ labelCropMulti của row
    getLabelIds(row) {
      return row.labelCropMulti.map((item) => item.labelId)
    },
    // Hàm để cập nhật lại labelCropMulti khi danh sách labelId thay đổi
    updateLabelIds(row, newLabelIds) {
      row.labelCropMulti = newLabelIds.map((labelId) => ({
        labelId,
        exactRatio: 1 // Giữ nguyên hoặc thiết lập giá trị mặc định cho exactRatio
      }))
    },
    // Hàm lấy tên label dựa trên labelId
    getLabelName(labelId) {
      const label = this.labelDataOptions.find((item) => item.key === labelId)
      return label ? label.displayName : 'Unknown Label'
    },
    handleExactRatioInput(item) {
      if (item.exactRatio < 1) {
        item.exactRatio = 1
      } else if (item.exactRatio > 100) {
        item.exactRatio = 100
      }
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
.update-table-button {
  display: flex;
  flex-direction: row-reverse;
  margin-top: 10px;
}
.exact-ratio-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
