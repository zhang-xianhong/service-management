import { logSetTimeOut } from './service-log-data-utils';
import { ref } from 'vue';
import { getSqlData, startServiceData } from '@/views/service-management/business-service/utils/service-detail-data';

export default function() {
  // 初始化
  const initialize = () => {
    console.log('初始化');
    getSqlData();
  };
  // 启动
  const start = () => {
    console.log('启动');
    startServiceData();
  };

  // const build = () => {
  //   console.log('构建');
  //   buildServiceData().then((res) => {
  //     logSetTimeOut('sa-operator-adapter', res.data.traceId);
  //   });
  // };

  // 停止
  const stop = () => {
    console.log('停止');
  };

  // 发布
  // const publish = () => {
  //   console.log('发布');
  // };

  // 日志
  const log = () => {
    console.log('日志');
    logSetTimeOut();
  };

  // 按钮配置
  const buttons = ref([
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
    },
  ]);

  return {
    buttons,
  };
}
