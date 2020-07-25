import emailConfig from '../../config/email'

const imaps = require('imap-simple')
const simpleParser = require('mailparser').simpleParser

const config = {
  imap: emailConfig
}

export interface EmailUserInfo {
  name?: string;
  age?: number;
  sex?: string;
  phone?: number;
}

interface EmailBodyType {
  'delivered-to': string[]
  'received': string[]
  'x-google-smtp-source': string[]
  'x-received': string[]
  'arc-seal': string[]
  'arc-message-signature': string[]
  'arc-authentication-results': string[]
  'return-path': string[]
  'received-spf': string[]
  'authentication-results': string[]
  'dkim-signature': string[]
  'message-id': string[]
  'x-binding': string[]
  'x-elqsiteid': string[]
  'x-elqpod': string[]
  'x-cid': string[]
  'list-unsubscribe': string[]
  'mime-version': string[]
  'from': string[] // send address ['"The Progress Team" <email address>']
  'to': string[]
  'reply-to': string[]
  'date': string[]
  'subject': string[]
  'content-type': string[]
}

interface EmailType {
  which: string,
  size: number,
  body: EmailBodyType
}

interface EmailWrapType {
    attributes: {
        date: Date,
        flags: [],
        uid: number,
        modseq: string,
        'x-gm-labels': [],
        'x-gm-msgid': string,
        'x-gm-thrid': string
    },
    parts: EmailType[],
    seqNo: number
}

interface EmailConnectionType {
  openBox: (arg0: string) => Promise<any>;
  search: (arg0: string[], arg1: { bodies: string[] }) => Promise<any>;
  deleteMessage(uid: number): void;
}

const fetchEmail = (): Promise<EmailUserInfo> => {
  return new Promise((resolve, reject) => {
    try {
      imaps.connect(config).then(function (connection: EmailConnectionType) {
        connection.openBox('INBOX').then(function () {
          // Fetch new email
          const searchCriteria = ['NEW']
          const fetchOptions = {
            bodies: ['']
          }
          connection.search(searchCriteria, fetchOptions).then(function (results: EmailWrapType[]) {
            results.forEach(async (item) => {
              // const all = item.parts.find((mItem): boolean => mItem.which === 'TEXT')
              const parsed = await simpleParser(item.parts[0].body)
              const nameRegExp = parsed.text.match(/(.+)（/g, '')[1]
              connection.deleteMessage(item.attributes.uid)
              resolve({
                name: nameRegExp.substr(0, nameRegExp.length - 1),
                age: Number(parsed.text.match(/（(.+)）/g, '')[1].substr(3, 2)),
                sex: parsed.text.match(/（(.+)）/g, '')[1].substr(1, 1),
                phone: Number(parsed.text.replace(/[^0-9]/ig, '').substr(13, 11))
              })
            })
          })
        })
      })
    } catch (e) {
      reject(e)
    }
  })
}

export default fetchEmail
