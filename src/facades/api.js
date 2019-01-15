import { Schema } from '../libs/schema'

const api = {}

const getSchemaList = () => {
  const schemaList = JSON.parse(localStorage.getItem('database-schema')) || []
  return schemaList
}
const setSchemaList = (schemaList) => {
  const buffer = JSON.stringify(schemaList)
  localStorage.setItem('database-schema', buffer)
}

api.schema = {
  list: async () => {
    const schemaList = getSchemaList()
    const list = schemaList.map(schema => ({ schemaName: schema.schemaName }))
    return {
      data: list,
    }
  },
  get: async (id) => {
    const schemaList = getSchemaList()
    const { schemaName, tables } = schemaList[id]
    return {
      data: new Schema({
        schemaName,
        tables,
      }),
    }
  },
  add: async (data) => {
    if (!data.schemaName) throw new Error('Invalid Empty Schema Name')
    const schemaList = getSchemaList()
    if (schemaList.some(item => item.schemaName.toLowerCase() === data.schemaName.toLowerCase())) {
      throw new Error(`API_ERROR: Invalid Schema Name: ${data.schemaName}`)
    } else {
      const { schemaName, tables } = data
      const schema = new Schema({ schemaName, tables })
      const length = schemaList.push(schema)
      setSchemaList(schemaList)
      return {
        id: length - 1,
      }
    }
  },
  update: async (id, data) => {
    if (!data.schemaName) throw new Error('Invalid empty schema name')
    const schemaList = getSchemaList()
    if (schemaList.some((item, i) => item.schemaName.toLowerCase() === data.schemaName.toLowerCase() && i !== id)) {
      throw new Error(`API_ERROR: Invalid Schema Name ${data.schemaName}`)
    } else {
      const { schemaName, tables } = data
      const schema = new Schema({ schemaName, tables })
      schemaList[id] = schema
      setSchemaList(schemaList)
    }
  },
  delete: async (id) => {
    const schemaList = getSchemaList()
    if (id < 0 || id > schemaList.length - 1) throw new Error(`API_ERROR: Invalid Schema Id: ${id}`)
    schemaList.splice(id, 1)
    setSchemaList(schemaList)
  },
}

// const getTableArray = (sid) => {
//   const schemaArray = getSchemaArray()
//   if (sid < 0 || sid > schemaArray.length - 1) throw new Error(`API_ERROR: Invalid schema id: ${sid}`)
//   const tables = schemaArray[sid].tables || []
//   return tables
// }
// const setTableArray = (sid, tables) => {
//   const schemaArray = getSchemaArray()
//   if (sid < 0 || sid > schemaArray.length - 1) throw new Error(`API_ERROR: Invalid schema id: ${sid}`)
//   schemaArray[sid].tables = tables
//   setSchemaArray(schemaArray)
// }

// api.table = {
//   list: async (sid) => {
//     const tables = getTableArray(sid)
//     return {
//       data: tables,
//     }
//   },
//   get: (sid, tid) => {
//     const tables = getTableArray(sid)
//     const { schemaName, tableName, columns } = tables[tid]
//     return {
//       data: new Table({
//         schemaName,
//         tableName,
//         columns,
//       }),
//     }
//   },
//   add: async (sid, data) => {
//     if (!data.tableName) throw new Error('Invalid empty table name')
//     const tables = getTableArray(sid)
//     if (tables.some(item => item.tableName.toLowerCase() === data.tableName.toLowerCase())) {
//       throw new Error(`API_ERROR: Invalid table name ${data.tableName}`)
//     } else {
//       const { schemaName, tableName, pkeyIndex, columns } = data
//       const table = new Table({ schemaName, tableName, pkeyIndex, columns })
//       const length = tables.push(table)
//       setTableArray(sid, tables)
//       return {
//         id: length - 1,
//       }
//     }
//   },
//   update: async (sid, tid, data) => {
//     if (!data.tableName) throw new Error('Invalid empty table name')
//     const tables = getTableArray(sid)
//     if (tables.some((item, id) => item.tableName.toLowerCase() === data.tableName.toLowerCase() && id !== tid)) {
//       throw new Error(`API_ERROR: Invalid table name ${data.tableName}`)
//     } else {
//       const { schemaName, tableName, pkeyIndex, columns } = data
//       const table = new Table({ schemaName, tableName, pkeyIndex, columns })
//       tables[tid] = table
//       setTableArray(sid, tables)
//     }
//   },
//   delete: async (sid, tid) => {
//     const tables = getTableArray(sid)
//     if (tid < 0 || tid > tables.length - 1) throw new Error(`API_ERROR: Invalid table id: ${tid}`)
//     tables.splice(tid, 1)
//     setTableArray(sid, tables)
//   },
// }

export default api
