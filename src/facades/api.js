import { Schema, Table } from '../libs/schema'

const api = {}

const blankSchema = new Schema({
  schemaName: '',
})

const getSchemaArray = () => {
  const schemaArray = JSON.parse(localStorage.getItem('schemas-data')) || [blankSchema]
  return schemaArray
}
const setSchemaArray = (schemaArray) => {
  const buffer = JSON.stringify(schemaArray)
  localStorage.setItem('schemas-data', buffer)
}

api.schema = {
  list: async () => {
    const schemaArray = getSchemaArray()
    return schemaArray
  },
  get: async (index) => {
    const schemaArray = getSchemaArray()
    return schemaArray[index]
  },
  add: async (schema) => {
    const schemaArray = getSchemaArray()
    if (schemaArray.every(item => item.schemaName !== schema.schemaName)) {
      const length = schemaArray.push(schema)
      setSchemaArray(schemaArray)
      return length - 1
    }
    throw new Error(`Duplicate schema name ${schema.schemaName}`)
  },
  update: async (index, schema) => {
    const schemaArray = getSchemaArray()
    if (schemaArray.some((item, i) => item.schemaName === schema.schemaName && i !== index)) {
      throw new Error(`Duplicate schema name ${schema.schemaName}`)
    } else {
      schemaArray[index] = schema
      setSchemaArray(schemaArray)
      return index
    }
  },
  delete: async (index) => {
    const schemaArray = getSchemaArray()
    schemaArray.splice(index, 1)
    setSchemaArray(schemaArray)
    return index
  },
}

const blankTable = new Table({
  schemaName: '',
  tableName: '',
})

const getTableArray = (sindex) => {
  const schemaArray = getSchemaArray()
  const tableArray = schemaArray[sindex].tables || [blankTable]
  return tableArray
}
const setTableArray = (sindex, tableArray) => {
  const schemaArray = getSchemaArray()
  schemaArray[sindex].tables = tableArray
  setSchemaArray(schemaArray)
}

api.table = {
  list: async (location) => {
    const tableArray = getTableArray(location.schema)
    return tableArray
  },
  get: async (location) => {
    const tableArray = getTableArray(location.schema)
    return tableArray[location.table]
  },
  add: async (location, table) => {
    const tableArray = getTableArray(location.schema)
    if (tableArray.every(item => item.tableName !== table.tableName)) {
      const length = tableArray.push(table)
      setTableArray(location.schema, tableArray)
      return length - 1
    }
    throw new Error(`Duplicate table name ${table.tableName}`)
  },
  update: async (location, table) => {
    const tableArray = getTableArray(location.schema)
    if (tableArray.some((item, index) => item.tableName === table.tableName && index !== location.table)) {
      throw new Error(`Duplicate table name ${table.tableName}`)
    } else {
      tableArray[location.table] = table
      setTableArray(location.schema, tableArray)
      return location
    }
  },
  delete: async (location) => {
    const tableArray = getTableArray(location.schema)
    tableArray.splice(location.table, 1)
    setTableArray(location.schema, tableArray)
    return location
  },
}

export default api
