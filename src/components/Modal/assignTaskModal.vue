<template>
  <modal
    :title="'Assign Task'"
    :visible.sync="visible"
    :width="'90%'"
    @close="handleModalClose"
    @cancel="handleModalCancel"
    @confirm="handleModalConfirm"
  >
    <el-form
      ref="dataFormAssignRef"
      :model="dataForm"
      label-position="top"
      class="assign-task-modal-form"
    >
      <div class="components-container board">
        <draggable-assign-task
          :key="1"
          :list="list1"
          :group="group"
          :members="membersInProject"
          class="kanban todo"
          header-text="To do"
          list-name="todo"
          @update-assignee="handleUpdateAssignee"
        />
        <draggable-assign-task
          :key="2"
          :list="list2"
          :group="group"
          :members="membersInProject"
          class="kanban inprogress"
          header-text="In progress"
          list-name="inprogress"
          @update-assignee="handleUpdateAssignee"
        />
        <draggable-assign-task
          :key="3"
          :list="list3"
          :group="group"
          :members="membersInProject"
          class="kanban review"
          header-text="Review"
          list-name="review"
          @update-assignee="handleUpdateAssignee"
        />
        <draggable-assign-task
          :key="4"
          :list="list4"
          :group="group"
          :members="membersInProject"
          class="kanban complete"
          header-text="Complete"
          list-name="complete"
          @update-assignee="handleUpdateAssignee"
        />
        <draggable-assign-task
          :key="5"
          :list="list5"
          :group="group"
          :members="membersInProject"
          class="kanban onhold"
          header-text="On hold"
          list-name="onhold"
          @update-assignee="handleUpdateAssignee"
        />
        <draggable-assign-task
          :key="6"
          :list="list6"
          :group="group"
          :members="membersInProject"
          class="kanban rework"
          header-text="Rework/Redo"
          list-name="reword"
          @update-assignee="handleUpdateAssignee"
        />
      </div>
    </el-form>
  </modal>
</template>

<script>
import Modal from '@/components/Commons/modal.vue'
import { cloneDeep } from 'lodash'
import DraggableAssignTask from '@/components/DraggableKanban/draggableAssignTask.vue'
import { getTaskList, assignTaskByProjectId } from '@/api/project-management/task-list'

import { getProjectList } from '@/api/project-management/project-list'
import moment from 'moment'

const defaultDataForm = {}

export default {
  components: {
    Modal,
    DraggableAssignTask
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    projectId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      dataForm: cloneDeep(defaultDataForm),
      listLoading: true,
      tableKey: 0,
      // draggable
      group: 'assign',
      list1: [],
      list2: [],
      list3: [],
      list4: [],
      list5: [],
      list6: [],
      membersInProject: []
    }
  },
  watch: {
    projectId: {
      handler(newVal) {
        if (newVal) {
          const queryTask = {
            page: 1,
            size: 100000,
            projectId: newVal
          }
          this.fetchDataGetTaskByProjectId(queryTask)
          const queryProject = {
            page: 1,
            size: 10,
            ids: newVal
          }
          this.fetchProjectById(queryProject)
        } else {
          this.dataForm = cloneDeep(defaultDataForm)
        }
        this.clearValidate()
      },
      deep: true
    }
  },
  methods: {
    async fetchDataGetTaskByProjectId(queryTask) {
      const { data } = await getTaskList(queryTask)
      // Lặp qua từng task và phân loại theo status
      data.items.forEach((task) => {
        switch (task.status) {
          case 'todo':
            this.list1.push(task)
            break
          case 'inprogress':
            this.list2.push(task)
            break
          case 'review':
            this.list3.push(task)
            break
          case 'complete':
            this.list4.push(task)
            break
          case 'onhold':
            this.list5.push(task)
            break
          case 'rework':
            this.list6.push(task)
            break
          default:
            // Nếu status không khớp với các trường hợp trên thì bỏ qua
            break
        }
      })
    },
    async fetchProjectById(queryProject) {
      const { data } = await getProjectList(queryProject)
      this.membersInProject = data.items[0].members
    },
    clearValidate() {
      this.$nextTick(() => {
        this.$refs.dataFormAssignRef.clearValidate()
      })
    },
    handleModalClose() {
      this.dataForm = cloneDeep(defaultDataForm)
      this.list1 = []
      this.list2 = []
      this.list3 = []
      this.list4 = []
      this.list5 = []
      this.list6 = []
      this.membersInProject = []
      this.clearValidate()
      this.$emit('update:visible', false)
    },
    handleModalCancel() {
      this.handleModalClose()
    },
    async handleModalConfirm() {
      await this.updateAssignTaskModal()
    },
    async updateAssignTaskModal() {
      // Tạo một mảng tổng hợp từ các danh sách và thay đổi status
      const combinedList = [
        ...this.list1.map((item) => ({
          ...item,
          status: 'todo',
          startDate: item.startDate ? this.convertToISOString(item.startDate) : null,
          endDate: item.endDate ? this.convertToISOString(item.endDate) : null
        })),
        ...this.list2.map((item) => ({
          ...item,
          status: 'inprogress',
          startDate: item.startDate ? this.convertToISOString(item.startDate) : null,
          endDate: item.endDate ? this.convertToISOString(item.endDate) : null
        })),
        ...this.list3.map((item) => ({
          ...item,
          status: 'review',
          startDate: item.startDate ? this.convertToISOString(item.startDate) : null,
          endDate: item.endDate ? this.convertToISOString(item.endDate) : null
        })),
        ...this.list4.map((item) => ({
          ...item,
          status: 'complete',
          startDate: item.startDate ? this.convertToISOString(item.startDate) : null,
          endDate: item.endDate ? this.convertToISOString(item.endDate) : null
        })),
        ...this.list5.map((item) => ({
          ...item,
          status: 'onhold',
          startDate: item.startDate ? this.convertToISOString(item.startDate) : null,
          endDate: item.endDate ? this.convertToISOString(item.endDate) : null
        })),
        ...this.list6.map((item) => ({
          ...item,
          status: 'rework',
          startDate: item.startDate ? this.convertToISOString(item.startDate) : null,
          endDate: item.endDate ? this.convertToISOString(item.endDate) : null
        }))
      ]
      const assignData = {
        projectId: this.projectId,
        tasks: combinedList
      }
      await assignTaskByProjectId(assignData)
        .then((res) => {
          console.log('res', res)
          this.$notify({
            title: 'Success',
            message: 'Update Successfully',
            type: 'success',
            duration: 2000
          })
          this.$emit('update:reload-table')
          this.$emit('update:visible', false)
        })
        .catch((err) => {
          console.log('err', err)
        })
    },
    updateTableKey(newVal) {
      this.tableKey = newVal
    },
    handleUpdateAssignee(listName, taskId, newAssigneeId) {
      let targetList
      switch (listName) {
        case 'todo':
          targetList = this.list1
          break
        case 'inprogress':
          targetList = this.list2
          break
        case 'review':
          targetList = this.list3
          break
        case 'complete':
          targetList = this.list4
          break
        case 'onhold':
          targetList = this.list5
          break
        case 'rework':
          targetList = this.list6
          break
        default:
          return
      }

      const task = targetList.find((t) => t.id === taskId)
      if (task) {
        task.assigneeId = newAssigneeId
      }
    },
    convertToISOString(dateString) {
      const formattedDate = moment(dateString)
        .format('DD/MM/yyyy HH:mm:ss')
        .toString()
      return formattedDate
    }
  }
}
</script>

<style lang="scss">
.kanban {
  &.todo {
    .board-column-header {
      background: #4a9ff9;
    }
  }

  &.inprogress {
    .board-column-header {
      background: #f9944a;
    }
  }

  &.review {
    .board-column-header {
      background: #ffd700;
    }
  }

  &.complete {
    .board-column-header {
      background: #2ac06d;
    }
  }

  &.onhold {
    .board-column-header {
      background: #9370db;
    }
  }

  &.rework {
    .board-column-header {
      background: #ff8c00;
    }
  }
}
</style>

<style lang="scss" scoped>
.board {
  width: 100%;
  margin-left: 20px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: nowrap;
  column-gap: 20px;
  flex-direction: row;
  align-items: flex-start;
}
.assign-task-modal-form {
  max-height: 60vh;
  overflow-x: auto;
  overflow-y: auto;
}
</style>
