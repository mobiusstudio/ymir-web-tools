/* eslint-disable */
class Type {
  constructor(type) {
    this.type = type
  }

  sql = () => {
    switch (this.type) {
      case 'string':
        return
      default: return
    }
  }
}

const typeMap = {
  // number
  'int':           { sql: 'integer',           model: '', swagger: '' },
  'bigint':        { sql: 'bigint',            model: '', swagger: '' },
  'double':        { sql: 'double precision',  model: '', swagger: '' },
  'numeric(p,s)':  { sql: 'NUMERIC(p,s)',      model: '', swagger: '' },
  'money':         { sql: 'money',             model: '', swagger: '' },
  // number customize
  'id-pkey':       { sql: 'bigint',            model: '', swagger: '' },
  'id-seq':        { sql: 'serial/bigserial',  model: '', swagger: '' },
  'id':            { sql: 'bigint',            model: '', swagger: '' },
  // string
  'string':        { sql: 'varchar',           model: '', swagger: '' },
  'string(n)':     { sql: 'varchar(n)',        model: '', swagger: '' },
  'text':          { sql: 'text',              model: '', swagger: '' },
  // string customize
  'mobile':        { sql: 'varchar(n)',        model: '', swagger: '' },
  'id-number':     { sql: 'varchar(n)',        model: '', swagger: '' },
  'e-mail':        { sql: 'varchar',           model: '', swagger: '' },
  // boolean
  'boolean':       { sql: 'boolean',           model: '', swagger: '' },
  // timestamp
  'timestamp':     { sql: 'timestamp',         model: '', swagger: '' },
}
