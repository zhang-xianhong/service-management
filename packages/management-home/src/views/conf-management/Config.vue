<template>
  <div class="general">
    <el-row>
      <el-col :span="6" style="text-align: left">
        <el-button
          type="primary"
          @click="addNewConfig"
          style="width: 90px"
          v-if="getShowBool('add')"
          icon="el-icon-plus"
          >新建</el-button
        >
      </el-col>
      <el-col :offset="8" :span="10" style="text-align: right">
        <el-input
          style="width: 300px"
          placeholder="请输入键名称"
          suffix-icon="el-icon-search"
          @input="filterConfig"
          v-model="searchProps.keyword"
        ></el-input>
      </el-col>
    </el-row>
    <el-row style="background: #fff">
      <el-table :data="tableData" v-loading="loading" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column label="键" prop="name"></el-table-column>
        <el-table-column label="值" prop="value"></el-table-column>
        <el-table-column label="默认值" prop="defaultValue"></el-table-column>
        <el-table-column label="类型" prop="type">
          <template #default="scope">
            <span>{{ scope.row.type === 0 ? '应用类型' : '系统类型' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="配置版本" prop="version" width="100"></el-table-column>
        <el-table-column label="操作" width="300">
          <template #default="scope">
            <el-button type="text" size="mini" @click="onEdit(scope.row)" v-if="getShowBool('update')">编辑</el-button>
            <el-button type="text" size="mini" @click="changeHistory(scope.row)" v-if="getShowBool('selectDetail')"
              >变更历史</el-button
            >
            <el-button size="mini" @click="onDelete(scope.row)" v-if="getShowBool('delete')" type="text"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <packaged-pagination
        v-if="total"
        :current-page="searchProps.page"
        :page-size="searchProps.pageSize"
        :page-sizes="[10, 20, 50]"
        layout="sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handlePageSizeChange"
        @current-change="handlePageChange"
      ></packaged-pagination>
    </el-row>
    <el-dialog
      :title="configForm.isEdit ? '编辑配置' : '新建配置'"
      v-model="addConfigDialog"
      width="600px"
      @closed="closeConfigForm"
    >
      <div class="add-config-set">
        <el-form :model="configForm.formData" :rules="configRules" ref="configFormRef">
          <el-form-item label="键" :label-width="labelWidth" prop="name">
            <el-input
              v-model.trim="configForm.formData.name"
              :disabled="configForm.disabled || configForm.isEdit"
            ></el-input>
          </el-form-item>
          <el-form-item label="值" prop="value" :label-width="labelWidth">
            <el-input v-model.trim="configForm.formData.value" :disabled="configForm.disabled"></el-input>
          </el-form-item>
          <el-form-item label="默认值" prop="defaultValue" :label-width="labelWidth">
            <el-input v-model.trim="configForm.formData.defaultValue" :disabled="configForm.disabled"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type" :label-width="labelWidth">
            <el-radio-group v-model="configForm.formData.type" :disabled="configForm.disabled">
              <el-radio label="0">应用类型</el-radio>
              <el-radio label="1">系统类型</el-radio>
            </el-radio-group>
          </el-form-item>
          <!--          <el-form-item label="配置描述" :label-width="labelWidth" prop="description">-->
          <!--            <el-input v-model.trim="configForm.formData.description" :disabled="configForm.disabled"></el-input>-->
          <!--          </el-form-item>-->
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer" v-if="!configForm.disabled">
          <el-button type="primary" @click="submitConfigForm">确定</el-button>
          <el-button @click="closeConfigForm">取消</el-button>
        </span>
        <span class="dialog-footer" v-else>
          <el-button type="primary" @click="ableEdit">编辑</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog title="变更历史" v-model="changeHistoryDialog" width="900px" :show-close="false">
      <div class="change-list">
        <el-table :data="historyData" v-loading="loading" style="width: 100%">
          <el-table-column type="index" label="序号" width="50" />
          <el-table-column label="创建时间" prop="createTime">
            <template #default="scope">
              <span>{{ dateFormat(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="键" prop="name"></el-table-column>
          <el-table-column label="值" prop="value"></el-table-column>
          <el-table-column label="默认值" prop="defaultValue"></el-table-column>
          <el-table-column label="类型" prop="type">
            <template #default="scope">
              <span>{{ scope.row.type === 0 ? '应用类型' : '系统类型' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="版本" prop="version" width="100"></el-table-column>
        </el-table>
      </div>
      <template #footer>
        <span class="dialog-footer" v-if="!configForm.disabled">
          <el-button type="primary" @click="closeChangeHistory">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { reactive, getCurrentInstance, toRefs, ref, defineComponent } from 'vue';
import {
  getConfig,
  addConfig,
  updateConfig,
  deleteConfig,
  getHistory,
  deliveryConfig,
  checkKeyRule,
} from '@/api/settings/config';
import PackagedPagination from '@/components/pagination/Index.vue';
import { debounce } from 'lodash';
import { ElMessageBox, ElMessage } from 'element-plus';
import dateFormat from '@/utils/date-format';
import { getShowBool } from '@/utils/permission-show-module';

// 状态码
enum ResCode {
  Success,
}
interface TableState {
  tableData: Array<object>;
  loading: boolean;
  multipleSelection: Array<object>;
  total: number;
  historyData: Array<object>;
  searchProps: {
    keyword: string;
    page: number;
    pageSize: number;
    sortField: string;
    sortType: 'ascending' | 'descending';
  };
}
interface ConfigFormState {
  disabled: boolean;
  isEdit: boolean;
  id: string;
  formData: {
    name: string;
    value: string;
    defaultValue: string;
    type: string;
    description: string;
  };
}

export default defineComponent({
  name: 'Config',
  components: {
    PackagedPagination,
  },
  setup() {
    // 表单相关状态
    const tableState: TableState = reactive({
      tableData: [],
      loading: false,
      multipleSelection: [],
      total: 0,
      historyData: [],
      searchProps: {
        keyword: '',
        page: 1,
        pageSize: 10,
        sortField: '',
        sortType: 'descending',
      },
    });
    // 新增配置表单数据
    const configForm: ConfigFormState = reactive({
      disabled: false,
      isEdit: false,
      id: '',
      formData: {
        name: '',
        value: '',
        defaultValue: '',
        type: '1',
        description: '',
      },
    });
    let editOldKey = '';
    // // 服务key校验
    const validatorKeyPass = async (rule: any, value: string, callback: Function) => {
      // 校验规则
      const szReg = /^[a-zA-Z][A-Za-z0-9-_.]+$/;
      if (!szReg.test(value)) {
        callback(new Error('字母、中划线、下划线、小数点包含数字，不能只输入数字不能以数字开头'));
      }
      // 是否是编辑，且没有修改
      if (configForm.isEdit && configForm.formData.name === editOldKey) {
        callback();
      }
      // 后台校验
      const { code, data } = await checkKeyRule({
        name: value,
        scope: 2,
      });
      const { usable } = data;
      if (code === ResCode.Success && !usable) {
        callback(new Error('键已存在!'));
      }
      callback();
    };
    const configRules = {
      name: [
        { required: true, message: '请输入键（Key）', trigger: 'blur' },
        { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' },
        { validator: validatorKeyPass, trigger: 'blur' },
      ],
      value: [{ required: true, message: '请输入值（Value）', trigger: 'blur' }],
      defaultValue: [{ required: true, message: '请输入值（DefaultValue）', trigger: 'blur' }],
      type: [{ required: true, message: '请选则类型', trigger: 'change' }],
    };

    // 获取组件实例
    const instance = getCurrentInstance();

    // 初始化configForm
    function initConfigForm() {
      configForm.isEdit = false;
      configForm.disabled = false;
      configForm.id = '';
      configForm.formData = {
        name: '',
        value: '',
        defaultValue: '',
        type: '1',
        description: '',
      };
    }

    // 获取通用配置数据
    async function getTableData() {
      tableState.loading = true;
      const { data } = await getConfig(tableState.searchProps);
      tableState.loading = false;
      tableState.total = data.count;
      tableState.tableData = data.rows || [];
    }
    getTableData();
    const labelWidth = ref('100px');
    const addConfigDialog = ref(false);

    const changeHistoryDialog = ref(false);

    const toggleConfigDialog = () => {
      addConfigDialog.value = !addConfigDialog.value;
    };

    // 表单引用
    const configFormRef: any = ref(null);

    // 关闭新增dialog
    function closeConfigForm() {
      initConfigForm();
      toggleConfigDialog();
    }

    // 提交通用配置
    async function submitConfigForm() {
      configFormRef.value.validate(async (valid: boolean) => {
        if (valid) {
          // 添加
          if (!configForm.isEdit) {
            const { code } = await addConfig({
              ...configForm.formData,
              type: parseInt(configForm.formData.type, 10),
            });
            if (code === 0) {
              getTableData();
            } else {
              (instance as any).proxy.$message({
                type: 'error',
                message: '添加失败',
              });
            }
            closeConfigForm();
          } else {
            // 编辑
            const { code } = await updateConfig(configForm.id, {
              ...configForm.formData,
              type: parseInt(configForm.formData.type, 10),
            });
            if (code === 0) {
              ElMessage.success('编辑配置成功');
              getTableData();
            } else {
              (instance as any).proxy.$message({
                type: 'error',
                message: '编辑失败',
              });
            }
            closeConfigForm();
          }
        }
      });
    }

    // 新建配置
    function addNewConfig() {
      toggleConfigDialog();
    }

    // 配置下发
    const issueConfig = async () => {
      const { code } = await deliveryConfig();
      if (code === 0) {
        (instance as any).proxy.$message({
          type: 'success',
          message: '下发配置参数成功',
        });
      } else {
        (instance as any).proxy.$message({
          type: 'error',
          message: '下发参数配置失败',
        });
      }
    };

    // 开启编辑
    function ableEdit() {
      configForm.disabled = false;
    }

    // 编辑配置
    const onEdit = async (rowData: any) => {
      configForm.isEdit = true;
      configForm.disabled = true;
      configForm.id = rowData.id;
      editOldKey = rowData.name;
      configForm.formData = { ...configForm.formData, ...rowData, type: String(rowData.type) };
      toggleConfigDialog();
    };

    // 变更历史
    const changeHistory = async (rowData: any) => {
      const searchProps = {
        page: 1,
        pageSize: 20,
      };
      const { code, data } = await getHistory(rowData.id, searchProps);
      if (code === 0) {
        tableState.historyData = data.rows || [];
        changeHistoryDialog.value = true;
      } else {
        (instance as any).proxy.$message({
          type: 'error',
          message: '获取变更历史失败',
        });
      }
    };

    // 关闭变更历史
    function closeChangeHistory() {
      changeHistoryDialog.value = false;
    }

    // 删除配置
    const onDelete = async (rowData: any) => {
      ElMessageBox.confirm(`是否删除已选服务?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const { code }: any = await deleteConfig(rowData.id);
        if (code === 0) {
          (instance as any).proxy.$message({
            type: 'success',
            message: '删除成功',
          });
          getTableData();
        } else {
          (instance as any).proxy.$message({
            type: 'error',
            message: '删除失败',
          });
        }
      });
    };

    // 通用配置筛选
    const filterConfig = debounce(getTableData, 1000);

    // 数据类型勾选
    const handleSelectionChange = (val: Array<object>) => {
      tableState.multipleSelection = val;
    };

    // 每页条数改变
    const handlePageSizeChange = (pageSize: number) => {
      tableState.searchProps.pageSize = pageSize;
      getTableData();
    };

    // 页数切换
    const handlePageChange = (pageNum: number) => {
      tableState.searchProps.page = pageNum;
      getTableData();
    };

    return {
      ...toRefs(tableState),
      addNewConfig,
      issueConfig,
      labelWidth,
      configForm,
      configRules,
      addConfigDialog,
      changeHistoryDialog,
      configFormRef,
      submitConfigForm,
      closeConfigForm,
      closeChangeHistory,
      ableEdit,
      onEdit,
      changeHistory,
      onDelete,
      filterConfig,
      handleSelectionChange,
      handlePageSizeChange,
      handlePageChange,
      dateFormat,
      getShowBool,
    };
  },
});
</script>

<style scoped>
.datatype-add {
  float: right;
  margin-bottom: 12px;
}
.dialog-footer {
  width: 100%;
  display: block;
  text-align: center;
  margin-bottom: 20px;
}
.el-row {
  margin-bottom: 10px;
}
</style>
