const validator = {}

validator.duplicateKey = ({
  value,
  index = false,
  list = [],
  key = '',
  isNew = false,
  cb = () => {},
}) => {
  if (
    (!list.length && list.length !== 0)
    || list.length < 0
    || !key
    || typeof key !== 'string'
  ) throw new Error('invalid parameters')
  if (
    (isNew && list.some(item => item[key] === value))
    || (!isNew && list.some((item, i) => item[key] === value && i !== index))
  ) {
    console.log(value, list, index)
    cb()
    return false
  }
  return true
}

export default validator
