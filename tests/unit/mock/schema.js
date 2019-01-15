import { Schema, Table, Column } from '@/libs/schema'

export const fakeSchemaArray = [
  new Schema({
    schemaName: 'user',
    tables: [
      new Table({
        tableName: 'account',
        columns: [
          new Column({
            type: 'number',
            name: 'id',
          }),
          new Column({
            type: 'string',
            name: 'username',
          }),
          new Column({
            type: 'string',
            name: 'password',
          }),
        ],
      }),
      new Table({
        tableName: 'profile',
        columns: [
          new Column({
            type: 'number',
            name: 'id',
            foreign: '"user".account.id',
          }),
          new Column({
            type: 'string',
            name: 'name',
          }),
          new Column({
            type: 'number',
            name: 'age',
          }),
        ],
      }),
    ],
  }),
]
