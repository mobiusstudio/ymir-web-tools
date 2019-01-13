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
            type: 'number',
            name: 'id',
          }),
          new Column({
            table: 'account',
            type: 'username',
            name: 'string',
          }),
          new Column({
            table: 'account',
            type: 'password',
            name: 'string',
          }),
        ],
      }),
      new Table({
        schemaName: 'user',
        tableName: 'profile',
        columns: [
          new Column({
            table: 'profile',
            type: 'number',
            name: 'id',
            foreign: '"user".account.id',
          }),
          new Column({
            table: 'profile',
            type: 'name',
            name: 'string',
          }),
          new Column({
            table: 'profile',
            type: 'age',
            name: 'number',
          }),
        ],
      }),
    ],
  }),
]
