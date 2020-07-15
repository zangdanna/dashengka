export * from './map'

export function param2Obj (url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"') +
    '"}'
  )
}

export function formatSeconds (_seconds) {
  _seconds = parseInt(_seconds / 1000)
  let hours, mins
  let result = ''
  // seconds = parseInt(_seconds % 60)
  mins = parseInt(_seconds % 3600 / 60)
  hours = parseInt(_seconds / 3600)

  if (hours) {
    result = `${hours}h${mins}min`
  } else {
    result = `${mins}min`
  }
  return result
}
