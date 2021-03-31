import { logSetTimeOut } from './service-log-data-utils';
import { buildServiceData } from './service-detail-data';

export default function() {
  // 初始化
  const initialize = () => {
    console.log('初始化');
  };

  // 启动
  const start = () => {
    console.log('启动');
  };

  const build = () => {
    console.log('构建');
    buildServiceData().then((res) => {
      logSetTimeOut('sa-operator-adapter', res.data.traceId);
    });
  };

  // 停止
  const stop = () => {
    console.log('停止');
  };

  // 发布
  const publish = () => {
    console.log('发布');
  };

  // 日志
  const log = () => {
    console.log('日志');
    logSetTimeOut();
  };

  // 按钮配置
  const buttons = [
    {
      label: '初始化',
      type: 'primary',
      eventOption: {
        click: () => initialize(),
      },
    },
    {
      label: '构建',
      eventOption: {
        click: () => build(),
      },
    },
    {
      label: '启动',
      eventOption: {
        click: () => start(),
      },
    },
    {
      label: '停止',
      eventOption: {
        click: () => stop(),
      },
    },
    {
      label: '发布',
      eventOption: {
        click: () => publish(),
      },
    },
    {
      label: '日志',
      eventOption: {
        click: () => log(),
      },
    },
  ];

  return {
    buttons,
  };
}
