const PouchDB = require('pouchdb');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;  
const fs = require('fs')

const account = 'be8a3d9c-c44b-431c-9a32-69389efeb85a-bluemix';
const apiKey = 'cialkeetedegreschistreff';
const apiPassword = '331d19fc171716a55741fa0876f12af722a8ceae';

const baseUrl = `https://${apiKey}:${apiPassword}@${account}.cloudant.com/corp-prize`;
const db = new PouchDB(baseUrl);
PouchDB.plugin(require('pouchdb-find'));  

let corpList = [];
const fetchDb = async () => {
  await db.allDocs({include_docs: true})
    .then((res) => res.rows[0].doc)
    .then((data) => {
      corpList = data['corp_prize'];
    })
    .catch((err) => {
      console.log(err);
    });
};

const corpNames = [
  '國泰',
  '聯發科',
  '玉山',
  '中華電信',
  '意法',
  '遠傳'
]

fetchDb().then(() => {
  fs.writeFileSync('corpResult.txt', corpNames[0] + ': ');
  fs.appendFileSync('corpResult.txt', corpList[0] + '\n');
    for (let i = 1; i < 6; i++) {
      fs.appendFileSync('corpResult.txt', corpNames[i] + ': ');
      fs.appendFileSync('corpResult.txt', corpList[i] + '\n');
  }
});
