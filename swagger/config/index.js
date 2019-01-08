const env = process.env.NODE_ENV || 'development'

// eslint-disable-next-line import/no-dynamic-require
const config = require(`./${env}.json`)

export default config
