function protocolo () {
  const date = new Date()

  return date.getFullYear().toString() +
    ('0' + (date.getMonth() + 1)).slice(-2).toString() +
    ('0' + date.getDate()).slice(-2).toString() +
    ('0' + date.getHours()).slice(-2).toString() +
    ('0' + date.getMinutes()).slice(-2).toString() +
    ('0' + date.getSeconds()).slice(-2).toString() +
    Math.floor(10000 + Math.random() * 9000)
}

export default protocolo
