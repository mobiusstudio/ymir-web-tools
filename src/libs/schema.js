import { BaseColumn } from '../../../ymir-models/core/model/column-base'

export class Column extends BaseColumn {
  constructor({
    table = '',
    type,
    name,
    alias = null,
    foreign = null,
    def = null,
    required = false,
  }) {
    super({ table, type, name, alias, foreign, def, required })
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
        table: tableName,
        columnType: '',
        name: '',
      }),
    ],
  }) {
    this.schemaName = schemaName
    this.tableName = tableName
    this.pkeyIndex = pkeyIndex
    this.columns = columns
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
    this.tables = tables
  }
}
