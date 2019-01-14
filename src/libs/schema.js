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
        type: 'number',
        name: 'id',
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
    const name = schemaName || this.schemaName
    this.schemaName = name
    this.tables.forEach((table) => {
      table.setSchemaName(name)
    })
  }
}
