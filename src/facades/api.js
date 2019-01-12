const api = {}

api.schema = {
  save: (schemaArray) => {
    const buffer = JSON.stringify(schemaArray)
    localStorage.setItem('schemas-data', buffer)
  },
  list: async () => {
    const schemaArray = JSON.parse(localStorage.getItem('schemas-data')) || []
    return schemaArray
  },
  get: async (index) => {
    const schemaArray = JSON.parse(localStorage.getItem('schemas-data')) || []
    return schemaArray[index]
  },
  add: async (schema) => {
    const schemaArray = JSON.parse(localStorage.getItem('schemas-data')) || []
    if (schemaArray.every(item => item.schemaName !== schema.schemaName)) {
      schemaArray.push(this.currentSchema)
      this.save(schemaArray)
    } else {
      throw new Error(`Duplicate schema name ${schema.schemaName}`)
    }
  },
  update: async (schema, index) => {
    const schemaArray = JSON.parse(localStorage.getItem('schemas-data')) || []
    if (schemaArray.some((item, i) => item.schemaName === schema.schemaName && i !== index)) {
      throw new Error(`Duplicate schema name ${schema.schemaName}`)
    } else {
      schemaArray[index] = schema
      this.save(schemaArray)
    }
  },
  delete: async (index) => {
    const schemaArray = JSON.parse(localStorage.getItem('schemas-data')) || []
    schemaArray.splice(index, 1)
    this.save(schemaArray)
  },
}

export default api
