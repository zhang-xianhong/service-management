<template>
  <div class="business-edit-timeline">
    <el-timeline>
      <el-timeline-item v-for="change in changeTimeline" :key="change.$index" :timestamp="change.time" placement="top">
        <template #dot>
          <i class="el-icon-video-camera" v-if="change.type === 'change'"></i>
          <i class="el-icon-smoking" v-if="change.type === 'commit'"></i>
          <i class="el-icon-truck" v-if="change.type === 'publish'"></i>
        </template>
        <el-card>
          <h4>{{ change.header }}</h4>
          <p>{{ change.message }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { changes, ChangeRecord } from './form-data';
export default defineComponent({
  name: 'BusinessEditTimeline',
  setup() {
    const changeTimeline = changes.value.map((record: ChangeRecord) => ({
      header: ['模型变更', '代码变更', '版本发布'][['change', 'commit', 'publish'].indexOf(record.type)],
      ...record,
    }));
    return {
      changeTimeline,
    };
  },
});
</script>
