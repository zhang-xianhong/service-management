import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'HeighLihght',
  props: {
    dataObj: {
      type: Object,
      default: () => ({
        position: 'head',
        dataArray: [''],
      }),
    },
  },
  setup(props) {
    const position = ref(props.dataObj.position);
    const dataArray = ref(props.dataObj.dataArray);
    const logs = (res: any) => {
      console.log(res, 'this is log');
      return res;
    };
    watch(
      () => props.dataObj,
      (nn) => {
        position.value = nn.position;
        dataArray.value = nn.dataArray;
      },
    );
    switch (position.value) {
      case 'head':
        return () => (
          <div>
            {logs(dataArray.value[0])}
            <h2>{logs(dataArray.value[1])}</h2>
          </div>
        );
      case 'middle':
        return () => (
          <div>
            {dataArray.value[0]}
            <span style="background: 'yellow'">{dataArray.value[1]}</span>
            {dataArray.value[2]}
          </div>
        );
      case 'tail':
        return () => (
          <div>
            {dataArray.value[0]}
            <span style="background: 'yellow'">{dataArray.value[1]}</span>
          </div>
        );
      default:
        return () => <div>{props.dataObj.dataArray[0]}</div>;
    }
  },
});
