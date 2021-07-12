<template>
  <div>
    <el-row>
      <el-col :span="6" style="text-align: left">
        <el-button type="primary" @click="add" icon="el-icon-plus" style="width: 90px" v-if="getShowBool('add')"
          >新建</el-button
        >
        <el-button @click="groupRemove()" :disabled="disabled" v-if="getShowBool('delete')">删除</el-button>
      </el-col>
      <el-col :offset="8" :span="10" style="text-align: right">
        <el-input
          style="width: 300px"
          placeholder="请输入标签名称"
          suffix-icon="el-icon-search"
          @input="filterTag"
          v-model="filterText"
        ></el-input>
      </el-col>
    </el-row>
    <el-row style="background: #fff">
      <list-wrap
        :in-project="false"
        :loading="loading"
        :empty="!total"
        :handleCreate="add"
        :hasCreateAuth="getShowBool('add')"
      >
        <el-table :data="tagList" @selection-change="handleSelectionChange" @sort-change="sortChange">
          <el-table-column type="selection" width="45" v-if="getShowBool('delete')" />
          <el-table-column type="index" label="序号" width="50" />
          <el-table-column
            v-for="col in columns"
            :key="col.prop"
            :prop="col.prop"
            :label="col.label"
            sortable="custom"
          ></el-table-column>
          <el-table-column
            prop="operation"
            width="220"
            label="操作"
            v-if="getShowBool('update') || getShowBool('delete')"
          >
            <template #default="{ row }">
              <!-- <el-button type="primary" @click="detail(row)" size="mini">详情</el-button> -->
              <!--            <el-button type="primary" @click="disabled(row)" size="mini" v-if="getShowBool('update')">禁用</el-button>-->
              <!-- <el-button type="primary" @click="enabled(row)" size="mini">启用</el-button> -->
              <el-button type="text" @click="rename(row)" size="mini" v-if="getShowBool('update')">编辑</el-button>
              <el-button @click="groupRemove([row.id])" v-if="getShowBool('delete')" type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <packaged-pagination
          v-if="total"
          :current-page="page"
          :page-size="pageSize"
          :total="total"
          @size-change="handlePageSizeChange"
          @current-change="handlePageChange"
        ></packaged-pagination>
      </list-wrap>
    </el-row>
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item
          label="标签名称"
          label-width="80px"
          prop="name"
          :rules="[
            { required: true, message: '内容不能为空', trigger: 'blur' },
            { min: 1, max: 20, message: '内容过长，最多不能超过20个字符', trigger: 'blur' },
          ]"
        >
          <el-input ref="tagName" v-model.trim="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="save()" size="mini" :loading="submitting">确定</el-button>
          <el-button @click="cancel()">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, getCurrentInstance } from 'vue';
import { listTags, addTag, updateTag, deleteTags } from '@/api/settings/tags';
import PackagedPagination from '@/components/pagination/Index.vue';
import _ from 'lodash/fp';
import { ElMessageBox, ElMessage } from 'element-plus';
import { getShowBool } from '@/utils/permission-show-module';

export default defineComponent({
  name: 'Tag',
  components: {
    PackagedPagination,
  },
  setup() {
    // 分页功能
    const page = ref(1);
    const total = ref(0);
    const pageSize = ref(10);
    // 获取组件实例
    const instance = getCurrentInstance();
    // 表格数据
    let sortType: string;
    let sortField: string;
    const tagList = ref([]);
    const filterText = ref('');
    const loading = ref(false);
    const submitting = ref(false);
    const columns = [
      {
        label: '标签名称',
        prop: 'name',
      },
      // {
      //   label: '创建账号',
      //   prop: 'createUser',
      // },
      {
        label: '创建时间',
        prop: 'createTime',
      },
      // {
      //   label: '克隆源',
      //   prop: 'cloneBy',
      // },
    ];
    const format = (num: number): string => {
      if (num < 10) {
        return `0${num}`;
      }
      return num.toString();
    };
    const dateFormat = (timestamp: number | string): string => {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = format(date.getMonth() + 1);
      const day = format(date.getDate());
      const hour = format(date.getHours());
      const minute = format(date.getMinutes());
      const second = format(date.getSeconds());
      return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
    };
    const getTagList = async () => {
      loading.value = true;
      try {
        const { code, data } = await listTags({
          page: page.value,
          pageSize: pageSize.value,
          keyword: filterText.value,
          sortType,
          sortField,
        });
        loading.value = false;
        if (code === 0) {
          total.value = data.count;
          tagList.value = data.rows.map((row: any) => ({
            ...row,
            createTime: dateFormat(row.createTime),
          }));
        }
      } catch (err) {
        loading.value = false;
      }
    };
    const handlePageSizeChange = (size: number) => {
      pageSize.value = size;
      getTagList();
    };
    const handlePageChange = (curPage: number) => {
      page.value = curPage;
      getTagList();
    };
    // 过滤
    const filterTag = _.debounce(500)(getTagList);

    // 排序
    const sortChange = (val: any) => {
      sortType = val.order;
      sortField = val.prop;
      getTagList();
    };

    // 批量删除
    let selection: Array<number> = [];
    const disabled = ref(true);
    const handleSelectionChange = (val: any) => {
      selection = _.map('id')(val);
      disabled.value = !selection.length;
    };
    const groupRemove = async (ids = selection) => {
      ElMessageBox.confirm(`是否删除选中标签?`, '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        loading.value = true;
        const { code } = await deleteTags({ ids });
        loading.value = false;
        if (code === 0) {
          (instance as any).proxy.$message({
            type: 'success',
            message: '删除成功',
          });
          getTagList();
        } else {
          (instance as any).proxy.$message({
            type: 'error',
            message: '删除失败',
          });
        }
      });
    };

    // 编辑弹窗
    const formRef: any = ref(null);
    const tagName = ref(null as any);
    const dialogVisible = ref(false);
    const dialogTitle = ref('');
    const form = ref({
      name: '',
    });
    const rules = {
      name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
    };
    let id = '';
    const rename = (row: any) => {
      form.value.name = row.name;
      dialogVisible.value = true;
      dialogTitle.value = '编辑标签';
      id = row.id;
    };
    const add = () => {
      form.value.name = '';
      dialogVisible.value = true;
      dialogTitle.value = '新增标签';
    };
    const save = () => {
      tagName.value.handleBlur();
      if (submitting.value || form.value.name.length > 25 || form.value.name.length < 1) {
        return;
      }
      submitting.value = true;
      formRef.value.validate(async (isValid: boolean) => {
        if (isValid) {
          loading.value = true;
          const { code } =
            dialogTitle.value === '新增标签'
              ? await addTag({ name: form.value.name })
              : await updateTag({ id, name: form.value.name });
          loading.value = false;
          submitting.value = false;
          if (code === 0) {
            dialogVisible.value = false;
            dialogTitle.value === '新增标签' ? ElMessage.success('新增标签成功') : ElMessage.success('编辑标签成功');
            getTagList();
          }
        }
      });
    };
    const cancel = () => {
      dialogVisible.value = false;
      formRef.value.resetFields();
    };

    onMounted(getTagList);
    return {
      columns,
      page,
      pageSize,
      tagList,
      total,
      handlePageSizeChange,
      handlePageChange,
      getTagList,
      filterText,
      filterTag,
      handleSelectionChange,
      groupRemove,
      dialogVisible,
      dialogTitle,
      form,
      rules,
      rename,
      add,
      save,
      cancel,
      formRef,
      tagName,
      loading,
      sortChange,
      disabled,
      getShowBool,
      submitting,
    };
  },
});
</script>

<style lang="scss" scoped>
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
