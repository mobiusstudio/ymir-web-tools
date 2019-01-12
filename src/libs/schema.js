import { BaseColumn } from '../../../ymir-models/core/model/column-base'

export class Column extends BaseColumn {
  constructor({
    table = '',
    columnType,
    name,
    alias = null,
    foreign = null,
    def = null,
    required = false,
  }) {
    super({ table, type: columnType, name, alias, foreign, def, required })
  }

  static keyMap = ['name', 'alias', 'foreign']
}

export class Table {
  constructor({
    schemaName,
    tableName,
    pkeyIndex = 0,
    columns = new Column({
      type: 'id',
      name: 'id',
    }),
  }) {
    this.schemaName = schemaName
    this.tableName = tableName
    this.pkeyIndex = pkeyIndex
    this.columns = columns
  }
}

export class Schema {
  constructor({ schemaName, tables = [] }) {
    this.schemaName = schemaName
    this.tables = tables
  }
}
