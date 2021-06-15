<template>
  <div>
    <el-row>
      <el-col :span="6" style="text-align: left">
        <el-button type="primary" @click="add" style="width: 90px" v-if="getShowBool('add')">新增</el-button>
        <el-button @click="groupRemove()" :disabled="disabled" v-if="getShowBool('delete')">删除</el-button>
      </el-col>
      <el-col :offset="8" :span="10" style="text-align: right">
        <el-input
          style="width: 500px"
          placeholder="请输入标签名称"
          suffix-icon="el-icon-search"
          @input="filterTag"
          v-model="filterText"
        ></el-input>
      </el-col>
    </el-row>
    <el-row style="background: #fff">
      <el-table :data="tagList" @selection-change="handleSelectionChange" @sort-change="sortChange" v-loading="loading">
        <el-table-column type="selection" width="45" />
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column
          v-for="col in columns"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
          sortable="custom"
        ></el-table-column>
        <el-table-column prop="operation" width="220" label="操作">
          <template #default="{ row }">
            <!-- <el-button type="primary" @click="detail(row)" size="mini">详情</el-button> -->
            <!--            <el-button type="primary" @click="disabled(row)" size="mini" v-if="getShowBool('update')">禁用</el-button>-->
            <!-- <el-button type="primary" @click="enabled(row)" size="mini">启用</el-button> -->
            <el-button type="primary" @click="rename(row)" size="mini" v-if="getShowBool('update')">修改</el-button>
            <el-button @click="groupRemove([row.id])" v-if="getShowBool('delete')">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <packaged-pagination
        v-if="total"
        :current-page="page"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        layout="sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handlePageSizeChange"
        @current-change="handlePageChange"
      ></packaged-pagination>
    </el-row>
    <el-dialog :title="dialogTitle" v-model="dialogVisible">
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item
          label="标签名称"
          :label-width="80"
          prop="name"
          :rules="[{ min: 1, max: 25, message: '内容过长，最多不能超过25个字符', trigger: 'blur' }]"
        >
          <el-input v-model.trim="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="save()" size="mini">确认</el-button>
        <el-button @click="cancel()">取消</el-button>
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
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
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
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消操作',
          });
        });
    };

    // 编辑弹窗
    const formRef: any = ref(null);
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
      dialogTitle.value = '修改标签';
      id = row.id;
    };
    const add = () => {
      form.value.name = '';
      dialogVisible.value = true;
      dialogTitle.value = '新增标签';
    };
    const save = () => {
      if (form.value.name.length > 25) {
        return false;
      }
      formRef.value.validate(async (isValid: boolean) => {
        if (isValid) {
          loading.value = true;
          const { code } =
            dialogTitle.value === '新增标签'
              ? await addTag({ name: form.value.name })
              : await updateTag({ id, name: form.value.name });
          loading.value = false;
          if (code === 0) {
            dialogVisible.value = false;
            getTagList();
          }
        }
      });
    };
    const cancel = () => {
      dialogVisible.value = false;
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
      loading,
      sortChange,
      disabled,
      getShowBool,
    };
  },
});
</script>

<style lang="sass" scoped></style>
