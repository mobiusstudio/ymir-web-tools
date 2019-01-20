/* eslint-disable no-param-reassign */
import { ColumnBase, TableBase, SchemaBase } from '../../../ymir-codegen/src/libs/schema'

export class Column extends ColumnBase {
  constructor({
    schemaName = '',
    tableName = '',
    type = null,
    name = null,
    alias = null,
    foreign = null,
    default: def = null,
    required = false,
  }) {
    super({
      schemaName,
      tableName,
      type,
      name,
      alias,
      foreign,
      default: def,
      required,
    })
  }
}

export class Table extends TableBase {
  constructor({
    schemaName = '',
    tableName = '',
    pkeyIndex = 0,
    columns = [new Column({
      schemaName,
      tableName,
      type: 'id-auto',
      name: 'id',
    })],
  }) {
    super({
      schemaName,
      tableName,
      pkeyIndex,
    })
    this.columns = columns.map((column) => {
      const {
        type,
        name,
        alias = '',
        foreign = '',
        default: def = undefined,
        required = false,
      } = column
      return new Column({
        schemaName,
        tableName,
        type,
        name,
        alias,
        foreign,
        default: def,
        required,
      })
    })
  }

  setSchemaName(schemaName) {
    const name = schemaName || this.schemaName
    this.schemaName = name
    this.columns.forEach((column) => {
      column.schemaName = name
    })
  }

  setTableName(tableName) {
    const name = tableName || this.tableName
    this.tableName = name
    this.columns.forEach((column) => {
      column.tableName = name
    })
  }
}

export class Schema extends SchemaBase {
  constructor({
    schemaName = '',
    tables = [new Table({
      schemaName,
    })],
  }) {
    super({
      schemaName,
    })
    this.tables = tables.map((table) => {
      const {
        tableName,
        pkeyIndex,
        columns,
      } = table
      return new Table({
        schemaName,
        tableName,
        pkeyIndex,
        columns,
      })
    })
  }

  setSchemaName(schemaName) {
    const name = schemaName || this.schemaName
    this.schemaName = name
    this.tables.forEach((table) => {
      table.setSchemaName(name)
    })
  }
}
