'use strict';

const DataBase = require('./db.js').DataBase;
const Collection = require('./collection.js').Collection;

const fs = require('fs');
const crypto = require('crypto');

class FSW {
  constructor(dbms, file) { 
    this.dbms = dbms;
    this.file = file;
  }
  // a method that generates a hash value for a given key
  createHash(key, password) { 
    const cipher = crypto.createCipher('aes192', password);

    const hash = cipher.update(key, 'utf8', 'hex') + cipher.final('hex');
    return hash;
  }
  // method for saving to file
  saveToFile() {
    return new Promise((resolve, reject) => {
      const data = this.createHash(this.dbms.createCopy(), 'FF-DBMS');
      fs.writeFile(this.file, data, (err) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }
  // fill collection by items
  fillCollection(collection, items, password) {
    for (let key in items) {
      collection.insert(items[key]._item, password);
    }
  }
  // method for collections creating
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
  // creating databases
  createDatabases(databases, password) {
    let result = new Map();
    for (let key in databases) {
      let db = new DataBase(key);
      db.collections = this.createCollections(databases[key].collections, password);
      result.set(key, db);
    }
    return result;
  }
  // method for decrypting
  decryptHash(hash, password) {
    const decipher = crypto.createDecipher('aes192', password);
    let data = decipher.update(hash, 'hex', 'utf8') + decipher.final('utf8');
    return data;
  }
  // loading data from file
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
