import { Schema, Table } from '../libs/schema'

const api = {}

const getSchemaArray = () => {
  const schemaArray = JSON.parse(localStorage.getItem('schemas-data')) || []
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
  add: async (data) => {
    const schemaArray = getSchemaArray()
    if (schemaArray.every(item => item.schemaName.toLowerCase() !== data.schemaName.toLowerCase())) {
      const { schemaName, tables } = data
      const schema = new Schema({ schemaName, tables })
      const length = schemaArray.push(schema)
      setSchemaArray(schemaArray)
      return {
        id: length - 1,
      }
    }
    throw new Error(`Duplicate schema name ${data.schemaName}`)
  },
  update: async (id, data) => {
    const schemaArray = getSchemaArray()
    if (schemaArray.some((item, i) => item.schemaName.toLowerCase() === data.schemaName.toLowerCase() && i !== id)) {
      throw new Error(`Duplicate schema name ${data.schemaName}`)
    } else {
      const { schemaName, tables } = data
      const schema = new Schema({ schemaName, tables })
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

const getTableArray = (sid) => {
  const schemaArray = getSchemaArray()
  console.log('sa', schemaArray)
  const tables = schemaArray[sid].tables || []
  console.log('ta', tables)
  return tables
}
const setTableArray = (sid, tables) => {
  const schemaArray = getSchemaArray()
  schemaArray[sid].tables = tables
  setSchemaArray(schemaArray)
}

api.table = {
  list: async (sid) => {
    const tables = getTableArray(sid)
    return {
      data: tables,
    }
  },
  get: (sid, tid) => {
    const tables = getTableArray(sid)
    console.log(tables)
    return {
      data: tables[tid],
    }
  },
  add: async (sid, data) => {
    const tables = getTableArray(sid)
    if (tables.every(item => item.tableName.toLowerCase() !== data.tableName.toLowerCase())) {
      const { schemaName, tableName, pkeyIndex, columns } = data
      const table = new Table({ schemaName, tableName, pkeyIndex, columns })
      const length = tables.push(table)
      setTableArray(sid, tables)
      return {
        id: length - 1,
      }
    }
    throw new Error(`Duplicate table name ${data.tableName}`)
  },
  update: async (sid, tid, data) => {
    const tables = getTableArray(sid)
    if (tables.some((item, id) => item.tableName.toLowerCase() === data.tableName.toLowerCase() && id !== tid)) {
      throw new Error(`Duplicate table name ${data.tableName}`)
    } else {
      const { schemaName, tableName, pkeyIndex, columns } = data
      const table = new Table({ schemaName, tableName, pkeyIndex, columns })
      tables[tid] = table
      setTableArray(sid, tables)
    }
  },
  delete: async (sid, tid) => {
    const tables = getTableArray(sid)
    tables.splice(tid, 1)
    setTableArray(sid, tables)
  },
}

export default api
