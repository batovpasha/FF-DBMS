'use strict';

const Client = require('./client.js').Client;
const DBMS = require('./dbms.js').dbms;
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const login = () => {
  return new Promise((resolve, reject) => {
    rl.question('Login: ', (input) => {
      let result = { login: input };
      rl.question('Password: ', (input) => {
        result['password'] = input;
        resolve(result);
      });
    });
  });
};

const help= () => {
  console.log('\n<<Instruction for FF-DBMS>>');
  const manual = 'Options: \n' +
                 'exit - to exit from dbms; \n' +
                 'change user - to change user; \n\n' +

                 'createDatabase - to create database \n' +
                 'example: "createDatabase", "name_of_db" \n\n' +

                 'dropDatabase - to drop database \n' +
                 'example: "dropDatabase", "name_of_db" \n\n' +

                 'showDatabases - to show all databases \n' +
                 'example: "showDatabases" \n\n' +

                 'createCollection - to create collection in database (information schema in ' +
                 'first array, key schema in second array, type of search struct as last parametr) \n' +
                 'example: "createCollection", "name_of_db", "name_of_collection", ["field1", "field2"], ["field"], 1 \n\n' +

                 'dropCollection - to drop collection in database \n' +
                 'example: "dropCollection", "name_of_db", "name_of_collection" \n\n' +

                 'showCollections - to show all collections in database \n' +
                 'example: "showCollections", "name_of_db" \n\n' +

                 'insert - to insert item into collection\n' +
                 'example: "insert", {"field1": "value1", "field2": "value2"}, "name_of_db", "name_of_collection" \n\n' +

                 'update - to update item in collection\n' +
                 'example: "update", {"field1": "value1", "field2": "value2"}, "name_of_db", "name_of_collection" \n\n' +

                 'find - to find items in collection by pattern\n' +
                 'example: "find", {"field1": "value1", "field2": "value2"}, "name_of_db", "name_of_collection" \n\n' +

                 'findOne - to find item in collection by key\n' +
                 'example: "findOne", {"field1": "value1", "field2": "value2"}, "name_of_db", "name_of_collection" \n\n' +

                 'remove - to remove item in collection by pattern\n' +
                 'example: "remove", {"field1": "value1", "field2": "value2"}, "name_of_db", "name_of_collection" \n\n';

  console.log(manual);
};

const parseQuery = (input) => JSON.parse('[' + input + ']');

const commandsHandling = (client) => {
  rl.question('=> ', (input) => {
    if (input === '-help') {
      help();
      return commandsHandling(client);
    }

    if (input === 'exit') {
      rl.close();
      DBMS.exit();
      console.log('Good luck!');
      return;
    }

    else if (input === 'change client') {
      return start();
    }

    else {
      client.query(...parseQuery(input));
      return  commandsHandling(client);
    }
  });
};

const client = (resultOfSigning) => {
  console.log('Hello, ' + resultOfSigning.login + '!');

  let client = new Client(...(Object.values(resultOfSigning)));
  client.connect(DBMS);

  console.log("Enter -help to get help \n");
  return commandsHandling(client);
};

// rl.question('Enter text: ', (input) => {
//   console.log(input);
//   rl.close();
// })

const start = () => {
  process.stdout.write('\u001B[2J\u001B[0;0f');
  let greetings = '<<FOR FUN DATABASE MANAGMENT SYSTEM>>\n' +
                  'Welcome!\n' +
                  'Sign in to continue';
  console.log(greetings);

  let sign = {};
  return login().then((resolved) => { client(resolved) });
  //setTimeout(() => console.dir(sign), 1000);
  // rl.close();
  // console.dir(sign);
}

start();

//login('Login: ').then((resolved) => {login('Password: ')});
