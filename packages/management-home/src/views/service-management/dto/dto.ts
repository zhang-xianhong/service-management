import { ref } from 'vue';

export type DataType = 'string' | 'int' | 'float' | 'date' | 'boolean' | 'array' | 'object';

export const enum DtoType {
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
  serviceId: string;
  apiId: string;
  enName: string;
  zhName?: string;
  serverName: string;
  rootId: number;
  dtoType: DtoType;
  list: DtoProperties[];
}

export interface DtoProperties {
  _id: string;
  name?: string;
  type?: DataType;
  required?: number;
  example?: any;
  desc?: string;
  config?: Config;
  dtoId?: number;
  propertyOrder?: string;
  collectionType?: CollectionType;
  children?: DtoProperties[];
}
export type UpdateDtoProperties = Partial<DtoProperties>;

export interface Config {
  [key: string]: any;
}

export const enum EditMode {
  Create = 1,
  Update,
}

export const EMPTY_DTO: DtoModel = {
  enName: '',
  list: [],
  serviceId: '',
  apiId: '',
  serverName: '',
  rootId: 0,
  dtoType: DtoType.NestedDTO,
};

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

  const currentDto = ref<DtoModel>(); // update or create current DtoModel

  const { openDialog, closeDialog, showDialog } = useDialog(); // diaglog controller

  const setCurrentMode = (mode: EditMode) => {
    editMode.value = mode;
  };

  const setModelData = (data: DtoModel) => {
    currentDto.value = data;
  };

  const onConfirm = () => {
    closeDialog();
  };

  const onCancle = () => {
    closeDialog();
  };

  const initEdit = (mode: EditMode, data?: DtoModel) => {
    setCurrentMode(mode);
    openDialog();
    setModelData(data ?? EMPTY_DTO);
  };

  return {
    currentDto,
    showDialog,
    initEdit,
    openDialog,
    onCancle,
    onConfirm,
  };
};
