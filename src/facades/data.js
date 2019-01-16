import browserFileStorage from 'browser-file-storage'

browserFileStorage.init('ymir-web-tool').then((status) => {
  if (status.initial) console.log('The inner database was newly created.')
}).catch((error) => {
  if (!error.supported) throw new Error('IndexedDB is not supported')
  if (error.alreadyInit) throw new Error('IndexedDB is already inited')
  if (error.dbError) {
    console.error(error.error)
  }
})

const data = {}

data.save = (filename, tiptext) => browserFileStorage.save(filename, tiptext)
  .then(res => res)
  .catch((error) => {
    throw error
  })

export default data
