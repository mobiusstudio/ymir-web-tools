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
            type: 'string',
            name: 'username',
          }),
          new Column({
            table: 'account',
            type: 'string',
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
            type: 'number',
            name: 'id',
            foreign: '"user".account.id',
          }),
          new Column({
            table: 'profile',
            type: 'string',
            name: 'name',
          }),
          new Column({
            table: 'profile',
            type: 'number',
            name: 'age',
          }),
        ],
      }),
    ],
  }),
]
