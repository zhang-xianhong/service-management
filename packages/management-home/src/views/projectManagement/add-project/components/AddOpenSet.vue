<template>
  <div class="add-openset">
    <el-form :model="openSetForm" label-width="140px">
      <el-form-item label="开放微对象">
        <div @click="showBox">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" readonly v-model="openSetForm.openObject">
          </el-input>
        </div>
      </el-form-item>
      <el-form-item label="开放微服务">
        <div @click="showBox">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" readonly v-model="openSetForm.openService">
          </el-input>
        </div>
      </el-form-item>
      <el-form-item label="开放微模块">
        <div @click="showBox">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" readonly v-model="openSetForm.openModel">
          </el-input>
        </div>
      </el-form-item>
    </el-form>

    <el-dialog title="项目选择" v-model="dialogVisiable">
      <div class="openset-dialog_nav">
        <span v-if="!pickedList.length">请选择项目</span>
        <el-tag v-for="(item, index) in pickedList" :key="index" closable @close="handleDelete(index, item)">
          {{ item.projectName }}
        </el-tag>
      </div>
      <div class="openset-dialog_select">
        <el-input placeholder="请输入名称" style="width: 30%;margin-right: 12px" v-model="searchChar"></el-input>
        <el-button icon="el-icon-search"></el-button>
        <el-button>全选</el-button>
        <el-button>取消</el-button>
      </div>
      <div class="openset-dialog_table">
        <el-table :data="selectList">
          <el-table-column label="项目名称" property="projectName" width="180"></el-table-column>
          <el-table-column label="项目描述" property="description" width="180"></el-table-column>
          <el-table-column label="项目别名" property="otherName" width="180"></el-table-column>
          <el-table-column label="所属租户" property="users" width="180"></el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button size="mini" type="primary" @click="handleAdd(scope.$index, scope.row)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { openSetForm } from '@/views/projectManagement/add-project/components/addProjectBus';
import { ProjectInfo } from '@/views/projectManagement/add-project/types';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'AddOpenSet',
  setup() {
    const showBox = () => {
      console.log('box');
    };
    const dialogVisiable = ref(true);
    const searchChar = ref('');

    const projectList = ref([
      {
        projectName: 'tencent-magneto',
        description: 'magneto',
        otherName: 'others',
        users: '腾讯云',
        id: '1',
      },
      {
        projectName: 'tencent-demos',
        description: 'demos',
        otherName: 'others',
        users: '腾讯云',
        id: '2',
      },
    ]);
    const selectList = ref([] as Array<ProjectInfo>);
    const pickedList = ref([] as Array<ProjectInfo>);
    const handleAdd = (index: number, item: ProjectInfo) => {
      console.log(index, item);
      let findSame = false;
      pickedList.value.forEach((i) => {
        if (item.id === i.id) {
          findSame = true;
        }
      });
      if (findSame) {
        ElMessage.error('不可重复添加信息');
      } else {
        pickedList.value.push(item);
      }
    };
    const handleDelete = (index: number, item: ProjectInfo) => {
      console.log(index, item);
      pickedList.value.splice(index, 1);
    };
    selectList.value = projectList.value;
    pickedList.value = [projectList.value[0]];
    return {
      openSetForm,
      showBox,
      projectList,
      selectList,
      pickedList,
      dialogVisiable,
      searchChar,
      handleAdd,
      handleDelete,
    };
  },
});
</script>

<style lang="scss">
.add-openset {
  width: 40%;
  .openset-dialog_nav {
    margin-bottom: 25px;
  }
  .openset-dialog_table {
    width: 100%;
    margin-top: 20px;
  }
}
</style>
