<template>
  <div>
    <el-dialog v-model="showDtoList">
      <el-button type="primary" @click="editDtoModel()" class="create-dto__bth">新建</el-button>
      <el-table :data="tableData" max-height="400" @selection-change="handleSelectionChange">
        <el-table-column type="selection" label="序号"></el-table-column>
        <el-table-column prop="name" label="模型英文名">
          <template #default="scope">
            {{ scope.row.enName }}
          </template>
        </el-table-column>
        <el-table-column prop="chineseName" label="模型中文名">
          <template #default="scope">
            {{ scope.row.zhName }}
          </template>
        </el-table-column>
        <el-table-column prop="service" label="服务">
          <template #default="scope">
            {{ scope.row.serverName }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button @click="editDtoModel(scope.row)" type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDtoList">取 消</el-button>
          <el-button type="primary" @click="onConfirmSelect">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 新建Dto modal -->
    <el-dialog title="新建DTO模型" v-model="showEditDto" width="50%">
      <edit-dto-model @selectDto="onSelectedDto" :dto-data="currentDto" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancle">取 消</el-button>
          <el-button type="primary" @click="onConfirm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { ref } from '@vue/reactivity';
import { DtoModel, DtoType, useEditDtoDialog, EditMode, useDialog } from './dto';
import { computed, defineComponent, onBeforeMount, onMounted } from '@vue/runtime-core';
import { TreeNodeData } from 'element-plus/lib/el-tree/src/tree.type';
import EditDtoModel from './EditDtoModel.vue';
export default defineComponent({
  name: 'DtoList',
  components: {
    EditDtoModel,
  },
  emits: ['on-confirm'],
  setup(props, ctx) {
    const tableData = ref<DtoModel[]>([]);
    onBeforeMount(() => {
      const data = [
        {
          serviceId: '1',
          apiId: '112',
          rootId: 1,
          dtoType: DtoType.RequestDTO,
          zhName: '创建列表1',
          enName: 'creat_list1',
          serverName: 'service-1',
          list: [
            {
              name: 'key_1',
              type: 'object',
              desc: '这是一个对象',
              dtoId: 12,
              _id: '12',
              children: [
                {
                  name: 'key_1_1',
                  type: 'string',
                  required: 1,
                  dtoId: 121,
                  _id: '121',
                  example: 'some string',
                  desc: 'some descriptions',
                  config: {
                    type: 'String',
                    maxLength: 256,
                  },
                },
                {
                  name: 'key_1_2',
                  type: 'object',
                  dtoId: 122,
                  _id: '122',
                  desc: '这是一个nest对象',
                  children: [
                    {
                      name: 'key_1_2_1',
                      type: 'string',
                      required: 1,
                      dtoId: 1221,
                      _id: '1221',
                      example: 'some string',
                      desc: 'some descriptions',
                      config: {
                        type: 'String',
                        maxLength: 256,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          serviceId: '2',
          apiId: '112',
          rootId: 2,
          dtoType: DtoType.RequestDTO,
          zhName: '创建列表1',
          enName: 'creat_list1',
          serverName: 'service-1',
          list: [
            {
              name: 'key_1',
              type: 'object',
              desc: '这是一个对象',
              dtoId: 22,
              _id: '22',
              children: [
                {
                  name: 'key_1_1',
                  type: 'string',
                  required: 1,
                  dtoId: 121,
                  _id: '221',
                  example: 'some string',
                  desc: 'some descriptions',
                  config: {
                    type: 'String',
                    maxLength: 256,
                  },
                },
                {
                  name: 'key_1_2',
                  type: 'object',
                  dtoId: 222,
                  _id: '222',
                  desc: '这是一个nest对象',
                  children: [
                    {
                      name: 'key_1_2_1',
                      type: 'string',
                      required: 1,
                      dtoId: 2221,
                      _id: '2221',
                      example: 'some string',
                      desc: 'some descriptions',
                      config: {
                        type: 'String',
                        maxLength: 256,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];
      tableData.value = data as any;
    });

    const { currentDto, showDialog: showEditDto, initEdit, onConfirm, onCancle } = useEditDtoDialog();

    const { showDialog: showDtoList, openDialog: openDtoList, closeDialog: closeDtoList } = useDialog();

    const selectedID = ref<number[]>(); // hold ids of mutilple select

    const editDtoModel = (data?: DtoModel) => {
      if (data) {
        // update
        initEdit(EditMode.Update, data);
      } else {
        // create
        initEdit(EditMode.Create);
      }
    };

    const onSelectedDto = (nodes: TreeNodeData[] | undefined) => {
      console.log('selected', nodes);
    };

    const handleSelectionChange = (selectionRows: DtoModel[]) => {
      selectedID.value = selectionRows.map((e) => e.rootId);
    };
    onMounted(() => {
      openDtoList();
    });

    const selecttions = computed(() =>
      tableData.value.filter((e) => selectedID.value?.includes(e.rootId)).map((e) => e.list),
    );

    const getSelection = () => selecttions;

    const onConfirmSelect = () => {
      ctx.emit('on-confirm', selecttions.value);
      console.log(selecttions.value);
    };
    return {
      tableData,
      currentDto,
      showEditDto,
      showDtoList,
      openDtoList,
      closeDtoList,
      onConfirm,
      onCancle,
      editDtoModel,
      onSelectedDto,
      handleSelectionChange,
      getSelection,
      onConfirmSelect,
    };
  },
});
</script>

<style scoped>
.create-dto__bth {
  margin-bottom: 1em;
}
</style>
