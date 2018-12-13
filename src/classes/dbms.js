'use strict';

const DataBase = require('./db.js').DataBase;

class DBMS {
  constructor() {
    this.identificationData = new Map();
  }

  connect(login, password) {
    if (this.identificationData.has(login) && 
        this.identificationData.get(login).password === password) 
      return this;
    
    else if (this.identificationData.has(login) &&
             this.identificationData.get(login).password !== password) {
      console.log('Incorrect password!');
      return null;
    }

    else {
      this.identificationData.set(login, { password, databases: new Map() });
      return this;
    }
  }

  createDatabase(name, login, password) {
    if (this.identificationData.has(login) && 
        this.identificationData.get(login).password === password) {
      const database = new DataBase(name);
      this.identificationData.get(login).databases.set(name, database);
    }
    
    else if (this.identificationData.has(login) && 
             this.identificationData.get(login).password !== password) {
      console.log('Incorrect password!');
      return;
    }

    else return;
  }

  dropDatabase(name, login, password) {
    if (this.identificationData.has(login) && 
        this.identificationData.get(login).password === password) {
      
      if (this.identificationData.get(login).databases.has(name)) {
        this.identificationData.get(login).databases.delete(name);
        return;
      }
      
      else if (!this.identificationData.get(login).databases.has(name)) {
        console.log(`This client has not ${name} database`);
        return;
      }
    }
    
    else if (this.identificationData.has(login) && 
             this.identificationData.get(login).password !== password) {
      console.log('Incorrect password!');
      return;
    }

    else return;    
  }

  createCollection(database, collection, schema, keys, structType, login, password) {
    if (this.identificationData.has(login) && 
        this.identificationData.get(login).password === password) {
      
      if (this.identificationData.get(login).databases.has(database)) {
        let db = this.identificationData.get(login).databases.get(database);
        db.createCollection(collection, schema, keys, structType);
        return;
      }

      else if (!this.identificationData.get(login).databases.has(database)) {
        console.log(`This client has not ${databaseName} database`);
        return;
      }
    }
    
    else if (this.identificationData.has(login) && 
             this.identificationData.get(login).password !== password) {
      console.log('Incorrect password!');
      return;
    }

    else return;    
  }

  find(query, database, collection, login, password) { // database and table names
    if (this.identificationData.get(login) === password) {
    
    }
  }

  print() {
    console.log(this.identificationData);
  }
};

let dbms = new DBMS();

dbms.connect('Pasha', '12345');
dbms.createDatabase('users', 'Pasha', '12345');
dbms.print();
dbms.createCollection('users', 'sd', ['name', 'surname', 'age'], ['name', 'surname'], 1, 'Pasha', '12345');