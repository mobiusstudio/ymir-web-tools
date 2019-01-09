import { snakeCase } from 'lodash'

const sqlizeType = (type) => {
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
      throw new Error(`Invalid type: ${type}`)
  }
}

const sqlizeDefault = (def) => {
  if (!def) return ''
  const value = typeof def === 'string' ? `'${def}'` : def
  return ` DEFAULT ${value}`
}

const sqlizeColumn = (items) => {
  const strArray = []
  items.forEach((item) => {
    const keyName = snakeCase(item.name)
    const keyType = sqlizeType(item.type)
    const keyDefault = sqlizeDefault(item.default)
    const end = item.required ? ' NOT NULL,' : ','
    const string = `${keyName} ${keyType}${keyDefault}${end}`
    strArray.push(string)
  })
  return strArray.join('\n  ')
}

const sqlizeSchema = (schema) => {
  const { schemaName, tableName, pkey, items } = schema
  const newItems = items.filter(item => item.name !== pkey)
  const columns = sqlizeColumn(newItems)
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

export default sqlizeSchema
