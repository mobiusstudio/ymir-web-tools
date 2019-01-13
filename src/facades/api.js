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

const getTableArray = (sindex) => {
  const schemaArray = getSchemaArray()
  const tableArray = schemaArray[sindex].tables || []
  return tableArray
}
const setTableArray = (sindex, tableArray) => {
  const schemaArray = getSchemaArray()
  schemaArray[sindex].tables = tableArray
  setSchemaArray(schemaArray)
}

api.table = {
  list: async (sindex) => {
    const tableArray = getTableArray(sindex)
    return tableArray
  },
  get: async (sindex, tindex) => {
    const tableArray = getTableArray(sindex)
    return tableArray[tindex]
  },
  add: async (sindex, table) => {
    const tableArray = getTableArray(sindex)
    if (tableArray.every(item => item.tableName !== table.tableName)) {
      const length = tableArray.push(table)
      setTableArray(sindex, tableArray)
      return length - 1
    }
    throw new Error(`Duplicate table name ${table.tableName}`)
  },
  update: async (sindex, tindex, table) => {
    const tableArray = getTableArray(sindex)
    if (tableArray.some((item, index) => item.tableName === table.tableName && index !== tindex)) {
      throw new Error(`Duplicate table name ${table.tableName}`)
    } else {
      tableArray[tindex] = table
      setTableArray(sindex, tableArray)
      return tindex
    }
  },
  delete: async (sindex, tindex) => {
    const tableArray = getTableArray(sindex)
    tableArray.splice(tindex, 1)
    setTableArray(sindex, tableArray)
    return tindex
  },
}

export default api
