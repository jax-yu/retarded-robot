import dbConfig from '../../config/db'
const mysql = require('mysql')

let pool: any

interface JobInfoType {
  id: string;
  city: string;
  'job_content': string;
  'age_start': number;
  'age_end': number;
  sex: string;
}

export const db = {
  createMysqlPool () {
    pool = mysql.createPool(dbConfig)
  },
  async queryJobByCity (city: string): Promise<JobInfoType[]> {
    const sql = `SELECT * FROM job_info WHERE city = '${city}'`
    return this.sqlQuery<JobInfoType[]>(sql)
  },
  async sqlQuery<T> (...sql: string[]): Promise<T> {
    return new Promise((resolve, reject) => {
      pool.getConnection((err: any, connection: any) => {
        if (err) {
          reject(new Error(err))
        } else {
          connection.query(...sql, (sqlErr: any, result: any) => {
            if (sqlErr) {
              reject(new Error(sqlErr))
            }
            resolve(result)
            connection.release()
          })
        }
      })
    })
  }
}
