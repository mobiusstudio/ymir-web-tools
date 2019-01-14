/* eslint-disable no-param-reassign */
export class Column {
  constructor({
    schemaName = '',
    tableName = '',
    type,
    name,
    alias = null,
    foreign = null,
    def = null,
    required = false,
  }) {
    this.schemaName = schemaName
    this.tableName = tableName
    this.type = type
    this.name = name
    this.alias = alias
    this.foreign = foreign
    this.def = def
    this.required = required
  }

  static keyMap = ['type', 'name', 'alias', 'foreign']
}

export class Table {
  constructor({
    schemaName,
    tableName,
    pkeyIndex = 0,
    columns = [
      new Column({
        tableName,
        type: '',
        name: '',
      }),
    ],
  }) {
    this.schemaName = schemaName
    this.tableName = tableName
    this.pkeyIndex = pkeyIndex
    this.columns = columns.map((column) => {
      const {
        type,
        name,
        alias = '',
        foreign = '',
        def = undefined,
        required = false,
      } = column
      const newColumn = new Column({
        schemaName,
        tableName,
        type,
        name,
        alias,
        foreign,
        def,
        required,
      })
      return newColumn
    })
  }

  setSchemaName(schemaName) {
    this.schemaName = schemaName
    this.columns.forEach((column) => {
      column.schemaName = schemaName
    })
  }

  setTableName(tableName) {
    this.tableName = tableName
    this.columns.forEach((column) => {
      column.tableName = tableName
    })
  }
}

export class Schema {
  constructor({
    schemaName,
    tables = [
      new Table({
        schemaName,
        tableName: '',
      }),
    ],
  }) {
    this.schemaName = schemaName
    this.tables = tables.map((table) => {
      const {
        tableName,
        pkeyIndex,
        columns,
      } = table
      const newTable = new Table({
        schemaName,
        tableName,
        pkeyIndex,
        columns,
      })
      return newTable
    })
  }

  setSchemaName(schemaName) {
    this.schemaName = schemaName
    this.tables.forEach((table) => {
      table.setSchemaName(schemaName)
    })
  }
}
