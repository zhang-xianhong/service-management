import {
  getTraceAndLog,
  getSqlData,
  startServiceData,
  stopServiceData,
} from '@/views/service-management/business-service/utils/service-detail-data';
import { ref } from 'vue';

import { ElMessageBox } from 'element-plus';
import Message from 'element-plus/es/el-message';

export default function() {
  const buttons = ref([] as any);
  // 初始化
  const initialize = () => {
    const name = buttons.value[0].label;
    ElMessageBox.confirm(`确定${name}此服务, 是否继续?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => getSqlData())
      .catch(() => {
        Message({
          type: 'info',
          message: '已取消操作',
        });
      });
  };
  // 启动
  const start = () => {
    console.log('启动');
    ElMessageBox.confirm(`请确认此服务已初始化, 是否继续?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => startServiceData())
      .catch(() => {
        Message({
          type: 'info',
          message: '已取消操作',
        });
      });
  };

  // const build = () => {
  //   console.log('构建');
  //   buildServiceData().then((res) => {
  //     logSetTimeOut('sa-operator-adapter', res.data.traceId);
  //   });
  // };

  // 停止
  const stop = () => {
    ElMessageBox.confirm(`请确认停止此服务, 是否继续?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => stopServiceData())
      .catch(() => {
        Message({
          type: 'info',
          message: '已取消操作',
        });
      });
  };

  // 发布
  // const publish = () => {
  //   console.log('发布');
  // };

  // 日志
  const log = () => {
    console.log('日志');
    getTraceAndLog();
  };

  // 按钮配置
  buttons.value = [
    {
      label: '初始化',
      type: 'primary',
      eventOption: {
        click: () => initialize(),
      },
      disabled: false,
    },
    // {
    //   label: '构建',
    //   eventOption: {
    //     click: () => build(),
    //   },
    // },
    {
      label: '启动',
      eventOption: {
        click: () => start(),
      },
      disabled: false,
    },
    {
      label: '停止',
      eventOption: {
        click: () => stop(),
      },
      disabled: false,
      style: 'margin-left: 5px',
    },
    // {
    //   label: '发布',
    //   eventOption: {
    //     click: () => publish(),
    //   },
    //   disabled: false,
    // },
    {
      label: '日志',
      eventOption: {
        click: () => log(),
      },
      disabled: false,
      style: 'margin-left: 5px',
    },
  ];

  return {
    buttons,
  };
}
