<template>
  <div class="board-column">
    <div class="board-column-header">
      {{ headerText }}
    </div>
    <draggable :list="list" v-bind="$attrs" class="board-column-content">
      <div v-for="item in list" :key="item.id" class="board-item">
        <div class="board-item-name">
          <span class="svg-icon"><svg-icon name="international" /></span>
          <span class="board-name">{{ item.name }}</span>
        </div>
        <div class="board-time">
          #Time:
          {{ formatDate(item.startDate) }} - {{ formatDate(item.endDate) }}
        </div>
        <div class="select-assignee">
          <div>Select user:</div>
          <el-select
            v-model="item.assigneeId"
            :placeholder="$t('table.members')"
            filterable
            clearable
            class="select-assignee-user"
            @change="updateAssignee(item)"
          >
            <el-option
              v-for="member in members"
              :key="member.id"
              :label="member.username"
              :value="member.id"
            />
          </el-select>
          <div>
            <pan-thumb width="30px" height="30px" image="favicon.ico" />
          </div>
        </div>
      </div>
    </draggable>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import PanThumb from '@/components/PanThumb/index.vue'
import moment from 'moment'

export default {
  name: 'DraggableAssignTask',
  components: {
    Draggable,
    PanThumb
  },
  props: {
    headerText: {
      type: String,
      default: 'header'
    },
    list: {
      type: Array,
      default: () => []
    },
    options: {
      type: Object,
      default: () => null
    },
    members: {
      type: Array,
      default: () => []
    },
    listName: {
      type: String,
      required: true
    }
  },
  data() {
    return {}
  },
  methods: {
    formatDate(date) {
      if (!date) return 'undefined'
      const UTCDate = moment.utc(date)
      const localDate = moment(UTCDate).local()
      return localDate.format('DD/MM/yyyy').toString()
    },
    updateAssignee(item) {
      this.$emit('update-assignee', this.listName, item.id, item.assigneeId)
    }
  }
}
</script>

<style lang="scss" scoped>
.board-column {
  min-width: 300px;
  min-height: 100px;
  height: auto;
  overflow: hidden;
  background: #f0f0f0;
  border-radius: 3px;

  .board-column-header {
    height: 50px;
    line-height: 50px;
    overflow: hidden;
    padding: 0 20px;
    text-align: center;
    background: #333;
    color: #fff;
    border-radius: 3px 3px 0 0;
  }

  .board-column-content {
    height: auto;
    overflow: hidden;
    border: 10px solid transparent;
    min-height: 60px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;

    .board-item {
      cursor: pointer;
      width: 100%;
      min-height: 55px;
      margin: 5px 0;
      background-color: #fff;
      text-align: left;
      padding: 5px 10px;
      box-sizing: border-box;
      box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
    }
    .board-item-name {
      display: flex;
      flex-direction: row;
      column-gap: 10px;
      .svg-icon {
        color: red;
      }
      .board-name {
        font-weight: 600;
        color: #d65add;
      }
    }
    .board-time {
      margin-left: 26px;
      margin-top: 10px;
      margin-bottom: 10px;
      font-weight: 600;
      color: #c3c3b7;
    }
    .select-assignee {
      margin-left: 26px;
      font-weight: 600;
      color: #9147d6;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .select-assignee-user {
        width: 45%;
      }
    }
  }
}
</style>
