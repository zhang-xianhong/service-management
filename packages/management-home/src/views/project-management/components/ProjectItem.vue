<template>
  <div class="project-item">
    <div class="project-item_pic" @click="changePic">
      <div class="pic-alt" v-if="!dataObj.thumbnail && !src" title="点击添加图片">
        <div class="pic-plus"><i class="el-icon-plus"></i></div>
        <div>点击添加图片</div>
      </div>
      <img :src="dataObj.thumbnail || src" alt="图片暂时无法显示" v-else title="点击更换图片" />
    </div>
    <input
      type="file"
      ref="selectPic"
      style="visibility: hidden; width: 0; height: 0; display: none"
      @change="changeSelectPic"
    />
    <div class="project-item_content" @click.stop="jump2detail">
      <div class="project-item_mess flex_flow">
        <span>{{ dataObj.name }}</span>
        <span class="flex_flow_right">
          <span class="cricle-class" :class="{ using: dataObj.status === 1, block: dataObj.status === 0 }"></span>
          <span @click.stop="deleteProject" class="close-project" v-if="deleteOrNot"
            ><i class="el-icon-close"></i
          ></span>
        </span>
      </div>
      <div class="project-item_mess"><label>负责人</label>{{ dataObj.ownerstr }}</div>
      <div class="project-item_mess">
        <label>项目描述</label>
        {{ dataObj.description }}
      </div>
      <div class="project-item_mess">
        <label>项目级别</label>
        {{ levelArr[dataObj.level] }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref } from 'vue';
import { imgUpload, updateProject } from '@/api/project/project';
import Message from 'element-plus/es/el-message';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'ProjectItem',
  props: {
    dataObj: {
      type: Object,
      default: () => ({
        thumbnail: '',
        name: '微领智能建造',
        owner: ['张三'],
        description: 'APP端项目描述',
        level: '平台级',
        status: 'using',
        accessType: '永久',
      }),
    },
    deleteOrNot: {
      type: Boolean,
      default: () => true,
    },
    updateOrNot: {
      type: Boolean,
      default: () => true,
    },
  },
  setup(props, ctx) {
    const selectPic = ref(null as any);
    const src = ref('');
    const changeSelectPic = (res: any) => {
      const { files } = res.target;
      if (files[0].size > 3 * 1024 * 1024) {
        return Message.warning('上传图片不得大于3Mb');
      }
      if (!(files[0].type.includes('jpeg') || files[0].type.includes('png'))) {
        return Message.warning('图片格式必须为png/jpeg');
      }
      const fileReader = new FileReader();
      fileReader.readAsDataURL(files[0]);
      fileReader.onload = (ev: any) => {
        src.value = ev.target.result;
      };
      const formData = new FormData();
      formData.append('file', files[0]);
      imgUpload(formData)
        .then((res) => updateProject(props.dataObj.id, { thumbnail: res.data.fileKey }))
        .then(() => ctx.emit('reload-projects'));
    };
    const changePic = (res: any) => {
      console.log('change picture', res);
      if (props.updateOrNot) {
        selectPic.value.click();
      } else {
        ElMessage.warning('暂无更新权限');
      }
    };

    const levelArr = ['', '通用级', '行业级', '租户级'];
    const deleteProject = () => {
      console.log(props.dataObj.id);
      ctx.emit('deleteProject', props.dataObj.id);
    };
    const { proxy } = getCurrentInstance() as any;

    const jump2detail = () => {
      proxy.$router.push({
        path: `/project-management/project-detail/${props.dataObj.id}`,
      });
    };

    return {
      changePic,
      selectPic,
      changeSelectPic,
      src,
      levelArr,
      deleteProject,
      jump2detail,
    };
  },
});
</script>

<style lang="scss">
.project-item {
  width: 280px;
  height: 310px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  margin: 10px;
  background-color: #fff;
  &:hover {
    box-shadow: 0 0 8px #409eff;
    cursor: pointer;
  }
  &_pic {
    width: 100%;
    height: 170px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
    .pic-alt {
      display: flex;
      height: 100%;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      & > div {
        flex: 1;
        height: 50%;
        display: inline-block;
        position: relative;
      }
      .pic-plus > i {
        position: absolute;
        bottom: 10px;
        left: -5px;
      }
    }
    img {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  }
  &_content {
    width: 100%;
    padding: 10px;
    .flex_flow {
      display: flex;
      flex-direction: row;
      & > span,
      & > div {
        flex: 1;
        display: inline-block;
        vertical-align: center;
      }
      .flex_flow_right {
        text-align: right;
      }
    }
    .project-item_mess {
      font-size: 14px;
      margin-top: 8px;
      padding-left: 5px;
      padding-right: 5px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      label {
        opacity: 0.7;
        display: inline-block;
        width: 65px;
      }
    }
  }
  .cricle-class {
    width: 10px;
    height: 10px;
    display: inline-block;
    border-radius: 50%;
    background-color: #0abf5b;
    margin-right: 10px;
  }
  .using {
    background-color: #0abf5b;
  }
  .block {
    background-color: #ff9d00;
  }
  .close-project:hover {
    color: #409eff;
  }
}
</style>
