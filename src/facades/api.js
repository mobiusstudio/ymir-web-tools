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
    return {
      data: schemaArray,
    }
  },
  get: async (id) => {
    const schemaArray = getSchemaArray()
    return {
      data: schemaArray[id],
    }
  },
  add: async (schema) => {
    const schemaArray = getSchemaArray()
    if (schemaArray.every(item => item.schemaName.toLowerCase() !== schema.schemaName.toLowerCase())) {
      const length = schemaArray.push(schema)
      setSchemaArray(schemaArray)
      return {
        id: length - 1,
      }
    }
    throw new Error(`Duplicate schema name ${schema.schemaName}`)
  },
  update: async (id, schema) => {
    const schemaArray = getSchemaArray()
    if (schemaArray.some((item, i) => item.schemaName.toLowerCase() === schema.schemaName.toLowerCase() && i !== id)) {
      throw new Error(`Duplicate schema name ${schema.schemaName}`)
    } else {
      schemaArray[id] = schema
      setSchemaArray(schemaArray)
    }
  },
  delete: async (id) => {
    const schemaArray = getSchemaArray()
    schemaArray.splice(id, 1)
    setSchemaArray(schemaArray)
  },
}

const blankTable = new Table({
  schemaName: '',
  tableName: '',
})

const getTableArray = (sid) => {
  const schemaArray = getSchemaArray()
  const tableArray = schemaArray[sid].tables || [blankTable]
  return tableArray
}
const setTableArray = (sid, tableArray) => {
  const schemaArray = getSchemaArray()
  schemaArray[sid].tables = tableArray
  setSchemaArray(schemaArray)
}

api.table = {
  list: async (sid) => {
    const tableArray = getTableArray(sid)
    return {
      data: tableArray,
    }
  },
  get: (sid, tid) => {
    const tableArray = getTableArray(sid)
    return {
      data: tableArray[tid],
    }
  },
  add: async (sid, table) => {
    const tableArray = getTableArray(sid)
    if (tableArray.every(item => item.tableName.toLowerCase() !== table.tableName.toLowerCase())) {
      const length = tableArray.push(table)
      setTableArray(sid, tableArray)
      return {
        id: length - 1,
      }
    }
    throw new Error(`Duplicate table name ${table.tableName}`)
  },
  update: async (sid, tid, table) => {
    const tableArray = getTableArray(sid)
    if (tableArray.some((item, id) => item.tableName.toLowerCase() === table.tableName.toLowerCase() && id !== tid)) {
      throw new Error(`Duplicate table name ${table.tableName}`)
    } else {
      tableArray[tid] = table
      setTableArray(sid, tableArray)
    }
  },
  delete: async (sid, tid) => {
    const tableArray = getTableArray(sid)
    tableArray.splice(tid, 1)
    setTableArray(sid, tableArray)
  },
}

export default api
