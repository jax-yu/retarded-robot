import dbConfig from '../../config/db'
const mysql = require('mysql')

export let connection: any

export interface JobInfoType {
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
        console.log('连接失败')
      } else {
        console.log('连接成功')
      }
    })
  },
  async queryJobByCity (city: string): Promise<JobInfoType[]> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM job_info WHERE city = '${city}'`
      connection.query(sql, (err: any, result: any) => {
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
