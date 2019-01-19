/* eslint-disable operator-linebreak */
import { upperFirst } from 'lodash'

const dataCode = 'const data = req.swagger.params.data.value'
const idCode = 'const id = req.swagger.params.id.value'
const returnCode = 'return res.json(result)'

const generateContent = (type, modelName) => {
  switch (type) {
    case 'add': {
      const code =
`   ${dataCode}
    global.logger.trace('${upperFirst(type)} new ${modelName}', data)
    const result = await new ${upperFirst(modelName)}().add(data)
    ${returnCode}`
      return code
    }
    case 'list': {
      const code =
`   const { page, pagesize, next, paging } = req.swagger.params
    const params = {
      page: page.value,
      pagesize: pagesize.value,
      next: next.value,
      nextKey: 'id',
      filters: paging.value.filters,
      orderBy: paging.value.orderBy,
    }
    global.logger.trace('${upperFirst(type)} ${modelName}', params)
    const result = await new ${upperFirst(modelName)}().from().do(params)
    ${returnCode}`
      return code
    }
    case 'get': {
      const code =
`   ${dataCode}
    global.logger.trace('${upperFirst(type)} ${modelName}', id)
    const result = await new ${upperFirst(modelName)}().from().where\`id = \${id}\`.select().do()
    ${returnCode}`
      return code
    }
    case 'update': {
      const code =
`   ${idCode}
    ${dataCode}
    global.logger.trace('${upperFirst(type)} ${modelName}', data)
    const result = await new ${upperFirst(modelName)}().update({
      data,
      pkeyValue: id,
    })
    ${returnCode}`
      return code
    }
    case 'delete': {
      const code =
`   ${idCode}
    global.logger.trace('${upperFirst(type)} ${modelName}', id)
    const result = await new ${upperFirst(modelName)}().delete(id)
    ${returnCode}`
      return code
    }
    default:
      throw new Error('Invalid function type.')
  }
}

const generateFunc = (type, modelName) => {
  const funcName = `${type}${upperFirst(modelName)}`
  const content = generateContent(type, modelName)

  const code =
`export const ${funcName} = async (req, res) => {
  const { ${upperFirst(modelName)} } = global.models
  try {
${content}
  } catch (error) {
    throw error
  }
}
`
  return code
}

export const schemaCode = (table) => {
  const { tableName } = table
  const code = // TODO: path should be smart
`${generateFunc('add', tableName)}
${generateFunc('list', tableName)}
${generateFunc('get', tableName)}
${generateFunc('update', tableName)}
${generateFunc('delete', tableName)}
`
  return code
}
