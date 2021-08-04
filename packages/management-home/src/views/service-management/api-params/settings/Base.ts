import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';

export default () => {
  const visible = ref(false);
  const submitting = ref(false);
  const formRef = ref(null as any);
  const source = ref(null as any);
  const form = reactive({} as any);
  const isEdit = ref(true);

  const handleClose = () => {
    visible.value = false;
    formRef.value.resetFields();
  };

  const handleOpen = (row: any, editing: boolean) => {
    isEdit.value = editing;
    source.value = row;
    visible.value = true;
    submitting.value = false;
    const { config = {} } = row;
    Object.keys(config).forEach((field) => (form[field] = config[field]));
  };

  const handleSubmit = async (emit: any) => {
    try {
      submitting.value = true;
      const valid = await formRef.value.validate();
      if (!valid) {
        return;
      }
      emit('change', {
        id: source.value.$id,
        config: form,
      });
      ElMessage.success('设置成功');
      handleClose();
    } catch (e) {
      console.log(e);
    } finally {
      submitting.value = false;
    }
  };
  return {
    visible,
    submitting,
    formRef,
    form,
    isEdit,
    source,
    handleClose,
    handleOpen,
    handleSubmit,
  };
};
