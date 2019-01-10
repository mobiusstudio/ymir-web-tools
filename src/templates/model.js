const modelizeColumns = (items) => {
  const columnArray = []
  items.forEach((item) => {
    const keyMap = ['name', 'type', 'alias', 'foreign', 'def', 'required']
    // eslint-disable-next-line operator-linebreak
    const head = '      new Column({\n'
    const foot = '      }),'
    const codeArray = []
    codeArray.push(head)
    keyMap.forEach((key) => {
      if (item[key]) {
        const value = typeof item[key] === 'string' ? `'${item[key]}'` : item[key]
        codeArray.push(`        ${key}: ${value},\n`)
      }
    })
    codeArray.push(foot)
    const code = codeArray.join('')
    columnArray.push(code)
  })
  return columnArray.join('\n')
}

const modelizeSchema = (schema) => {
  const { schemaName, tableName, items } = schema
  // eslint-disable-next-line operator-linebreak
  const code =
`import { DatabaseTable, Column, ColumnArray } from './core'

export class Task extends DatabaseTable {
  constructor() {
    super('${schemaName}', '${tableName}')
    this.columns = new ColumnArray([
${modelizeColumns(items)}
    ], this.tableName)
  }
}
`
  return code
}

export default modelizeSchema
