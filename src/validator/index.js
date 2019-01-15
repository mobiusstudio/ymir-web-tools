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
    (isNew && list.some(item => item === value))
    || (!isNew && list.some((item, i) => item === value && i !== index))
  ) {
    cb()
    return false
  }
  return true
}

export default validator
