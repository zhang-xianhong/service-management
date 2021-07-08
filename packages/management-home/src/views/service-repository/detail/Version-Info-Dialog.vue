<template>
  <el-dialog title="版本信息" v-model="visible" width="60%" :before-close="handleClose">
    <div class="version-info-wrapper" v-loading="loading">
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="基本信息" name="base">
          <div class="content-wrap" v-if="snapshot && !loading">
            <p>版本号：{{ snapshot.serviceVersion }}</p>
            <p>版本描述：{{ snapshot.description }}</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="配置项" name="config">
          <div class="content-wrap" v-if="snapshot && !loading">
            <list-wrap
              :loading="false"
              :inProject="false"
              :empty="snapshot.configTemplates.length === 0"
              :hasCreateAuth="false"
            >
              <el-table :data="snapshot.configTemplates" style="width: 100%">
                <el-table-column label="序号" type="index"> </el-table-column>
                <!-- <el-table-column prop="origin" label="配置来源"></el-table-column> -->
                <el-table-column prop="name" label="键">
                  <template #default="scope">
                    {{ scope.row.name }}
                  </template>
                </el-table-column>
                <el-table-column prop="value" label="默认值">
                  <template #default="scope">
                    {{ scope.row.value }}
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="url" label="类型"> </el-table-column> -->
              </el-table>
            </list-wrap>
          </div>
        </el-tab-pane>
        <el-tab-pane label="数据库升级脚本" name="sqlStructure">
          <div class="content-wrap" v-if="snapshot && !loading">
            <pre v-highlight>
              <code v-html="formatSql(snapshot.ddlScript)" class="sql"></code>
            </pre>
            <div class="empty" v-if="!snapshot?.ddlScript?.trim()">暂无数据...</div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="数据库预置数据" name="sqlData">
          <div class="content-wrap" v-if="snapshot && !loading">
            <pre v-highlight>
              <code v-html="formatSql(snapshot.dmlScript)" class="sql"></code>
            </pre>
            <div class="empty" v-if="!snapshot?.dmlScript?.trim()">暂无数据...</div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { getSnapshotInfo } from '@/api/repository';
export default defineComponent({
  name: 'VersionInfoDialog',
  components: {},
  setup() {
    const visible = ref(false);
    const serviceDependRef = ref(null as any);
    const activeTab = ref('base');
    const snapshot = ref(null as any);
    const loading = ref(true);
    const fetchData = async (snapshotNo: string) => {
      loading.value = true;
      try {
        const { data } = await getSnapshotInfo({
          snapshotNo,
        });
        snapshot.value = data;
      } catch (e) {
        console.log(e);
      } finally {
        loading.value = false;
      }
    };
    const handleClose = () => {
      visible.value = false;
    };
    const handleOpen = (snapshotNo: string) => {
      visible.value = true;
      fetchData(snapshotNo);
    };
    const formatSql = (sql: string) => sql.replace(/\n/gm, '<br/>').replace(/\t/gm, '&nbsp;&nbsp;&nbsp;&nbsp;');
    return {
      visible,
      handleOpen,
      handleClose,
      serviceDependRef,
      activeTab,
      snapshot,
      loading,
      formatSql,
    };
  },
});
</script>
<style lang="scss" scoped>
.version-info-wrapper {
  width: 100%;
  overflow: hidden;
  ::v-deep .el-tabs__header {
    margin: 0;
    .el-tabs__nav {
      padding-left: 0;
      padding-right: 0;
      border-radius: 0 !important;
    }
  }
  ::v-deep .el-tabs__content {
    margin: 0;
    border: 1px solid #dedede;
    border-top: none;
    height: 500px;
  }

  .content-wrap {
    height: 100%;
    padding: 20px;
    overflow-y: auto;
    > pre {
      margin: -20px 0;
      padding: 0;
      font-size: 13px;
    }

    .empty {
      padding: 50px;
      text-align: center;
    }
  }
}
</style>
