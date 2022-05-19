#!./node_modules/.bin/ts-node
#!./node_modules/.bin/ts-node



////////////////////////////////////////////////////////////////////
// Shows how to use forward compatibility APIs from InfluxDB 1.8. //
////////////////////////////////////////////////////////////////////
// [InfluxDB 2.0 API compatibility endpoints](https://docs.influxdata.com/influxdb/v1.8/tools/api/#influxdb-2-0-api-compatibility-endpoints)
// are part of the InfluxDB 1.x line since InfluxDB 1.8.0. This allows you to leverage InfluxDB 2.x client libraries for both writing and
// querying data with Flux.
// https://docs.influxdata.com/influxdb/v1.8/about_the_project/releasenotes-changelog/#forward-compatibility

import {ClientOptions, InfluxDB, Point} from '@influxdata/influxdb-client'

const username = 'admin'
const password = 'hyfive0815'

const database = 'hyfive'
const retentionPolicy = 'autogen'

const bucket = `${database}/${retentionPolicy}`

const clientOptions: ClientOptions = {
  url: '10.11.180.23:8086',
  token: `${username}:${password}`,
}

const influxDB = new InfluxDB(clientOptions)
/*
console.log('*** WRITE POINTS ***')

const writeAPI = influxDB.getWriteApi('', bucket)
const point = new Point('mem')
  .tag('host', 'host1')
  .floatField('used_percent', 23.43234543)
writeAPI.writePoint(point)
writeAPI
  .close()
  .then(() => console.log('Write FINISHED'))
  .catch(error => {
    console.error(error)
  })
*/
console.log('*** QUERY ROWS ***')

const queryAPI = influxDB.getQueryApi('')
const query = `from(bucket: "${bucket}") |> range(start: -1h)`

queryAPI.queryRows(query, {
  next: (row, tableMeta) => {
    const o = tableMeta.toObject(row)
    console.log(`${o.Time} ${o.TSYTemperatrue}`)
  },
  error: (error: Error) => {
    console.error(error)
  },
  complete: () => {
    console.log('\nQuery FINISHED')
  },
})