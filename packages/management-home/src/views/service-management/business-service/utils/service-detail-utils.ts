import {
  getTraceAndLog,
  getSqlData,
  startServiceData,
  stopServiceData,
  releaseServiceData,
  checkBeforeStart,
} from '@/views/service-management/business-service/utils/service-detail-data';
import { ref } from 'vue';

import { ElMessageBox } from 'element-plus';

export default function () {
  const buttons = ref([] as any);
  // 初始化
  const initialize = () => {
    const name = buttons.value[0].label;
    ElMessageBox.confirm(`确定${name}此服务, 是否继续?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => getSqlData());
  };
  // 启动
  const start = async () => {
    const { code, data } = (await checkBeforeStart()) as any;
    console.log('启动');
    console.log(code, data, 1234567, code === 0 && data === 'ok');
    const message = code === 0 && data === 'ok' ? '请确认此服务已初始化, 是否继续?' : data;
    ElMessageBox.confirm(message, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => startServiceData());
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
    }).then(() => stopServiceData());
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

  // 发版
  const release = () => {
    console.log('发版');
    releaseServiceData();
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
      label: '发版',
      eventOption: {
        click: () => release(),
      },
      disabled: false,
      style: 'margin-left: 5px',
    },
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
