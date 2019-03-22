const PouchDB = require('pouchdb');
const MD5 = require('blueimp-md5');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;  

const csvWriter = createCsvWriter({  
  path: 'pwdList.csv',
  header: [
    {id: 'team_id', title: 'Team ID'},
    {id: 'password', title: 'Password'}
  ]
});
const account = 'be8a3d9c-c44b-431c-9a32-69389efeb85a-bluemix';
const apiKey = 'ondentindpreencirsessiva';
const apiPassword = 'af0ccb951bf7acd1c87ac31a47c592a4462924fe';

const baseUrl = `https://${apiKey}:${apiPassword}@${account}.cloudant.com/passwords`;
const db = new PouchDB(baseUrl);

const genPwd = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  let pwd = '';
  for (let i = 0; i < length; i++) {
    pwd += possible[ Math.floor(Math.random() * possible.length) ];
  }

  return pwd;
}

let pwdList = [];
for (let i = 1; i <= 50; i++) {
  const pwd = genPwd(8);
  pwdList.push({
    team_id: (i < 10 ? `team_0${i}` : `team_${i}`),
    password: pwd
  });
  setTimeout(() => { // Database requests per sec limit
    db.put({
      _id: (i < 10 ? `team_0${i}` : `team_${i}`),
      team_id: (i < 10 ? `team_0${i}` : `team_${i}`),
      md5_password: MD5(pwd)
    }).then(function (response) {
      console.log(`team ${i} success`);
    }).catch(function (err) {
      console.log(err);
    });
  }, i * 300)
}

csvWriter.writeRecords(pwdList)
  .then(() => console.log('The CSV file was written successfully'));
