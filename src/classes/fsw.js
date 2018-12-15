'use strict'

const DataBase = require('./db.js').DataBase;
const Collection = require('./collection.js').Collection;

const fs = require('fs');
const crypto = require('crypto');

class FSW {
  constructor(dbms, file) { 
    this.dbms = dbms;
    this.file = file;
  }

  createHash(key, password) { // a function that generates a hash value for a given key
    const cipher = crypto.createCipher('aes192', password);

    const hash = cipher.update(key, 'utf8', 'hex') + cipher.final('hex');
    return hash;
  }

  saveToFile() {
    fs.writeFileSync(this.file, this.createHash(this.dbms.createCopy(), 'FF-DBMS'));
  }

  fillCollection(collection, items, password) {
    for (let key in items) {
      collection.insert(items[key]._item, password);
    }
  }

  createCollections(collections, password) {
    let result = new Map();
    for (let key in collections) {
      let itemSchema = collections[key].itemSchema.userFields;
      let keySchema = collections[key].keySchema;
      let typeOfStruct = collections[key].typeOfStruct;
      let col = new Collection(itemSchema, keySchema, typeOfStruct);
      this.fillCollection(col, collections[key].hashTable, password);
      result.set(key, col);
    }
    return result;
  }

  createDatabases(databases, password) {
    let result = new Map();
    for (let key in databases) {
      let db = new DataBase(key);
      db.collections = this.createCollections(databases[key].collections, password);
      result.set(key, db);
    }
    return result;
  }

  decryptHash(hash, password) {
    const decipher = crypto.createDecipher('aes192', password);
    let data = decipher.update(hash, 'hex', 'utf8') + decipher.final('utf8');
    return data;
  }

  loadFromFile() {
    let dbms = this.dbms;
    let hash = fs.readFileSync(this.file).toString();
    let data = JSON.parse(this.decryptHash(hash, 'FF-DBMS'));
    dbms.identificationData = new Map();

    for (let key in data.identificationData) {
      let value = data.identificationData[key];
      let newValue = new Object();

      newValue.password = value.password;
      newValue.databases = this.createDatabases(value.databases, value.password);

      dbms.identificationData.set(key, newValue);
    }
  }
}

module.exports = {
  FSW
};
