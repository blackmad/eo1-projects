const inquirerCredentials = require('inquirer-credentials');

const username = {
  name: 'username',
  type: 'input',
  hint: 'please, tell your username',
  env: 'USERNAME' // uses process.env['USERNAME'] if exists and don't ask user
};

const password = {
  name: 'password',
  type: 'password',
  env: 'PASSWORD' // uses process.env['PASSWORD'] if exists and don't ask user
};

const creds = inquirerCredentials('.eo');

creds
  .run([username, password])
  .then(function(result) {
    result.data //=> { username: 'string', password: 'string' }
    result.save() // persists config to fs, result is an instance of https://github.com/ewnd9/dot-file-config

    Object.keys(creds.config.data) //=> ['username', 'password']

    let eo = require('electric-objects')
    let client = eo(creds.config.data.username, creds.config.data.password)
    let setUrl = client.setUrl(process.argv[2])

    setUrl.then(() => console.log('Frame updated!'))
  })
  .catch(function(err) {
    console.log(err.stack || err);
  });


