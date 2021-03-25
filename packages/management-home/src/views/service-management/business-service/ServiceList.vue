<template>
  <div class="service-list">
    <div class="service-list_header">
      <div class="service-list_left">
        <el-button icon="el-icon-plus" type="primary" @click="toggleServiceDialog">新建</el-button>
        <!--        此版本暂不支持-->
        <!--        <el-button>克隆</el-button>-->
        <!--        <el-button>继承</el-button>-->
        <el-button @click="runService">启动</el-button>
        <el-button @click="stopService">停止</el-button>
        <el-button @click="deleteHandler">删除</el-button>
      </div>
      <div class="service-list_right">
        <el-input placeholder="请输入服务名称/标签/分类" style="width: 250px" v-model="pageInfo.keyword">
          <template #append>
            <el-button icon="el-icon-search" @click="searchForList"></el-button>
          </template>
        </el-input>
      </div>
    </div>
    <div class="service-list_content">
      <el-table
        :data="logs(serviceTableList.list)"
        style="margin-bottom: 20px"
        ref="serverMuitable"
        @selection-change="handleSelection"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column type="index" width="50" label="序号"> </el-table-column>
        <el-table-column property="name" label="服务名称">
          <template #default="scope">
            <router-link :to="{ path: `service-list/detail/${scope.row.id}`, query: { detailName: scope.row.name } }">{{
              scope.row.name
            }}</router-link>
          </template>
        </el-table-column>
        <el-table-column property="description" label="服务描述"></el-table-column>
        <el-table-column property="owner" label="负责人"></el-table-column>
        <el-table-column property="status" label="服务状态"></el-table-column>
        <el-table-column property="classification" label="分类">
          <template #header>
            <i class="el-icon-search"></i>
            <el-popover placement="bottom" :width="200" trigger="manual" :visible="sortTitleVisiable">
              <template #reference>
                <el-button type="text" @click="sortTitleClick">分类</el-button>
              </template>
              <el-cascader
                v-model="pageInfo.classification"
                :options="sorts"
                :props="sortProps"
                clearable
                filterable
                placeholder="请选择分类"
              ></el-cascader>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column property="tags" label="标签">
          <template #header>
            <i class="el-icon-search"></i>
            <el-popover placement="bottom" :width="200" trigger="manual" :visible="tagTitleVisiable">
              <template #reference>
                <el-button type="text" @click="tagTitleClick">标签</el-button>
              </template>
              <el-select v-model="pageInfo.tags" placeholder="请选择标签" clearable multiple>
                <el-option v-for="(item, index) in tags" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column property="source" label="服务来源"></el-table-column>
        <el-table-column property="version" label="服务版本"></el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.page"
        :page-sizes="[1, 10, 15, 20, 50]"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="serviceTableList.total"
      >
      </el-pagination>
    </div>

    <el-dialog title="新增服务" v-model="addServiceDialog" width="600px">
      <div class="add-service-set">
        <el-form :model="serviceDetail">
          <el-form-item
            label="服务名称"
            :label-width="labelWidth"
            prop="name"
            :rules="[{ required: true, message: '请输入服务名称', trigger: 'blur' }]"
          >
            <el-input v-model="serviceDetail.name">
              <template #prepend>srv-</template>
            </el-input>
          </el-form-item>
          <el-form-item
            label="服务描述"
            prop="description"
            :label-width="labelWidth"
            :rules="[{ required: true, message: '请输入服务描述', trigger: 'blur' }]"
          >
            <el-input v-model="serviceDetail.description"></el-input>
          </el-form-item>
          <el-form-item label="负责人" :label-width="labelWidth">
            <el-select v-model="serviceDetail.owner" placeholder="请选择负责人">
              <el-option
                v-for="(item, index) in persons"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="服务分类" :label-width="labelWidth">
            <el-cascader
              v-model="serviceDetail.classification"
              :options="sorts"
              :props="sortProps"
              @change="getCascaderForm"
              clearable
              filterable
              placeholder="请选择分类"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="服务标签" :label-width="labelWidth">
            <el-select v-model="serviceDetail.tag" placeholder="请选择标签" clearable multiple>
              <el-option v-for="(item, index) in tags" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="服务详情" :label-width="labelWidth">
            <el-input v-model="serviceDetail.detail" type="textarea" :rows="5"></el-input>
          </el-form-item>
          <el-form-item label="服务依赖" :label-width="labelWidth" prop="dependencies">
            <el-select v-model="serviceDetail.dependencies" clearable multiple>
              <el-option v-for="item in allService" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addServiceDialog = false">取 消</el-button>
          <el-button type="primary" @click="addServiceByForm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog :title="logType" v-model="logDialogVisible" width="40%">
      <el-input type="textarea" :rows="25" :autosize="{ maxRows: 25, minRows: 25 }" v-model="logData"></el-input>
      <div class="dialog-footer">
        <el-button type="primary" style="margin-top: 20px" @click="logDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="启动服务" v-model="runDialogVisible" width="400px">
      <el-form :model="runOptions" label-width="80px">
        <el-form-item label="启动模式">
          <el-select v-model="runOptions.model">
            <el-option label="快速启动" value="fast-model"></el-option>
            <el-option label="全新部署" value="new-model"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择分支" v-if="runOptions.model !== 'fast-model'">
          <el-select v-model="runOptions.branch">
            <el-option v-for="(item, index) in branchOptions" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitRunService">提交</el-button>
        <el-button @click="runDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog v-model="stopDialogVisible" width="300px">
      <template #title>
        <div class="title_line">提示</div>
      </template>
      <div style="height: 80px;line-height: 80px">是否停止已选服务？</div>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitStopService">确定</el-button>
        <el-button @click="stopDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <div class="black-hovers" @click="blackHoverclick" v-if="blackHoverVisible"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onBeforeUnmount } from 'vue';
import {
  refreshServiceList,
  serviceTableList,
  serviceDetail,
  persons,
  tags,
  sorts,
  deleteServiceForList,
  getTagsForService,
  getClassifications,
  getAllService,
  allService,
} from './utils/service-data-utils';
import { addService } from '@/api/servers';
import Message from 'element-plus/es/el-message';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'ServiceList',
  components: {},
  data() {
    return {
      sortProps: {
        label: 'name',
        value: 'id',
      },
    };
  },
  setup() {
    refreshServiceList();

    const mutiArray = ref([]);

    const addServiceDialog = ref(false);
    const toggleServiceDialog = () => {
      addServiceDialog.value = !addServiceDialog.value;
      getAllService();
    };
    const labelWidth = ref('100px');

    const pageInfo = reactive({
      page: 1,
      pageSize: 10,
      classification: '',
      tags: [],
      keyword: '',
    });

    const handleSizeChange = (res: number) => {
      pageInfo.pageSize = res;
      refreshServiceList(pageInfo);
    };
    const handleCurrentChange = (res: number) => {
      pageInfo.page = res;
      refreshServiceList(pageInfo);
    };
    function addServiceByForm() {
      const senddata = { ...serviceDetail };
      senddata.tag = serviceDetail.tag.join(',');
      senddata.dependencies = serviceDetail.dependencies.map((x: any) => ({
        id: x,
      }));
      if (!senddata.name) {
        return ElMessage({
          showClose: true,
          message: '请输入服务名称',
          type: 'error',
        });
      }
      if (!senddata.description) {
        return ElMessage({
          showClose: true,
          message: '请输入服务描述',
          type: 'error',
        });
      }
      senddata.name = `srv-${senddata.name}`;
      addService(senddata)
        .then(() => {
          refreshServiceList(pageInfo);
          addServiceDialog.value = false;
        })
        .catch(() => {
          addServiceDialog.value = false;
        });
    }

    getClassifications();
    getTagsForService();

    function logs(res: any) {
      console.log(res, 'this is logs');
      return res;
    }
    function getCascaderForm(res: any) {
      if (res) {
        serviceDetail.classification = `${res[0]}`;
      } else {
        serviceDetail.classification = '';
      }
    }

    // 筛选
    const blackHoverVisible = ref(false);
    const sortTitleVisiable = ref(false);
    function sortTitleClick() {
      sortTitleVisiable.value = true;
      blackHoverVisible.value = true;
    }
    const tagTitleVisiable = ref(false);
    function tagTitleClick() {
      tagTitleVisiable.value = true;
      blackHoverVisible.value = true;
    }
    const searchData = ref({} as any);
    function blackHoverclick() {
      sortTitleVisiable.value = false;
      tagTitleVisiable.value = false;
      blackHoverVisible.value = false;
    }

    const serverMuitable = ref(null);
    function handleSelection(res: any) {
      console.log(res);
      mutiArray.value = res;
    }
    onBeforeUnmount(() => {
      blackHoverclick();
    });

    function deleteHandler() {
      return deleteServiceForList(mutiArray.value).then(() => {
        refreshServiceList(pageInfo);
        Message.success('删除成功');
      });
    }

    const runDialogVisible = ref(false);
    const stopDialogVisible = ref(false);

    const logData = ref('');

    const logDialogVisible = ref(false);
    const logType = ref('启动服务');

    const runOptions = reactive({} as any);
    const branchOptions = ref(['master', 'dev', 'fix']);

    const submitRunService = () => {
      runDialogVisible.value = false;
      logDialogVisible.value = true;
      logType.value = '启动服务';
    };
    const runService = () => {
      runDialogVisible.value = true;
    };
    const stopService = () => {
      stopDialogVisible.value = true;
    };
    const submitStopService = () => {
      stopDialogVisible.value = false;
      logDialogVisible.value = true;
      logType.value = '停止服务';
    };

    const searchForList = () => {
      pageInfo.page = 1;
      refreshServiceList(pageInfo);
    };

    return {
      serviceTableList,
      serviceDetail,
      persons,
      tags,
      sorts,
      addService,
      pageInfo,
      addServiceByForm,
      logs,
      handleSizeChange,
      handleCurrentChange,
      addServiceDialog,
      labelWidth,
      toggleServiceDialog,
      sortTitleClick,
      sortTitleVisiable,
      tagTitleClick,
      tagTitleVisiable,
      searchData,
      blackHoverclick,
      blackHoverVisible,
      serverMuitable,
      handleSelection,
      deleteHandler,
      logDialogVisible,
      logData,
      runDialogVisible,
      runOptions,
      branchOptions,
      submitRunService,
      runService,
      stopService,
      stopDialogVisible,
      submitStopService,
      logType,
      searchForList,
      getCascaderForm,
      allService,
    };
  },
});
</script>

<style lang="scss">
.service-list {
  &_header {
    width: 100%;
    height: 40px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    display: flex;
    & > div {
      flex: 1;
    }
  }
  &_right {
    text-align: right;
  }
  &_content {
  }
}
.add-service-set {
  width: 400px;
  .el-input--small .el-input__inner {
    height: 32px;
    line-height: 32px;
    width: 400px;
  }
  .el-textarea__inner {
    width: 400px;
  }
  .el-input-group > .el-input__inner {
    vertical-align: middle;
    display: table-cell;
    width: 333px !important;
  }
}
.dialog-footer {
  width: 100%;
  display: block;
  text-align: center;
}
.black-hovers {
  width: 100vw;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 40;
}
.title_line {
  border-bottom: solid 1px rgba(0, 0, 0, 0.2);
  height: 60px;
  line-height: 60px;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  padding-left: 20px;
}
</style>
