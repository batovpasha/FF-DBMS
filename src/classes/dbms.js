'use strict';

const DataBase = require('./db.js').DataBase;
const FSW = require('./fsw.js').FSW;

/*
  DBMS is singleton class
*/
class DBMS {
  constructor() {
    this.fsw = new FSW(this, './db.ff');
    try {
      console.log('Load from file');
      this.fsw.loadFromFile();
    } catch (e) {
      console.log(e);
      console.log('New DBMS');
      this.identificationData = new Map();
    }
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

  hasDatabase(database, login) {
    if (this.identificationData.get(login).databases.has(database)) {
      return true;
    } else {
      console.log(`This client has not ${database} database`);
      return false;
    }
  }

  createDatabase(name, login) {
    const database = new DataBase(name);
    this.identificationData.get(login).databases.set(name, database);
  }

  dropDatabase(name, login) {
    if (this.hasDatabase(name, login)) {
      this.identificationData.get(login).databases.delete(name);
    }
  }

  createCollection(database, collection, schema, keys, structType, login) { 
    if (this.hasDatabase(database, login)) {
      const db = this.identificationData.get(login).databases.get(database);
      db.createCollection(collection, schema, keys, structType);
    }
  }

  dropCollection(database, collection, login) { 
    if (this.hasDatabase(database, login)) {
      const db = this.identificationData.get(login).databases.get(database);
      db.dropCollection(collection);
    }
  }

  showDatabases(login) { 
    // get list with all database names
    const list = [...this.identificationData.get(login).databases.keys()];
    console.log(list);
  }

  showCollections(database, login) { 
    if (this.hasDatabase(database, login)) {
      const db = this.identificationData.get(login).databases.get(database);
      console.log(db.getNamesOfCollections());
    }
  }

  find(query, database, collection, login) { 
    if (this.hasDatabase(database, login)) {
      const db = this.identificationData.get(login).databases.get(database);
      console.log(db.getCollection(collection).find(query));
    }
  }

  insert(query, database, collection, login, password) {
    if (this.hasDatabase(database, login)) {
      const db = this.identificationData.get(login).databases.get(database);
      return db.getCollection(collection).insert(query, password);
    }
  }

  updateItem(query, database, collection, login, password) {
    if (this.hasDatabase(database, login)) {
      const db = this.identificationData.get(login).databases.get(database);
      return db.getCollection(collection).updateItem(query, password);
    }
  }

  findOne(query, database, collection, login, password) {
    if (this.hasDatabase(database, login)) {
      const db = this.identificationData.get(login).databases.get(database);
      const result = db.getCollection(collection).findOne(query, password);
      console.log(result);
    }
  }

  printCollection(database, collection, login) {
    if (this.hasDatabase(database, login)) {
      const db = this.identificationData.get(login).databases.get(database);
      db.getCollection(collection).print();
    }
  }

  createCopy() {
    let copy = new Object();
    copy.identificationData = new Object();
    this.identificationData.forEach((value, key) => {
      copy.identificationData[key] = new Object();
      copy.identificationData[key].password = value.password;
      copy.identificationData[key].databases = new Object();
      
      value.databases.forEach((value_db, key_db) => {
        copy.identificationData[key].databases[key_db] = value_db.createCopy();
      });
    });
    return JSON.stringify(copy);
  }

  remove(query, database, collection, login) {
    if (this.hasDatabase(database, login)) {
      const db = this.identificationData.get(login).databases.get(database);
      db.getCollection(collection).remove(query);
    }
  }

  exit() {
    this.fsw.saveToFile();
  }
};

const dbms = new DBMS();

module.exports = {
  dbms
};
