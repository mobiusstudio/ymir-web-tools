import { Schema } from '../libs/schema'
import { formatSchemaList } from '../utils'

const api = {}

const address = process.env.NODE_ENV === 'test' ? 'test-db-schema' : 'database-schema'

const getSchemaList = () => {
  const schemaList = JSON.parse(sessionStorage.getItem(address)) || JSON.parse(localStorage.getItem(address)) || []
  return schemaList
}
const setSchemaList = (schemaList) => {
  const buffer = JSON.stringify(schemaList)
  sessionStorage.setItem(address, buffer)
}
const saveSchemaList = (schemaList) => {
  const buffer = JSON.stringify(schemaList)
  setSchemaList(schemaList)
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
    return {
      data: formatSchemaList(schemaList),
    }
  },
  load: async (data) => {
    const schemaList = data
    setSchemaList(schemaList)
    return {
      data: formatSchemaList(schemaList),
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
      saveSchemaList(schemaList)
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
      saveSchemaList(schemaList)
    }
  },
  delete: async (id) => {
    const schemaList = getSchemaList()
    if (id < 0 || id > schemaList.length - 1) throw new Error(`API_ERROR: Invalid Schema Id: ${id}`)
    schemaList.splice(id, 1)
    saveSchemaList(schemaList)
  },
}

export default api
