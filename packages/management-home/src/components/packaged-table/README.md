# 封装表格 @author: kyleezhang

## Table Attributes

| 参数名          | 参数描述       | 示例                        | 数据类型                         | 是否必传 | 默认值        | 备注                                                                                                    |
| --------------- | -------------- | --------------------------- | -------------------------------- | -------- | ------------- | ------------------------------------------------------------------------------------------------------- |
| data            | 表格内容       | [{name: 'aidentao'...}]     | `Array<object>`                  | true     | -             |                                                                                                         |
| width           | 表格宽度       | 200                         | number/string                    | false    | '100%'        |                                                                                                         |
| height          | 表格高度       | 200                         | number/string                    | false    | 自动高度      | 固定表头必须指定具体高度                                                                                |
| max-height      | 最大高度       | 600                         | number/string                    | false    |               |                                                                                                         |
| selection       | 表单勾选项     | [0, 1, 2]                   | `Array<number>`                  | false    | []            | 表格内容的索引数组， 传入后会触发 check 事件                                                            |
| style           | 表单样式       | "width: 100%, color: 'red'" | string                           | false    | "width: 100%" |
| isSelectAble    | 是否显示勾选框 | true                        | boolean                          | false    | true          | 勾选框位置是固定的                                                                                      |
| isShowIndex     | 是否显示序号列 | true                        | boolean                          | false    | true          | 序号列的位置也是固定的                                                                                  |
| isShowOperation | 是否显示操作栏 | true                        | boolean                          | false    | true          | 如果选择显示需传入 operations 来生成具体的操作项，否则显示空白                                          |
| columns         | 表格列配置     | []                          | `Array<TableColumnInterface>`    | false    | []            | types 文件夹下提供了 TableColumnInterface 接口，可按照接口传参，也支持通过插槽高度自定义                |
| operations      | 表格操作栏配置 | []                          | `Array<TableOperationInterface>` | false    | []            | types 文件夹下提供了 TableOperationInterface 接口，可按照接口传参，目前暂不支持通过插槽自定义，后续扩充 |

其他参数与[element-plus ElTable 组件的 Table Attributes](https://element-plus.gitee.io/#/zh-CN/component/table)保持一致。

## Table Column Attributes

| 参数名        | 参数描述                                     | 示例                                  | 数据类型        | 是否必传 | 默认值 | 备注                                                                              |
| ------------- | -------------------------------------------- | ------------------------------------- | --------------- | -------- | ------ | --------------------------------------------------------------------------------- |
| prop          | 对应列内容的字段名                           | 'name'                                | string          | true     | ''     |                                                                                   |
| label         | 对应列的标题                                 | '姓名'                                | string          | true     | ''     |                                                                                   |
| width         | 对应列的宽度                                 | 200                                   | number/string   | false    | 自适应 |                                                                                   |
| isDefault     | 是否按照默认规则显示，即只显示具体列内容字段 | false                                 | boolean         | false    | true   | 如果想要通过插槽自定义列内容必须将该属性设为 false                                |
| isButton      | 列内容是否为按钮                             | false                                 | boolean         | false    | false  | 该属性只能标识列内容是否为按钮，按钮内容的具体配置需要通过 buttonOptions 选项说明 |
| buttonOptions | 按钮选项配置                                 | `[{ name: 'delete', label: '删除' }]` | `Array<object>` | false    | []     | 解析配置生成具体列内容按钮                                                        |

其他参数与[element-plus ElTable 组件的 Table Columns Attributes](https://element-plus.gitee.io/#/zh-CN/component/table)保持一致。

## Button Options

| 参数名                      | 参数描述           | 示例     | 数据类型                          | 是否必传 | 默认值  | 备注                                                           |
| --------------------------- | ------------------ | -------- | --------------------------------- | -------- | ------- | -------------------------------------------------------------- |
| name                        | 按钮标识           | 'delete' | string                            | false    | -       | 如果未传入 eventName 字段按钮事件触发 emit "{trigger}: {name}" |
| label ｜ 按钮内容 ｜ '删除' | string             | false    | ''                                |          |
| trigger                     | 事件触发钩子       | 'click'  | 'hover'/'click'/'dbclick'/'focus' | false    | 'click' |
| eventName                   | 自定义返回事件名称 | 'change' | string                            | false    | -       | eventName 与 name 必须至少传一个，否则按钮事件无法 emit        |

其他参数与[element-plus ElButton 组件的 Attributes](https://element-plus.gitee.io/#/zh-CN/component/button)保持一致。

## Table Event

| 方法名           | 说明                         | 参数                  | 备注                                   |
| ---------------- | ---------------------------- | --------------------- | -------------------------------------- |
| {eventName}      | 用户为表格内按钮自定义的事件 | `{ [prop], rowData }` | 注意操作栏的按钮触发事件没有[prop]字段 |
| {trigger}:{name} | 表格内列内容按钮触发事件     | `{ [prop], rowData }` | 注意操作栏的按钮触发事件没有[prop]字段 |

其他事件与[element-plus ElTable 组件的 Methods](https://element-plus.gitee.io/#/zh-CN/component/button)保持一致。
