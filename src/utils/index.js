import { Schema, Table, Column } from '../libs/schema'

export const formatSchemaList = schemaList => schemaList.map((schema) => {
  const { schemaName, tables } = schema
  return new Schema({
    schemaName,
    tables: tables.map((table) => {
      const { tableName, pkeyIndex, columns } = table
      return new Table({
        schemaName,
        tableName,
        pkeyIndex,
        columns: columns.map((column) => {
          const { type, name, alias, foreign, required, default: def } = column
          return new Column({
            schemaName,
            tableName,
            type,
            name,
            alias,
            foreign,
            def,
            required,
          })
        }),
      })
    }),
  })
})
