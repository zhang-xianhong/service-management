import { dtoModelAPI } from '@/api/servers';
import { ElMessage } from 'element-plus';
import { computed, InjectionKey, ref } from 'vue';

export type DataType = 'String' | 'Int32' | 'Int64' | 'Float' | 'Double' | 'Date' | 'Boolean' | 'Array' | 'Object';

export interface DtoApiParams {
  serviceId: string;
  uniqueId: string;
}
export const enum DtoType {
  RequestDTO = 1,
  ResponseDTO,
  SharedDTO,
  NestedDTO, //
}
export const enum DtoModelDtoType {
  RequestDTO = 1,
  ResponseDTO,
  SharedDTO,
  NestedDTO,
}
export const enum CollectionType {
  Primitive = 1,
  List,
  Array,
  Set,
}
export interface DtoModel {
  serviceId: number;
  apiId: number;
  name: string;
  zhName: string;
  uniqueId: string;
  rootId: number;
  dtoType: DtoType;
  list: DtoProperties[];
}
export type CreatDtoModel = Omit<DtoModel, 'uniqueId' | 'rootId'>;

export interface DtoProperties {
  uniqueId: string;
  name: string;
  type: DataType;
  required: number;
  example: any;
  desc: string;
  config: Config;
  dtoId: number;
  propertyOrder: string;
  collectionType: CollectionType;
  children: DtoProperties[];
}
export type UpdateDtoProperties = Partial<DtoProperties>;

export interface Config {
  [key: string]: any;
}

export const enum EditMode {
  Create = 1,
  Update,
}

export const EMPTY_DTO: CreatDtoModel = {
  name: '',
  list: [],
  zhName: '',
  serviceId: 0,
  apiId: 0,
  dtoType: DtoType.RequestDTO,
};
export type CreatOrUpdateDtoModel = DtoModel | CreatDtoModel;

export const useDialog = () => {
  const showDialog = ref<boolean>(false);
  const openDialog = () => {
    showDialog.value = true;
  };

  const closeDialog = () => {
    showDialog.value = false;
  };
  return { openDialog, closeDialog, showDialog };
};

export const useEditDtoDialog = () => {
  const editMode = ref<EditMode>();

  const currentDto = ref<CreatOrUpdateDtoModel>(EMPTY_DTO); // update or create current DtoModel

  const { openDialog, closeDialog, showDialog } = useDialog(); // diaglog controller

  const setCurrentMode = (mode: EditMode) => {
    editMode.value = mode;
  };

  const setModelData = (data: CreatOrUpdateDtoModel) => {
    currentDto.value = data;
  };

  const initEdit = (mode: EditMode, data: CreatOrUpdateDtoModel) => {
    setCurrentMode(mode);
    openDialog();
    setModelData(data);
  };

  const syncDtoData = () => {
    if (editMode.value === EditMode.Create) {
      return dtoModelAPI.create(currentDto.value);
    }
    return dtoModelAPI.update(currentDto.value as DtoModel);
  };

  return {
    currentDto,
    showDialog,
    initEdit,
    setDtoModel: setModelData,
    openDialog,
    closeDialog,
    syncDtoData,
  };
};
// ----------------------------------------

const dtoList = ref<DtoModel[]>();

export const useDtoList = () => {
  const loading = ref<boolean>(false);

  const setDtoList = (data: DtoModel[]) => {
    dtoList.value = data;
  };
  const fetchDtoList = async (serviceId: string) => {
    loading.value = true;
    try {
      const { data, code } = await dtoModelAPI.findAll(serviceId);
      loading.value = false;

      if (code === 0) {
        setDtoList(data);
      }
    } catch (error) {
      loading.value = false;
      console.log(error);
    }
  };

  const removeDto = async (params: DtoApiParams) => {
    loading.value = true;
    const { serviceId } = params;
    try {
      const { code } = await dtoModelAPI.remove(params);
      loading.value = false;

      if (code === 0) {
        // updatelist
        ElMessage.success('删除成功');
        fetchDtoList(serviceId);
      }
    } catch (error) {
      loading.value = false;
      console.log(error);
    }
  };
  return {
    fetchDtoList,
    setDtoList,
    loading: computed(() => loading.value),
    dtoList: computed(() => dtoList.value),
    removeDto,
  };
};

export const dtoUniqueId: InjectionKey<string> = Symbol('dtoid');
