<template>
  <div class="add-openset">
    <el-form :model="openSetForm" label-width="140px">
      <el-form-item label="开放微对象">
        <div @click="showBox('openObject')">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" readonly v-model="openSetForm.openObject">
          </el-input>
        </div>
      </el-form-item>
      <el-form-item label="开放微服务">
        <div @click="showBox('openService')">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" readonly v-model="openSetForm.openService">
          </el-input>
        </div>
      </el-form-item>
      <el-form-item label="开放微模块">
        <div @click="showBox('openModel')">
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
        <el-button icon="el-icon-search" @click="searchProject"></el-button>
        <el-button @click="selectAllover" type="primary">全部选中</el-button>
        <el-button @click="resetAllover">取消全选</el-button>
      </div>
      <div class="openset-dialog_table">
        <el-table :data="selectList.slice(pagesize * (currentPage - 1), pagesize * currentPage)">
          <el-table-column label="项目名称" property="projectName" width="180">
            <template #default="scope">
              <height-light :data-obj="getHeighLightChar(scope.row.projectName)"></height-light>
              <!--              {{ getHeighLightChar(scope.row.projectName) }}-->
            </template>
          </el-table-column>
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
      <div class="openset-dialog_footer">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="selectList.length"
        >
        </el-pagination>
        <br />
        <el-button type="primary" @click="addString">确定</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { openSetForm, setOpenSetFrom } from './addProjectBus';
import { ProjectInfo, HeighLightObject } from '../types';
import { ElMessage } from 'element-plus';
import HeightLight from '@/views/projectManagement/add-project/components/HeightLight.vue';

export default defineComponent({
  name: 'AddOpenSet',
  components: {
    HeightLight,
  },
  setup() {
    const showModule = ref('openObject');
    const dialogVisiable = ref(false);
    const showBox = (pros: string) => {
      showModule.value = pros;
      dialogVisiable.value = true;
    };
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
      {
        projectName: 'tencent-magneto',
        description: 'magneto',
        otherName: 'others',
        users: '腾讯云',
        id: '3',
      },
      {
        projectName: 'tencent-demos',
        description: 'demos',
        otherName: 'others',
        users: '腾讯云',
        id: '4',
      },
      {
        projectName: 'tencent-magneto',
        description: 'magneto',
        otherName: 'others',
        users: '腾讯云',
        id: '5',
      },
      {
        projectName: 'tencent-demos',
        description: 'demos',
        otherName: 'others',
        users: '腾讯云',
        id: '6',
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
    const selectAllover = () => {
      pickedList.value = selectList.value;
    };
    const resetAllover = () => {
      pickedList.value = [];
    };
    selectList.value = projectList.value;
    pickedList.value = [projectList.value[0]];

    const currentPage = ref(1);
    const pagesize = ref(5);
    const handleSizeChange = (size: number) => {
      pagesize.value = size;
    };
    const handleCurrentChange = (current: number) => {
      currentPage.value = current;
    };
    const searchProject = () => {
      console.log(searchChar.value);
      if (!searchChar.value) {
        selectList.value = projectList.value;
      } else {
        const list: Array<ProjectInfo> = [];
        projectList.value.forEach((item: ProjectInfo) => {
          if (item.projectName.includes(searchChar.value)) {
            list.push(item);
          }
        });
        selectList.value = list;
      }
      currentPage.value = 1;
    };
    const getHeighLightChar = (strings: string) => {
      const result: HeighLightObject = {
        position: 'all',
        dataArray: [strings],
      };
      const char = searchChar.value;
      if (!char) {
        return result;
      }
      const firstIndex = strings.indexOf(char);
      if (firstIndex === -1) {
        return result;
      }
      if (firstIndex === 0) {
        result.dataArray = [char, strings.slice(char.length, strings.length - 1)];
        result.position = 'head';
      } else if (firstIndex === strings.length - char.length) {
        result.dataArray = [strings.slice(0, firstIndex), char];
        result.position = 'tail';
      } else {
        result.dataArray = [
          strings.slice(0, firstIndex),
          char,
          strings.slice(firstIndex + char.length, strings.length),
        ];
        result.position = 'middle';
      }
      return result;
    };
    const closeDialog = () => {
      dialogVisiable.value = false;
      pickedList.value = [];
    };
    const addString = () => {
      let str = '';
      pickedList.value.forEach((item: ProjectInfo, index: number) => {
        str += `${index + 1}、${item.projectName}\n`;
      });
      setOpenSetFrom<any, string>(showModule.value, str);
      closeDialog();
    };
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
      selectAllover,
      resetAllover,
      currentPage,
      handleSizeChange,
      handleCurrentChange,
      pagesize,
      searchProject,
      getHeighLightChar,
      addString,
      closeDialog,
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
    margin-bottom: 20px;
  }
  .openset-dialog_footer {
    width: 100%;
    text-align: center;
  }
  .heighlight {
    background-color: yellow;
  }
}
</style>
