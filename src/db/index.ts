import dbConfig from '../../config/db'
const mysql = require('mysql')

export let connection: any

interface JobInfoType {
  id: string;
  city: string;
  'job_content': string;
  'age_start': number;
  'age_end': number;
  sex: string;
}

export const db = {
  open () {
    connection = mysql.createConnection(dbConfig)
    connection.connect((err: any) => {
      if (err) {
        console.log('sql connection failure')
      } else {
        console.log('sql connection successful')
      }
    })
  },
  async queryJobByCity (city: string): Promise<JobInfoType[]> {
    const sql = `SELECT * FROM job_info WHERE city = '${city}'`
    return this.sqlQuery<JobInfoType[]>(sql)
  },
  async sqlQuery<T> (...sql: string[]): Promise<T> {
    return new Promise((resolve, reject) => {
      connection.query(...sql, (err: any, result: any) => {
        if (err) {
          reject(new Error(err))
        }
        resolve(result)
      })
    })
  },
  close () {
    if (connection !== null) {
      connection.end()
    }
  }
}
