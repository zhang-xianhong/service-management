<template>
  <el-row>
    <el-col :span="6" style="text-align: left">
      <el-button
        type="primary"
        icon="el-icon-plus"
        style="width: 90px"
        @click="openCreateDialog"
        v-if="getShowBool('add')"
        :disabled="!userProjectList.length"
        >新增</el-button
      >
    </el-col>
    <el-col :span="6" :offset="12" style="text-align: right">
      <el-input
        placeholder="请输入应用中文/英文名称"
        style="width: 100%"
        v-model="searchProps.keyword"
        @input="filterApps"
        suffix-icon="el-icon-search"
      ></el-input>
    </el-col>
  </el-row>
  <list-wrap
    :loading="loading"
    :empty="applicationList.length === 0"
    :handleCreate="openCreateDialog"
    :hasCreateAuth="getShowBool('add')"
  >
    <div class="application-list_content">
      <div class="application-cards">
        <application-card
          v-for="item in applicationList"
          :key="item.id"
          :data="item"
          @update="onUpdate"
        ></application-card>
      </div>
      <packaged-pagination
        v-if="applicationList.length && !loading"
        :current-page="searchProps.page"
        :page-sizes="[1, 5, 10, 20, 50]"
        :page-size="searchProps.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handlePageSizeChange"
        @current-change="handlePageChange"
      ></packaged-pagination>
    </div>
  </list-wrap>

  <el-dialog title="新建应用" v-model="createDialogVisible" width="500px">
    <el-form :model="appInfo" :rules="rules" label-width="120px" label-position="left" ref="form">
      <el-form-item label="应用中文名称" prop="description">
        <el-input v-model.trim="appInfo.description" placeholder="请输入中文名称" ref="descriptionName"></el-input>
      </el-form-item>
      <el-form-item label="应用英文名称" prop="name">
        <el-input v-model.trim="appInfo.name" placeholder="请输入英文名称" ref="englishName"></el-input>
      </el-form-item>
      <el-form-item>
        <template v-slot:label>应用图标<i class="el-icon-question info-icon"></i></template>
        <el-upload
          class="avatar-uploader"
          :action="IMAGE_UPLOAD"
          accept=".jpg,.png,.jpeg"
          :show-file-list="false"
          :before-upload="beforeUpload"
          @success="logoUploadSuccess"
        >
          <i v-if="!imageUrl" class="el-icon-plus avatar-uploader-icon"></i>
          <img v-else :src="imageUrl" alt="" style="width: 110px; height: 110px" />
        </el-upload>
      </el-form-item>
      <el-form-item label="应用简介">
        <el-input
          v-model="appInfo.remark"
          type="textarea"
          :rows="3"
          placeholder="请输入应用简介，小于225字"
          maxlength="225"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="关联服务">
        <el-select v-model="appInfo.services" multiple placeholder="请选择关联服务">
          <el-option v-for="item in allService" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button type="primary" @click="submitAppCreate">保存</el-button>
      <el-button @click="closeAppCreate">取消</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, getCurrentInstance, ref } from 'vue';
import ApplicationCard from './components/ApplicationCard.vue';
import PackagedPagination from '@/components/pagination/Index.vue';
import { IMAGE_UPLOAD } from '@/shared/constant/file';
import { getApps, createApp } from '@/api/app';
import { SuccessResponse } from '@/types/response';
import { allService, getAllService } from '../service-management/business-service/utils/service-data-utils';
import { debounce } from 'lodash/fp';
import { userProjectList } from '@/layout/messageCenter/user-info';
import { getShowBool } from '@/utils/permission-show-module';

interface StateInterface {
  applicationList: any[];
  total: number;
  loading: boolean;
  createDialogVisible: boolean;
  appInfo: {
    name: string;
    description: string;
    remark: string;
    thumbnail: string;
    services: number[];
  };
  imageUrl: string;
  statusLabel: string;
}

export default defineComponent({
  name: 'ApplicationManagement',
  components: {
    ApplicationCard,
    PackagedPagination,
  },
  setup() {
    const instance = getCurrentInstance();

    const searchProps = reactive({
      keyword: '',
      page: 1,
      pageSize: 10,
    });

    const state: StateInterface = reactive({
      applicationList: [],
      total: 0,
      loading: false,
      createDialogVisible: false,
      appInfo: {
        name: '',
        description: '',
        remark: '',
        thumbnail: '',
        services: [],
      },
      imageUrl: '',
      statusLabel: '',
    });
    const englishName = ref(null as any);
    const descriptionName = ref(null as any);
    const form = ref(null as any);

    const rules = {
      description: [
        { required: true, message: '请输入应用中文名称', trigger: 'blur' },
        {
          min: 3,
          max: 20,
          message: '应用中文名称长度在3到20个字符之间',
          trigger: 'blur',
        },
      ],
      name: [
        { required: true, message: '请输入应用英文名称', trigger: 'blur' },
        {
          min: 3,
          max: 16,
          message: '应用英文名称长度在3到16个字符之间',
          trigger: 'blur',
        },
        {
          pattern: /^[a-zA-Z]+$/g,
          message: '该应用英文名称包含非法字符，请重新输入',
          trigger: 'blur',
        },
      ],
    };

    const getAppList = async () => {
      state.loading = true;
      state.statusLabel = '数据加载中...';
      const { data } = await getApps(searchProps);
      state.loading = false;
      state.statusLabel = '';
      if (data.rows) {
        state.applicationList = data.rows;
        state.total = data.count;
      }
      if (userProjectList.value.length === 0) {
        return (state.statusLabel = '暂无项目，请联系管理员添加项目');
      }
      if (state.applicationList.length === 0) {
        return (state.statusLabel = '暂无数据');
      }
    };
    getAppList();

    getAllService();

    setInterval(() => (state.statusLabel = new Date().toDateString()), 2000);

    const openCreateDialog = () => {
      state.createDialogVisible = true;
    };

    const beforeUpload = (file: { size: number }) => {
      if (file.size > 1024 * 50) {
        (instance as any).proxy.$message({
          type: 'warning',
          message: '上传图片大小不能超过 50 kb',
        });
        return false;
      }
    };

    const logoUploadSuccess = (res: SuccessResponse<any>, file: { raw: unknown }) => {
      if (res.code === 0 && res.data?.fileKey) {
        state.appInfo.thumbnail = res.data.fileKey;
        state.imageUrl = URL.createObjectURL(file.raw);
      } else {
        (instance as any).proxy.$message({
          type: 'error',
          message: '上传失败，请重新上传！',
        });
      }
    };

    const submitAppCreate = async () => {
      englishName.value.handleBlur();
      descriptionName.value.handleBlur();
      if (!state.appInfo.name.trim() || !state.appInfo.description.trim()) {
        return false;
      }
      const reg = /^[a-zA-Z]+$/g;
      if (!reg.test(state.appInfo.name)) {
        return false;
      }
      if (state.appInfo.name.length > 16 || state.appInfo.name.length < 3) {
        return false;
      }
      if (state.appInfo.description.length > 20 || state.appInfo.description.length < 3) {
        return false;
      }
      const { code } = await createApp(state.appInfo);
      if (code === 0) {
        (instance as any).proxy.$message({
          type: 'success',
          message: '应用新建成功',
        });
        state.createDialogVisible = false;
        state.imageUrl = '';
        state.appInfo = {
          name: '',
          description: '',
          remark: '',
          thumbnail: '',
          services: [],
        };
      }
      getAppList();
    };

    const closeAppCreate = async () => {
      state.createDialogVisible = false;
      state.imageUrl = '';
      form.value.resetFields();
      state.appInfo = {
        name: '',
        description: '',
        remark: '',
        thumbnail: '',
        services: [],
      };
    };

    const onUpdate = () => {
      getAppList();
    };

    const filterApps = debounce(500)(getAppList);

    // 每页条数改变
    const handlePageSizeChange = (pageSize: number) => {
      searchProps.pageSize = pageSize;
      getAppList();
    };

    // 页数切换
    const handlePageChange = (pageNum: number) => {
      searchProps.page = pageNum;
      getAppList();
    };

    return {
      IMAGE_UPLOAD,
      searchProps,
      ...toRefs(state),
      rules,
      allService,
      getAppList,
      openCreateDialog,
      beforeUpload,
      logoUploadSuccess,
      submitAppCreate,
      closeAppCreate,
      onUpdate,
      filterApps,
      handlePageSizeChange,
      handlePageChange,
      englishName,
      descriptionName,
      form,
      userProjectList,
      getShowBool,
    };
  },
});
</script>

<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 0;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 110px;
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: #409eff;
  }
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 115px;
  height: 85px;
  line-height: 85px;
  text-align: center;
}
</style>

<style scoped lang="scss">
.info-icon {
  cursor: pointer;
  &:hover {
    &::after {
      content: '建议尺寸200x200，支持png、jpg格式，小于50k';
      position: absolute;
      margin-top: -20px;
      margin-left: -40px;
    }
  }
}
.application-list_content {
  padding: 10px;
}
.dialog-footer {
  display: flex;
  justify-content: center;
}

.application-cards {
  display: flex;
  flex-flow: row wrap;
}

@media screen and (max-width: 1800px) {
  .application-cards {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media screen and (max-width: 1560px) {
  .application-cards {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media screen and (max-width: 1366px) {
  .application-cards {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media screen and (max-width: 1024px) {
  .application-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
