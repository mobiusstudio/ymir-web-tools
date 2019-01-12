import { snakeCase } from 'lodash'

const generateType = (type) => {
  switch (type) {
    case 'string':
      return 'varchar'
    case 'number':
    case 'id':
    case 'timestamp':
      return 'bigint'
    case 'boolean':
      return 'boolean'
    default:
      console.log(`unknown type: ${type}, as string`)
      return 'varchar'
  }
}

const generateDefault = (def) => {
  if (def === null || def === undefined) return ''
  const value = typeof def === 'string' ? `'${def}'` : def
  return ` DEFAULT ${value}`
}

const sqlizeColumn = (columns) => {
  const strArray = []
  columns.forEach((column) => {
    const keyName = snakeCase(column.name)
    const keyType = generateType(column.type)
    const keyDefault = generateDefault(column.def)
    const end = column.required ? ' NOT NULL,' : ','
    const string = `${keyName} ${keyType}${keyDefault}${end}`
    strArray.push(string)
  })
  return strArray.join('\n  ')
}

const generateSql = (schema) => {
  const schemaName = snakeCase(schema.schemaName)
  const tableName = snakeCase(schema.tableName)
  const pkey = snakeCase(schema.pkey)
  const newColumns = schema.columns.filter(column => column.name !== schema.pkey)
  const columns = sqlizeColumn(newColumns)
  // eslint-disable-next-line operator-linebreak
  const code =
`--------------------------------
-- ${schemaName} schema and tables
--------------------------------

CREATE SCHEMA "${schemaName}";

CREATE SEQUENCE "${schemaName}".${schemaName}_${pkey}_seq;

CREATE OR REPLACE FUNCTION "${schemaName}".${schemaName}_${pkey}
(OUT result bigint) AS $$
DECLARE
  our_epoch bigint := 1466352806721;
  seq_id bigint;
  now_millis bigint;
  shard_id int := 0;
BEGIN
  SELECT nextval('"${schemaName}".${schemaName}_${pkey}_seq') % 128
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

CREATE TABLE "${schemaName}".${tableName}
(
  ${pkey} bigint DEFAULT "${schemaName}".${schemaName}_${pkey}() NOT NULL,
  ${columns}
  create_time bigint DEFAULT unix_now(),
  last_update_time bigint DEFAULT unix_now(),
  PRIMARY KEY (${pkey})
)
WITH (
  OIDS=FALSE
);
`
  return code
}

export default generateSql
