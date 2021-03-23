export interface Tree {
  id: number
  name: string
  description: string
  children: Tree[]
  [prop: string]: any
}
