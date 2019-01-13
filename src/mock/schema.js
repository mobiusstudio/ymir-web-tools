import { Schema, Table, Column } from '../libs/schema'

export const fakeSchemaArray = [
  new Schema({
    schemaName: 'user',
    tables: [
      new Table({
        schemaName: 'user',
        tableName: 'account',
        columns: [
          new Column({
            table: 'account',
            columnType: 'number',
            name: 'id',
          }),
          new Column({
            table: 'account',
            columnType: 'string',
            name: 'username',
          }),
          new Column({
            table: 'account',
            columnType: 'string',
            name: 'password',
          }),
        ],
      }),
      new Table({
        schemaName: 'user',
        tableName: 'profile',
        columns: [
          new Column({
            table: 'profile',
            columnType: 'number',
            name: 'id',
            foreign: '"user".account.id',
          }),
          new Column({
            table: 'profile',
            columnType: 'string',
            name: 'name',
          }),
          new Column({
            table: 'profile',
            columnType: 'number',
            name: 'age',
          }),
        ],
      }),
    ],
  }),
]
