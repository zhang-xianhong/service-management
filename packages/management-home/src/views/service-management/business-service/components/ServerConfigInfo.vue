<template>
  <div style="background: #fff">
    <el-table :data="tableData" style="width: 100%" height="330">
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column label="键" prop="name" width="500">
        <template #default="scope">
          <a v-if="!scope.row.isEdit" @click="openDetailDialog(scope.row)">{{ scope.row.name }}</a>
          <el-input v-else v-model.trim="scope.row.name" placeholder="请输入键"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="值" prop="value">
        <template #default="scope">
          <span v-if="!scope.row.isEdit">{{ scope.row.value }}</span>
          <el-input v-else v-model.trim="scope.row.value" placeholder="请输入值"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="默认值" prop="defaultValue">
        <template #default="scope">
          <span v-if="!scope.row.isEdit">{{ scope.row.defaultValue }}</span>
          <el-input v-else v-model.trim="scope.row.defaultValue" placeholder="请输入默认值"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="type">
        <template #default="scope">
          <span v-if="!scope.row.isEdit">{{ scope.row.type === 0 ? '应用类型' : '系统类型' }}</span>
          <el-select v-else v-model="scope.row.type" placeholder="请选择应用类型">
            <el-option :value="0" label="应用类型"></el-option>
            <el-option :value="1" label="系统类型"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="版本" prop="version">
        <template #default="scope">
          <span v-if="!scope.row.isEdit">{{ scope.row.version }}</span>
          <el-input v-else v-model.trim="scope.row.version" placeholder="请输入版本号"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" v-if="getShowBool('update')">
        <template #default="scope">
          <template v-if="!scope.row.isEdit">
            <a class="operation-link" @click="addItem(scope.$index)">添加</a>
            <a class="operation-link" @click="openHistoryDialog(scope.row)">变更历史</a>
            <a class="operation-link" @click="deleteItem(scope.row)">删除</a>
          </template>
          <template v-else>
            <a class="operation-link" @click="saveModify(scope.row)">确定</a>
            <a class="operation-link" @click="cancelModify(scope.$index)">取消</a>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div class="serverinfo-operations" v-if="getShowBool('update')">
      <el-button type="primary" @click="deliveryList">配置下发</el-button>
      <el-button @click="$emit('back')">返回</el-button>
    </div>
  </div>
  <!-- 详情弹窗 -->
  <el-dialog title="参数配置" v-model="isOpenDetailDialog" width="570px">
    <el-form :mode="detailInfo" label-width="120px" label-position="left">
      <el-form-item label="键" prop="name">{{ detailInfo.name }}</el-form-item>
      <el-form-item label="值" prop="value">
        <el-input v-if="isEditable" v-model.trim="detailInfo.value" placeholder="请输入值"></el-input>
        <template v-else>{{ detailInfo.value }}</template>
      </el-form-item>
      <el-form-item label="默认值" prop="defaultValue">
        <el-input v-if="isEditable" v-model.trim="detailInfo.defaultValue" placeholder="请输入默认值"></el-input>
        <template v-else>{{ detailInfo.defaultValue }}</template>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-if="isEditable" v-model="detailInfo.type">
          <el-option :value="0" label="应用类型"></el-option>
          <el-option :value="1" label="系统类型"></el-option>
        </el-select>
        <template v-else>{{ detailInfo.type === 0 ? '应用类型' : '系统类型' }}</template>
      </el-form-item>
      <!--      <el-form-item label="配置描述" prop="description">-->
      <!--        <el-input v-if="isEditable"></el-input>-->
      <!--        <template v-else>{{ detailInfo.description }}</template>-->
      <!--      </el-form-item>-->
      <el-form-item>
        <template v-if="isEditable">
          <el-button @click="submitDetailModify" type="primary">确定</el-button>
          <el-button @click="closeDetailDialog">取消</el-button>
        </template>
        <template v-else>
          <el-button type="primary" @click="isEditable = true" v-if="!isRefrenceService">编辑</el-button>
        </template>
      </el-form-item>
    </el-form>
  </el-dialog>
  <!-- 变更历史弹窗 -->
  <el-dialog title="变更历史" v-model="isOpenHistoryDialog" width="900px">
    <el-table :data="historyInfo">
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="160">
        <template #default="scope">{{ dateFormat(scope.row.createTime) }}</template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in historyTableColumns"
        :key="index"
        :label="item.label"
        :prop="item.prop"
      ></el-table-column>
    </el-table>
    <template #footer>
      <el-button type="primary" @click="isOpenHistoryDialog = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted, getCurrentInstance, inject } from 'vue';
import {
  getServiceConfig,
  addConfig,
  updateConfig,
  deleteConfig,
  getHistory,
  deliveryServiceConfig,
} from '@/api/settings/config';
import dateFormat from '@/utils/date-format';
import { getShowBool } from '@/utils/permission-show-module';
import { isRefrence } from '../utils/permisson';

export default {
  name: 'ServerConfigInfo',
  props: {
    id: {
      type: Number,
      default: 0,
    },
  },
  inheritAttrs: false,
  emits: ['back'],
  setup(props: { id: number }) {
    const { proxy } = getCurrentInstance() as any;
    const serviceId = inject('serviceId') as number;

    const state = reactive({
      tableData: [] as any[],
      detailInfo: {} as any,
      historyInfo: {} as any,
      isEditable: false,
      isOpenDetailDialog: false,
      isOpenHistoryDialog: false,
    });

    const historyTableColumns = [
      { label: '键', prop: 'name' },
      { label: '值', prop: 'value' },
      { label: '默认值', prop: 'defaultValue' },
      { label: '类型', prop: 'type' },
      { label: '版本', prop: 'version' },
    ];

    // 获取服务配置数据
    const getTableData = async () => {
      const { data } = await getServiceConfig(String(props.id));
      state.tableData = data.map((item: any) => ({ ...item, ...{ isEdit: false } }));
      state.tableData.push({ name: '', value: '', defaultValue: '', type: '', version: '', isEdit: true });
    };

    onMounted(() => {
      getTableData();
    });

    // 打开详情弹窗
    const openDetailDialog = (rowData: any) => {
      state.isOpenDetailDialog = true;
      state.detailInfo = rowData;
    };

    // 提交详情弹窗修改
    const submitDetailModify = async () => {
      const { code } = await updateConfig(state.detailInfo.id, state.detailInfo);
      if (code === 0) {
        proxy.$message({
          type: 'success',
          message: '提交成功',
        });
        state.isOpenDetailDialog = false;
        state.isEditable = false;
        getTableData();
      }
    };

    // 关闭详情弹窗
    const closeDetailDialog = () => {
      state.isOpenDetailDialog = false;
      state.isEditable = false;
    };

    // 打开变更历史弹窗
    const openHistoryDialog = async (rowData: any) => {
      const searchProps = {
        page: 1,
        pageSize: 20,
      };
      const { data } = await getHistory(rowData.id, searchProps);
      state.historyInfo = data.rows;
      state.isOpenHistoryDialog = true;
    };

    // 添加配置项
    const addItem = (index: number) => {
      state.tableData.splice(index + 1, 0, {
        name: '',
        value: '',
        defaultValue: '',
        type: '',
        version: '',
        scope: 0,
        isEdit: true,
      });
    };

    // 保存新增配置项修改
    const saveModify = async (rowData: any) => {
      const configData = {
        ...rowData,
        serviceId,
      };
      const { code } = await addConfig(configData);
      if (code === 0) {
        proxy.$message({
          type: 'success',
          message: '保存成功',
        });
        getTableData();
      }
    };

    // 取消新增配置项修改
    const cancelModify = (index: number) => {
      state.tableData.splice(index, 1);
    };

    // 删除配置项
    const deleteItem = async (rowData: any) => {
      const { code } = await deleteConfig(rowData.id);
      if (code === 0) {
        proxy.$message({
          type: 'success',
          message: '删除成功',
        });
        getTableData();
      }
    };

    const deliveryList = async () => {
      const { code } = await deliveryServiceConfig(String(props.id));
      if (code === 0) {
        proxy.$message({
          type: 'success',
          message: '下发成功',
        });
      }
    };
    const isRefrenceService = inject(isRefrence);
    return {
      ...toRefs(state),
      dateFormat,
      historyTableColumns,
      openDetailDialog,
      submitDetailModify,
      closeDetailDialog,
      openHistoryDialog,
      addItem,
      saveModify,
      cancelModify,
      deleteItem,
      deliveryList,
      getShowBool,
      isRefrenceService,
    };
  },
};
</script>

<style scoped lang="scss">
.operation-link {
  margin-right: 4px;
}
.serverinfo-operations {
  padding: 12px;
  display: flex;
  justify-content: flex-end;
}
</style>
