import { Schema } from '../libs/schema'

const api = {}

const address = process.env.NODE_ENV === 'test' ? 'test-db-schema' : 'database-schema'

const getSchemaList = () => {
  const schemaList = JSON.parse(localStorage.getItem(address)) || []
  return schemaList
}
const setSchemaList = (schemaList) => {
  const buffer = JSON.stringify(schemaList)
  localStorage.setItem(address, buffer)
}

api.download = () => {
  const data = localStorage.getItem(address)
  const filename = 'ymir.config.json'
  const type = 'json'
  const file = new Blob([data], { type })
  if (window.navigator.msSaveOrOpenBlob) { // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename)
  }
  const a = document.createElement('a')
  const url = URL.createObjectURL(file)
  document.body.appendChild(a)
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => {
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }, 0)
}

api.schema = {
  list: async () => {
    const schemaList = getSchemaList()
    const list = schemaList.map((schema) => {
      const { schemaName, tables } = schema
      const newSchema = {
        schemaName,
        tables: [],
      }
      newSchema.tables = tables.map((table) => {
        const { tableName } = table
        const newTable = {
          tableName,
        }
        return newTable
      })
      return newSchema
    })
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

export default api
