const modelizeColumns = (columns) => {
  const columnArray = []
  columns.forEach((column) => {
    const keyMap = ['name', 'type', 'alias', 'foreign', 'def', 'required']
    // eslint-disable-next-line operator-linebreak
    const head = '      new Column({\n'
    const foot = '      }),'
    const codeArray = []
    codeArray.push(head)
    keyMap.forEach((key) => {
      if (column[key]) {
        const value = typeof column[key] === 'string' ? `'${column[key]}'` : column[key]
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
  const { schemaName, tableName, columns } = schema
  // eslint-disable-next-line operator-linebreak
  const code =
`import { DatabaseTable, Column, ColumnArray } from './core'

export class Task extends DatabaseTable {
  constructor() {
    super('${schemaName}', '${tableName}')
    this.columns = new ColumnArray([
${modelizeColumns(columns)}
    ], this.tableName)
  }
}
`
  return code
}

export default modelizeSchema
