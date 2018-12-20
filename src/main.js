'use strict';

const Client = require('./classes/client.js').Client;
const dbms = require('./classes/dbms.js').dbms;

const readline = require('readline');

// readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// promise for sync getting login and password from user
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

// fn for printing user instruction
const help = () => { 
  console.log('\n<<Instruction for FF-DBMS>>');
  const manual = 'Options: \n' +
                 '\'exit\' - to exit from dbms; \n' +
                 '\'change client\' - to change client; \n\n' +

                 'createDatabase - to create database \n' +
                 'example: "createDatabase", "name_of_db" \n\n' +

                 'dropDatabase - to drop database \n' +
                 'example: "dropDatabase", "name_of_db" \n\n' +

                 'showDatabases - to show all databases \n' +
                 'example: "showDatabases" \n\n' +

                 'createCollection - to create collection in database (information schema in ' +
                 'first array, key schema in second array, type of search struct as last parameter(tree-1, hashSpace-2)) \n' +
                 'example: "createCollection", "name_of_db", "name_of_collection", ["field1", "field2"], ["field"], 1 \n\n' +

                 'dropCollection - to drop collection in database \n' +
                 'example: "dropCollection", "name_of_db", "name_of_collection" \n\n' +

                 'showCollections - to show all collections in database \n' +
                 'example: "showCollections", "name_of_db" \n\n' +

                 'printCollection - to print all items in current collection \n' +
                 'example: "printCollection", "name_of_db", "name_of_collection" \n\n' +

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
// fn for parsing user input
const parseQuery = (input) => {
  try {
    return JSON.parse('[' + input + ']');
  } catch(e) {
    console.log("Incorrect syntax!")
    return [];
  }
};
// input commands handling
const commandsHandling = (client) => {
  rl.question('=> ', (input) => {
    if (input === '--help') {
      help();
      return commandsHandling(client);
    }

    if (input === 'exit') {
      rl.close();
      dbms.exit();
      console.log('Good luck!');
      return;
    }

    else if (input === 'change client') {
      return start();
    }

    else {
      client.query(...parseQuery(input));
      return commandsHandling(client);
    }
  });
};

const client = (resultOfSigning) => {
  console.log('Hello, ' + resultOfSigning.login + '!');

  let client = new Client(...(Object.values(resultOfSigning)));

  if (!client.connect(dbms)) {
    console.log('Try again!');
    setTimeout(() => start(), 2000); // 2 seconds for incorrect password message
    return;
  }

  console.log("Enter '--help' to get help \n");
  return commandsHandling(client);
};
// starting function
const start = () => {
  process.stdout.write('\u001B[2J\u001B[0;0f');

  const greetings = '<<FOR FUN DATABASE MANAGMENT SYSTEM>>\n' +
                  'Welcome!\n' +
                  'Sign in to continue';
  console.log(greetings);

  return login().then((resolved) => { client(resolved) });
};

start(); // starting point
