import { influxConnect } from '../config/db.js';

const influxClient = influxConnect();
const writeApi = influxClient.getWriteApi(process.env.INFLUX_ORG, process.env.INFLUX_BUCKET);

export const writeSensorData = async (data) => {
  try {
    writeApi.writePoint(data);
    await writeApi.flush();
    console.log('Data written to InfluxDB');
  } catch (err) {
    console.error('Error writing to InfluxDB:', err.message);
  }
};

export const querySensorData = async (query) => {
  const queryApi = influxClient.getQueryApi(process.env.INFLUX_ORG);
  const result = [];
  try {
    const rows = queryApi.queryRows(query, {
      next(row, tableMeta) {
        const obj = tableMeta.toObject(row);
        result.push(obj);
      },
      error(err) {
        console.error('Error querying InfluxDB:', err.message);
      },
      complete() {
        console.log('Query completed.');
      },
    });
    return result;
  } catch (err) {
    console.error('Query Error:', err.message);
    throw err;
  }
};
