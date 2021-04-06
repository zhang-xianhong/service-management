<template>
  <div class="project-item">
    <div class="project-item_pic" @click="changePic">
      <div class="pic-alt" v-if="!dataObj.thumbnail && !src" title="点击添加图片">
        <div class="pic-plus"><i class="el-icon-plus"></i></div>
        <div>点击添加图片</div>
      </div>
      <img :src="dataObj.thumbnail || src" alt="替换图片" v-else title="点击更换图片" />
    </div>
    <input
      type="file"
      ref="selectPic"
      style="visibility: hidden;width: 0;height: 0; display: none"
      @change="changeSelectPic"
    />
    <div class="project-item_content" @click.stop="jump2detail">
      <div class="project-item_mess flex_flow">
        <span>{{ dataObj.name }}</span>
        <span class="flex_flow_right">
          <span class="cricle-class" :class="{ using: dataObj.status === 1, block: dataObj.status === 0 }"></span>
          <span @click.stop="deleteProject"><i class="el-icon-close"></i></span>
        </span>
      </div>
      <div class="project-item_mess">
        <label>负责人</label>
        {{ dataObj.owner }}
      </div>
      <div class="project-item_mess">
        <label>项目描述</label>
        {{ dataObj.description }}
      </div>
      <div class="project-item_mess">
        <label>项目级别</label>
        {{ levelArr[dataObj.level] }}
      </div>
      <div class="project-item_mess">
        <label>许可类型</label>
        {{ dataObj.accessType }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref } from 'vue';

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
  },
  setup(props, ctx) {
    const selectPic = ref(null as any);
    const src = ref('');
    const changeSelectPic = (res: any) => {
      const { files } = res.target;
      const fileReader = new FileReader();
      fileReader.readAsDataURL(files[0]);
      fileReader.onload = (ev: any) => {
        const ress = ev.target.result;
        src.value = ress;
        console.log(ress);
      };
      console.log(files);
    };
    const changePic = (res: any) => {
      console.log('change picture', res);
      selectPic.value.click();
    };

    const levelArr = ['统一', '行业', '租户'];
    const deleteProject = () => {
      console.log(props.dataObj.id);
      ctx.emit('deleteProject', props.dataObj.id);
    };
    const { proxy } = getCurrentInstance() as any;

    const jump2detail = () => {
      proxy.$router.push({
        path: `/project-management/project-detail/${props.dataObj.id}`,
        query: { detailName: props.dataObj.name },
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
  width: 300px;
  height: 340px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  margin: 10px;
  &:hover {
    box-shadow: 0 0 8px #409eff;
  }
  &_pic {
    width: 100%;
    height: 170px;
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
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
    background-color: yellow;
  }
}
</style>
