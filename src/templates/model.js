/* eslint-disable operator-linebreak */
import { upperFirst } from 'lodash'

const generateColumns = (columns) => {
  const columnArray = []
  columns.forEach((column) => {
    const keyMap = ['type', 'name', 'alias', 'foreign', 'def', 'required']
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

const generateTables = (tables) => {
  const tableArray = []
  tables.forEach((table) => {
    const { schemaName, tableName, columns } = table
    const code =
`export class ${upperFirst(tableName)} extends DatabaseTable {
  constructor() {
    super('${schemaName}', '${tableName}')
    this.columns = new ColumnArray([
${generateColumns(columns)}
    ], this.tableName)
  }
}
`
    tableArray.push(code)
  })
  return tableArray.join('\n')
}

const generateModels = (schema) => {
  const { tables } = schema
  const code = // TODO: path should be smart
`import { DatabaseTable, Column, ColumnArray } from './core'

${generateTables(tables)}
`
  return code
}

export default generateModels
