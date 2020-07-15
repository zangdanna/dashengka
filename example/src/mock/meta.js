import { param2Obj } from '@/utils'

let canObj = {
  dataNaviId: '12',
  name: 'obj1',
  summary: 'gfghfgfhg',
  renewalCycle: '60000'
}

export function canData (config) {
  const { type, body } = config
  if (type === 'POST') {
    let canEdit = JSON.parse(body)
    canObj.summary = canEdit.summary
    return 1
  }
  return canObj
}

let data = {
  list: [
    { detailId: '1', dataNaviId: '12', dataName: '金沙江路', canLabel: 'sa1as', showFlg: '1', showAlias: 'asd1', showKey: '1', summary: '金沙江路', interval: '1000', unit: 'min', granularity: '123', range: '0-1', supplement: '金沙江路', pk: '2', type: 'car', length: '3', decimal: '123' },
    { detailId: '2', dataNaviId: '12', dataName: '金沙江路', canLabel: 's2aas', showFlg: '1', showAlias: 'asd2', showKey: '2', summary: '金沙江路', interval: '1000', unit: 'min', granularity: '123', range: '0-1', supplement: '金沙江路', pk: '2', type: 'car', length: '3', decimal: '123' },
    { detailId: '3', dataNaviId: '12', dataName: '金沙江路', canLabel: 'sa3as', showFlg: '1', showAlias: 'asd3', showKey: '3', summary: '金沙江路', interval: '1000', unit: 'min', granularity: '123', range: '0-1', supplement: '金沙江路', pk: '2', type: 'car', length: '3', decimal: '123' },
    { detailId: '4', dataNaviId: '12', dataName: '金沙江路', canLabel: 'sa4as', showFlg: '1', showAlias: 'asd4', showKey: '4', summary: '金沙江路', interval: '1000', unit: 'min', granularity: '123', range: '0-1', supplement: '金沙江路', pk: '2', type: 'car', length: '3', decimal: '123' },
    { detailId: '5', dataNaviId: '12', dataName: '金沙江路', canLabel: 'sa5as', showFlg: '1', showAlias: 'asd5', showKey: '5', summary: '金沙江路', interval: '1000', unit: 'min', granularity: '123', range: '0-1', supplement: '金沙江路', pk: '2', type: 'car', length: '3', decimal: '123' },
    { detailId: '6', dataNaviId: '12', dataName: '金沙江路', canLabel: 'sa6as', showFlg: '1', showAlias: 'asd6', showKey: '6', summary: '金沙江路', interval: '1000', unit: 'min', granularity: '123', range: '0-1', supplement: '金沙江路', pk: '2', type: 'car', length: '3', decimal: '123' },
    { detailId: '7', dataNaviId: '12', dataName: '金沙江路', canLabel: 'saa7s', showFlg: '1', showAlias: 'asd7', showKey: '7', summary: '金沙江路', interval: '1000', unit: 'min', granularity: '123', range: '0-1', supplement: '金沙江路', pk: '2', type: 'car', length: '3', decimal: '123' },
    { detailId: '8', dataNaviId: '12', dataName: '金沙江路', canLabel: 'sa8as', showFlg: '1', showAlias: 'asd8', showKey: '8', summary: '金沙江路', interval: '1000', unit: 'min', granularity: '123', range: '0-1', supplement: '金沙江路', pk: '2', type: 'car', length: '3', decimal: '123' },
    { detailId: '9', dataNaviId: '12', dataName: '金沙江路', canLabel: 's9aas', showFlg: '1', showAlias: 'asd9', showKey: '9', summary: '金沙江路', interval: '1000', unit: 'min', granularity: '123', range: '0-1', supplement: '金沙江路', pk: '2', type: 'car', length: '3', decimal: '123' },
    { detailId: '10', dataNaviId: '12', dataName: '金沙江路', canLabel: 'sa0as', showFlg: '1', showAlias: 'asd0', showKey: '10', summary: '金沙江路', interval: '1000', unit: 'min', granularity: '123', range: '0-1', supplement: '金沙江路', pk: '2', type: 'car', length: '3', decimal: '123' },
    { detailId: '11', dataNaviId: '12', dataName: '金沙江路', canLabel: 'sa11as', showFlg: '1', showAlias: 'asd11', showKey: '11', summary: '金沙江路', interval: '1000', unit: 'min', granularity: '123', range: '0-1', supplement: '金沙江路', pk: '2', type: 'car', length: '3', decimal: '123' },
    { detailId: '12', dataNaviId: '12', dataName: '金沙江路', canLabel: 'sa12as', showFlg: '1', showAlias: 'asd12', showKey: '12', summary: '金沙江路', interval: '1000', unit: 'min', granularity: '123', range: '0-1', supplement: '金沙江路', pk: '2', type: 'car', length: '3', decimal: '123' },
    { detailId: '13', dataNaviId: '12', dataName: '金沙江路', canLabel: 'sa14as', showFlg: '1', showAlias: 'asd13', showKey: '13', summary: '金沙江路', interval: '1000', unit: 'min', granularity: '123', range: '0-1', supplement: '金沙江路', pk: '2', type: 'car', length: '3', decimal: '123' },
    { detailId: '14', dataNaviId: '12', dataName: '金沙江路', canLabel: 'sa13as', showFlg: '1', showAlias: 'asd14', showKey: '14', summary: '金沙江路', interval: '1000', unit: 'min', granularity: '123', range: '0-1', supplement: '金沙江路', pk: '2', type: 'car', length: '3', decimal: '123' },
    { detailId: '15', dataNaviId: '12', dataName: '金沙江路', canLabel: 'sa15as', showFlg: '1', showAlias: 'asd15', showKey: '15', summary: '金沙江路', interval: '1000', unit: 'min', granularity: '123', range: '0-1', supplement: '金沙江路', pk: '2', type: 'car', length: '3', decimal: '123' },
    { detailId: '16', dataNaviId: '12', dataName: '金沙江路', canLabel: 'sa16as', showFlg: '1', showAlias: 'asd16', showKey: '16', summary: '金沙江路', interval: '1000', unit: 'min', granularity: '123', range: '0-1', supplement: '金沙江路', pk: '2', type: 'car', length: '3', decimal: '123' }
  ]
}

export function canDeatal (config) {
  const { type, body } = config
  if (type === 'POST') {
    let edit = JSON.parse(body)
    edit.map(diff => {
      data.list.map(item => {
        if (item.detailId === diff.detailId) {
          item.supplement = diff.supplement
          item.showFlg = diff.showFlg
        }
      })
    })
    return edit.length
  }
  const { showFlg } = param2Obj(config.url)
  let result = data
  if (showFlg) {
    result.list = data.list.filter(item => {
      return item.showFlg === showFlg
    })
  }
  return result
}
