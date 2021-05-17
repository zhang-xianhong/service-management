<template>
  <div
    class="service-list"
    v-loading="!userProjectList.length"
    element-loading-text="暂无项目，请联系管理员添加项目"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 1)"
  >
    <div class="service-list_header">
      <div class="service-list_left">
        <el-button
          icon="el-icon-plus"
          v-if="getShowBool('add')"
          type="primary"
          @click="toggleServiceDialog"
          style="width: 90px"
          >新建</el-button
        >
        <el-button @click="runService" :disabled="computedDisabled" v-if="false">启动</el-button>
        <el-button @click="stopService" :disabled="computedDisabled" v-if="false">停止</el-button>
        <el-button @click="deleteHandler" :disabled="computedDisabledForSS" v-if="getShowBool('delete')"
          >删除</el-button
        >
      </div>
      <div class="service-list_right">
        <el-input
          placeholder="请输入服务名称/标签/分类"
          style="width: 500px"
          v-model="pageInfo.keyword"
          suffix-icon="el-icon-search"
          @input="searchForList"
          @keyup.enter="searchForList"
        ></el-input>
      </div>
    </div>
    <div class="service-list_content">
      <el-table
        :data="serviceTableList.list"
        style="margin-bottom: 20px"
        ref="serverMuitable"
        @selection-change="handleSelection"
        v-if="refreshMess"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column property="name" label="服务英文名">
          <template #default="scope">
            <router-link
              v-if="getShowBool('selectDetail')"
              :to="{ path: `service-list/detail/${scope.row.id}`, query: { detailName: scope.row.name } }"
              >{{ scope.row.name }}</router-link
            >
            <el-button type="text" v-else>{{ scope.row.name }}</el-button>
          </template>
        </el-table-column>
        <el-table-column property="description" label="服务中文名"></el-table-column>
        <el-table-column property="ownerstr" label="负责人"></el-table-column>
        <el-table-column property="status" label="服务状态">
          <template #default="scope">
            <span class="service-list-borders" :style="{ background: statusColor[scope.row.status] }"></span>
            <span :style="{ color: statusColor[scope.row.status] }">{{
              computeStatusLabel(scope.row.initTimes)[scope.row.status]
            }}</span>
          </template>
        </el-table-column>
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
                @change="getSortClassification"
                placeholder="请选择分类"
              ></el-cascader>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column property="tag" label="标签">
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
      <packaged-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.page"
        :page-sizes="[1, 10, 15, 20, 50]"
        :page-size="pageInfo.pageSize"
        layout="sizes, prev, pager, next, jumper"
        :total="serviceTableList.total"
        v-if="serviceTableList.list.length"
      ></packaged-pagination>
    </div>

    <el-dialog title="新增服务" v-model="addServiceDialog" width="600px">
      <div class="add-service-set">
        <el-form :model="serviceDetail">
          <el-form-item
            label="服务英文名"
            :label-width="labelWidth"
            prop="name"
            :rules="[
              { required: true, message: '请输入服务名称', trigger: 'blur' },
              { min: 1, max: 32, message: '最大不能超过 32 个字符', trigger: 'blur' },
              {
                validator: validatorPass,
                message: '仅支持英文、数字、中划线，不能以中划线开头和结尾',
                trigger: 'blur',
              },
            ]"
          >
            <el-input v-model.trim="serviceDetail.name" @blur="checkEnglishName">
              <template #prepend>srv-</template>
            </el-input>
          </el-form-item>
          <el-form-item
            label="服务中文名"
            prop="description"
            :label-width="labelWidth"
            :rules="[
              { required: true, message: '请输入服务描述', trigger: 'blur' },
              { min: 1, max: 60, message: '最大不能超过 60 个字符', trigger: 'blur' },
            ]"
          >
            <el-input v-model.trim="serviceDetail.description"></el-input>
          </el-form-item>
          <el-form-item label="负责人" :label-width="labelWidth">
            <fetch-owners-select @get-owners="setOwner"></fetch-owners-select>
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
            <el-select v-model="serviceDetail.tags" placeholder="请选择标签" clearable multiple>
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
          <el-button type="primary" @click="addServiceByForm">提 交</el-button>
          <el-button
            @click="
              addServiceDialog = false;
              clearDialog();
            "
            >关 闭</el-button
          >
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
      <div style="height: 80px; line-height: 80px">是否停止已选服务？</div>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitStopService">确定</el-button>
        <el-button @click="stopDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <div class="black-hovers" @click="blackHoverclick()" v-if="blackHoverVisible"></div>
  </div>
</template>

<script lang="ts">
/*eslint-disable*/
import { defineComponent, reactive, ref, onBeforeUnmount, computed } from 'vue';
import PackagedPagination from '@/components/pagination/Index.vue';
import { userProjectList } from '@/layout/messageCenter/user-info';
import { getShowBool } from "@/utils/permission-show-module";
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
  ownersMap,
} from './utils/service-data-utils';
import { addService, serviceNameTest } from '@/api/servers';
import Message from 'element-plus/es/el-message';
import { ElMessage, ElMessageBox } from 'element-plus';
import { computeStatusLabel, statusColor } from '@/views/service-management/business-service/utils/service-status-map';
import fetchOwnersSelect from '@/components/fetchOwnersSelect/Index.vue';

export default defineComponent({
  name: 'ServiceList',
  components: {
    fetchOwnersSelect,
    PackagedPagination,
  },
  data() {
    return {
      sortProps: {
        label: 'name',
        value: 'id',
        emitPath: false,
        multiple: true,
      },
    };
  },
  setup() {

    if (userProjectList.value.length) {
      getClassifications();
      getTagsForService();

      refreshServiceList();
    }

    const mutiArray = ref([] as any);
    const rememberMutiArray = ref([] as any);
    const compuMutiArr = ref([] as any);
    const refreshMess = ref(true);
    const serverMuitable = ref(null);

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
    const refreshDataAndChange = () => {
      rememberMutiArray.value = mutiArray.value;
      (serverMuitable.value as any).clearSelection();
      refreshServiceList(pageInfo).then(() => {
        serviceTableList.list
          .map((x: any) => {
            if (rememberMutiArray.value.includes(x.id as any)) {
              return x;
            }
            return null;
          })
          .filter((x: any) => x)
          .forEach((x: any) => {
            (serverMuitable.value as any).toggleRowSelection(x, true);
          });
        rememberMutiArray.value = [];
      });
    };

    let intervalId: any = null;
    if (userProjectList.value.length) {
      intervalId = setInterval(() => {
        refreshDataAndChange();
      }, 5000);
    }

    onBeforeUnmount(() => {
      clearInterval(intervalId);
    });

    const handleSizeChange = (res: number) => {
      pageInfo.pageSize = res;
      refreshServiceList(pageInfo);
    };
    const handleCurrentChange = (res: number) => {
      pageInfo.page = res;
      refreshServiceList(pageInfo);
    };
    function clearDialog() {
      const keys = Object.keys(serviceDetail);
      keys.forEach((x) => {
        serviceDetail[x] = '';
      });
    }
    function addServiceByForm() {
      const senddata = { ...serviceDetail };
      senddata.tags = serviceDetail.tags ? serviceDetail.tags.join(',') : '';
      senddata.dependencies = serviceDetail.dependencies
        ? serviceDetail.dependencies.map((x: any) => ({
          id: x,
        }))
        : [];
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
      senddata.classification = serviceDetail.classification ? serviceDetail.classification.join(',') : '';
      addService(senddata)
        .then(() => {
          refreshServiceList(pageInfo);
          addServiceDialog.value = false;
          clearDialog();
        })
        .catch(() => {
          addServiceDialog.value = false;
        });
    }

    function logs(res: any) {
      console.log(res, 'this is logs');
      return res;
    }
    function getCascaderForm(res: any) {
      serviceDetail.classification = res;
      console.log(res, serviceDetail.classification);
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

    function handleSelection(res: any) {
      mutiArray.value = res.map((x: any) => x.id);
      compuMutiArr.value = res;
    }

    function deleteHandler() {
      ElMessageBox.confirm('删除动作不可撤销, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() =>
          deleteServiceForList(mutiArray.value).then(() => {
            refreshServiceList(pageInfo);
            Message.success('删除成功');
          }),
        )
        .catch(() => {
          Message({
            type: 'info',
            message: '已取消删除',
          });
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
      const infos = { ...pageInfo };
      infos.classification = Object.values(pageInfo.classification).join(',');
      refreshServiceList(infos);
    };

    const getSortClassification = (res: any) => {
      pageInfo.classification = res;
    };

    const computedDisabled = computed(() => {
      let res = false;
      if (compuMutiArr.value.length === 0 || compuMutiArr.value.length > 1) {
        return !res;
      }
      compuMutiArr.value.forEach((x: any) => {
        if (+x.status === 20 || +x.status === 10 || +x.status === 0) {
          res = true;
        }
      });
      return res;
    });

    const computedDisabledForSS = computed(() => {
      let res = false;
      if (compuMutiArr.value.length === 0) {
        return !res;
      }
      compuMutiArr.value.forEach((x: any) => {
        if (+x.status === 20 || +x.status === 10 || +x.status === 21) {
          res = true;
        }
      });
      return res;
    });

    const setOwner = (res: string) => {
      serviceDetail.owner = res;
    };

    const checkEnglishName = () => {
      if (!serviceDetail.name) {
        return;
      }
      serviceNameTest({ name: `srv-${serviceDetail.name}` });
    };

    function blackHoverclick() {
      sortTitleVisiable.value = false;
      tagTitleVisiable.value = false;
      blackHoverVisible.value = false;
      searchForList();
      console.log('111111');
    }
    onBeforeUnmount(() => {
      blackHoverclick();
    });
    const validatorPass = (rule: any, value: any, callback: any) => {
      const reg = /^(?!-)(?!.*-$)[a-z0-9\-]+$/;
      if (!reg.test(value)) {
        callback(new Error(rule.message));
      }
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
      getSortClassification,
      mutiArray,
      computedDisabled,
      computedDisabledForSS,
      clearDialog,
      computeStatusLabel,
      statusColor,
      ownersMap,
      setOwner,
      refreshMess,
      checkEnglishName,
      userProjectList,
      validatorPass,
      getShowBool,
    };
  },
});
</script>

<style lang="scss">
.service-list {
  .service-list-borders {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: transparent;
    display: inline-block;
    vertical-align: center;
    margin-right: 5px;
  }
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
    background: #fff;
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
  margin-bottom: 20px;
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
