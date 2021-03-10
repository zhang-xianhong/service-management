# 含Tag输入框 @author: virgilzhao

## Attributes

| 参数名          | 参数描述       | 示例                        | 数据类型                         | 是否必传 | 默认值        | 备注                                                                                                    |
| --------------- | -------------- | --------------------------- | -------------------------------- | -------- | ------------- | ------------------------------------------------------------------------------------------------------- |
| value/v-model            | 绑定值       | [{value: 1, label: 'tag1'}]     | `Array<object>`                  | true     | -             
| editable | 是否可键盘输入 | true | Boolean | false | false | 配置为true则可以通过输入字符串并按回车新增tag，新tag的label和value均为输入的字符串
| labelKey | tag数据的显示字段 | 'label' | `string` | false | 'label'
| valueKey | tag数据的id字段 | 'value' | `string` | false | 'value'
| disabled | 是否禁用灰化 | false | Boolean | false | false | false