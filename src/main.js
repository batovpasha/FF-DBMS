'use strict';

const Client = require('./classes/client.js').Client;
const dbms = require('./classes/dbms.js').dbms;

const readline = require('readline');
const fs = require('fs');

const readManual = async () => {
  const data = await fs.promises.readFile('./manual.txt'); 
  return data.toString();
};

// readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// promise for sync getting login and password from user
const login = () => {
  return new Promise((resolve, reject) => {
    try {
      rl.question('Login: ', (input) => {
        let result = { login: input };
        rl.question('Password: ', (input) => {
          result.password = input;
          resolve(result);
        });
      });
    } catch(err) {
      reject(err);     
    }
  });
};

// fn for printing user instruction
const help = async () => { 
  const manual = await readManual(); 
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
const start = async () => {
  process.stdout.write('\u001B[2J\u001B[0;0f');

  const greetings = '<<FOR FUN DATABASE MANAGMENT SYSTEM>>\n' +
                  'Welcome!\n' +
                  'Sign in to continue';
  console.log(greetings);

  await login().catch((err) => console.log(err))
               .then((resolved) => { client(resolved) })
               .catch((err) => console.log(err));
};

readManual();
start(); // starting point
