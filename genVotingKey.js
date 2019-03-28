const PouchDB = require('pouchdb');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;  

const csvWriter = createCsvWriter({  
  path: 'votingKeys.csv',
  header: [
    {id: 'url', title: 'URL'},
  ]
});
const account = 'be8a3d9c-c44b-431c-9a32-69389efeb85a-bluemix';
const apiKey = 'fintsprockekstructingene';
const apiPassword = '6ac6e4c44eed1df7a43e9351911968f78a29c446';

const baseUrl = `https://${apiKey}:${apiPassword}@${account}.cloudant.com/voting-keys`;
const db = new PouchDB(baseUrl);

const genKey = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  let key = '';
  for (let i = 0; i < length; i++) {
    key += possible[ Math.floor(Math.random() * possible.length) ];
  }

  return key;
}

let votingKeys = [];
const putDb = async () => {
  for (let i = 1; i <= 500; i++) {
    const webUrl = 'https://make.ntuee.org/pop-prize/';
    const key = genKey(16);
    votingKeys.push({
      url: webUrl + key
    });
    await db.put({
      _id: key,
      key: key
    }).then((res) => {
      console.log(`key ${i} success`);
    }).catch((err) => {
      console.log(err);
    });
  }
};

putDb().then(() => {
  csvWriter.writeRecords(votingKeys)
    .then(() => console.log('The CSV file was written successfully'));
});
