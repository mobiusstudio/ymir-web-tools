/* eslint-disable operator-linebreak */
import { snakeCase } from 'lodash'

const snakeCaseSchema = (schema) => {
  const { schemaName, tables } = schema
  const newSchema = schema
  newSchema.schemaName = snakeCase(schemaName)
  newSchema.tables = tables.map((table) => {
    const { tableName, columns } = table
    const newTable = table
    newTable.schemaName = snakeCase(schemaName)
    newTable.tableName = snakeCase(tableName)
    newTable.columns = columns.map((column) => {
      const { name } = column
      const newColumn = column
      newColumn.schemaName = snakeCase(schemaName)
      newColumn.tableName = snakeCase(tableName)
      newColumn.name = snakeCase(name)
      return newColumn
    })
    return newTable
  })
  return newSchema
}

const generateType = (type) => {
  switch (type) {
    case 'string':
    case 'mobile':
    case 'id-number':
    case 'email':
      return 'varchar'
    case /string\(([0-9]+)\)/:
      return type.replace(/string\(([0-9]+)\)/, 'varchar($1)')
    case 'text':
      return 'text'
    case 'int':
      return 'int'
    case 'number':
    case 'bigint':
    case 'id':
    case 'id-seq':
    case 'id-auto':
      return 'bigint'
    case 'double':
      return 'double precision'
    case 'numeric':
      return 'numeric'
    case /numeric\([0-9]+\)/:
      return type.replace(/numeric\([0-9]+,[0-9]+\)/, 'NUMERIC($1)')
    case /numeric\([0-9]+,[0-9]+\)/:
      return type.replace(/numeric\([0-9]+,[0-9]+\)/, 'NUMERIC($1,$2)')
    case 'timestamp':
      return 'timestamp'
    case 'boolean':
      return 'boolean'
    default:
      return type
  }
}

const generateDefault = (def) => {
  if (def === null || def === undefined) return ''
  const value = typeof def === 'string' ? `'${def}'` : def
  return `DEFAULT ${value}`
}

const generatePkey = (pkey) => {
  const { schemaName, type, name, foreign } = pkey
  let def
  switch (type) {
    case 'id-auto':
    default:
      def = `${schemaName}".${schemaName}_id()`
      break
  }
  const code = `${name} ${generateType(type)} DEFAULT ${def} NOT NULL REFERENCES ${foreign},`
  return code
}


const generateColumns = (columns) => {
  const strArray = []
  columns.forEach((column) => {
    const { name, type, def, required } = column
    const end = required ? ' NOT NULL,' : ','
    const arr = [
      name,
      generateType(type),
      generateDefault(def),
      end,
    ]
    const string = arr.join(' ')
    strArray.push(string)
  })
  return strArray.join('\n  ')
}

const generateTables = (tables) => {
  const tableArray = []
  tables.forEach((table) => {
    const { schemaName, tableName, pkeyIndex, columns } = table
    const pkey = columns.splice(pkeyIndex, 1)
    const code =
`--------------------------------
-- ${tableName} notes:
--------------------------------

CREATE TABLE "${schemaName}".${tableName}
(
  ${generatePkey(pkey)}
  ${generateColumns(columns)}
  create_time bigint DEFAULT unix_now(),
  last_update_time bigint DEFAULT unix_now(),
  PRIMARY KEY (${pkey.name})
)
WITH (
  OIDS=FALSE
);
`
    tableArray.push(code)
  })
  return tableArray.join('\n')
}

const generateSql = (schema) => {
  const newSchema = snakeCaseSchema(schema)
  const { schemaName, tables } = newSchema
  const code =
`--------------------------------
-- ${schemaName} schema and tables
--------------------------------

CREATE SCHEMA "${schemaName}";

CREATE SEQUENCE "${schemaName}".${schemaName}_id_seq;

CREATE OR REPLACE FUNCTION "${schemaName}".${schemaName}_id
(OUT result bigint) AS $$
DECLARE
  our_epoch bigint := 1466352806721;
  seq_id bigint;
  now_millis bigint;
  shard_id int := 0;
BEGIN
  SELECT nextval('"${schemaName}".${schemaName}_id_seq') % 128
  INTO seq_id;
  SELECT FLOOR(EXTRACT(EPOCH FROM current_timestamp) * 1000)
  INTO now_millis;
  result :=
  (now_millis - our_epoch) << 12; 
result := result |
(shard_id << 7);
  result := result |
(seq_id);
END;
$$ LANGUAGE PLPGSQL;

${generateTables(tables)}

`
  return code
}

export default generateSql
