<template>
  <el-dialog title="高级设置" v-model="visible" width="640px" :before-close="handleClose">
    <div class="dialog-body">
      <el-form :model="form" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="类型选择" prop="type">
          <template v-if="isEdit">
            <el-radio name="set-date-type" v-model="form.type" :label="1">时间戳格式</el-radio>
            <el-radio name="set-date-type" v-model="form.type" :label="2">时间格式</el-radio>
          </template>
          <span v-else>{{ form.type === 1 ? '时间戳格式' : '时间格式' }}</span>
        </el-form-item>
        <!-- <el-form-item label="格式限制" prop="format" v-if="form.type === 2">
          <template v-slot:label
            >格式限制
            <el-tooltip effect="light" placement="top">
              <i class="el-icon-question info-icon form-item__tooltip_icon"></i>
              <template v-slot:content>
                <div class="date-format-eg">
                  <p>输入时间格式限制，常用字符参考：</p>
                  <ul>
                    <li><code>yyyy</code> 年</li>
                    <li><code>MM</code> 月</li>
                    <li><code>dd</code> 日</li>
                    <li><code>hh</code> 12小时制(1-12)</li>
                    <li><code>HH</code>24小时制（0-23）</li>
                    <li><code>mm</code>分</li>
                    <li><code>ss</code>秒</li>
                    <li><code>S</code>毫秒</li>
                    <li><code>E</code>星期几</li>
                    <li><code>D</code>一年中的第几天</li>
                    <li><code>F</code>一月中的第几个星期（会把这个月总共的天数除以7）</li>
                    <li><code>w</code>一年中的第几个星期</li>
                    <li><code>W</code>一月中的第几星期（会根据实际情况来算）</li>
                    <li><code>a</code>上下午标识符</li>
                    <li><code>k</code>表示一天24小时制(1-24)</li>
                    <li><code>K</code>表示一天12小时制(0-11)</li>
                  </ul>
                </div>
              </template>
            </el-tooltip>
          </template>
          <el-input v-model.trim="form.format" placeholder="请输入格式限制" maxlength="50" :disabled="!isEdit"/>
        </el-form-item> -->
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleSubmit" :loading="submitting" v-if="isEdit">确定</el-button>
        <el-button @click="handleClose">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue';
import Base from './Base';
const { handleSubmit, form, ...baseApi } = Base();
export default defineComponent({
  name: 'DateSettingDialog',
  setup(props, { emit }) {
    const checkFormat = (rule: any, value: any, callback: any) => {
      if (form.type === 2) {
        if (!value) {
          callback(new Error('请输入格式限制'));
          return;
        }
        if (!/[ymdhHmsSEDFwWakK]+/.test(value)) {
          callback(new Error('格式错误，请参考提示'));
        }
      }
      callback();
    };
    const formRules = reactive({
      type: [
        {
          required: true,
          message: '请选择类型',
          trigger: 'blur',
        },
      ],
      format: [{ validator: checkFormat, trigger: 'blur' }],
    });
    return {
      formRules,
      form,
      ...baseApi,
      handleSubmit: () => {
        handleSubmit(emit);
      },
    };
  },
});
</script>
<style lang="scss" scoped>
.date-format-eg {
  ul {
    margin: 10px 0 10px 30px;
    padding: 0;
  }
  li {
    line-height: 20px;
    code {
      display: inline-flex;
      padding: 2px 4px;
      line-height: 16px;
      background-color: #f9f9f9;
      color: red;
      margin-right: 5px;
    }
  }
}
</style>
