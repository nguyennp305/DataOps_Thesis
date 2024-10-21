<template>
  <div
    :class="{fullscreen: fullscreen}"
    class="tinymce-container"
    :style="{width: containerWidth}"
  >
    <tinymce-editor :id="id" v-model="tinymceContent" :init="initOptions" />
    <div class="editor-custom-btn-container">
      <input type="file" @change="importWordFile" accept=".docx" />
    </div>
  </div>
</template>

<script>
import 'tinymce/tinymce'
import 'tinymce/icons/default'
import 'tinymce/themes/silver'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/code'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import TinymceEditor from '@tinymce/tinymce-vue'
import { plugins, toolbar } from './config'
import mammoth from 'mammoth'

const defaultId = () =>
  'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')

export default {
  name: 'ReportProjectTinymce',
  components: {
    TinymceEditor
  },
  props: {
    value: {
      type: String,
      default: 'edit in here!'
    },
    id: {
      type: String,
      default: defaultId
    },
    toolbar: {
      type: Array,
      default: () => []
    },
    menubar: {
      type: String,
      default: 'file edit insert view format table'
    },
    height: {
      type: [String, Number],
      default: '360px'
    },
    width: {
      type: [String, Number],
      default: 'auto'
    }
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      fullscreen: false,
      languageTypeList: {
        en: 'en',
        zh: 'zh_CN',
        es: 'es',
        ja: 'ja',
        ko: 'ko_KR',
        it: 'it'
      }
    }
  },
  computed: {
    tinymceContent: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    containerWidth() {
      const width = this.width
      if (/^[\d]+(\.[\d]+)?$/.test(width.toString())) {
        return `${width}px`
      }
      return width
    },
    initOptions() {
      return {
        selector: `#${this.id}`,
        height: this.height,
        body_class: 'panel-body',
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,
        plugins: plugins,
        language: this.language,
        skin_url: `${process.env.BASE_URL}tinymce/skins/`,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        default_link_target: '_blank',
        link_title: false,
        nonbreaking_force_tab: true,
        convert_urls: false,
        init_instance_callback: (editor) => {
          if (this.value) {
            editor.setContent(this.value)
          }
          this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true
            this.$emit('input', editor.getContent())
          })
        },
        setup: (editor) => {
          editor.on('FullscreenStateChanged', (e) => {
            this.fullscreen = e.state
          })
        }
      }
    },
    language() {
      return this.languageTypeList.en // Replace 'en' with actual logic if needed
    }
  },
  watch: {
    language() {
      const tinymceManager = window.tinymce
      const tinymceInstance = tinymceManager.get(this.id)
      if (this.fullscreen) {
        tinymceInstance.execCommand('mceFullScreen')
      }
      if (tinymceInstance) {
        tinymceInstance.destroy()
      }
      this.$nextTick(() => tinymceManager.init(this.initOptions))
    }
  },
  methods: {
    async importWordFile(event) {
      const file = event.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = async(e) => {
        const arrayBuffer = e.target.result
        try {
          const result = await mammoth.convertToHtml({ arrayBuffer })
          this.tinymceContent = result.value // Đặt nội dung vào editor
        } catch (error) {
          console.error('Lỗi khi chuyển đổi file Word:', error)
        }
      }
      reader.readAsArrayBuffer(file)
    }
  }
}
</script>

<style lang="scss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;

  .mce-fullscreen {
    z-index: 10000;
  }
}

.editor-custom-btn-container {
  position: absolute;
  right: 6px;
  top: 6px;
  z-index: 1002;
}

.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}

.editor-upload-btn {
  display: inline-block;
}

textarea {
  visibility: hidden;
  z-index: -1;
}

input::file-selector-button {
  font-weight: bold;
  color: dodgerblue;
  padding: 0.3em;
  border: thin solid grey;
  border-radius: 3px;
}
</style>
