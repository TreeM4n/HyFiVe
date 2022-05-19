/** InfluxDB v2 URL */
const url = process.env['INFLUX_URL'] || '10.11.180.23:8086'
/** InfluxDB authorization token */
const token = process.env['INFLUX_TOKEN'] || 'username:password'
/** Organization within InfluxDB  */
const org = process.env['INFLUX_ORG'] || '-'
/**InfluxDB bucket used in examples  */
const bucket = 'hyfiveautogen'
// ONLY onboarding example
/**InfluxDB user  */
const username = 'admin'
/**InfluxDB password  */
const password = 'hyfive0815'

module.exports = {
  url,
  token,
  org,
  bucket,
  username,
  password,
}