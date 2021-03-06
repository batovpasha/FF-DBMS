'use strict';

const Collection = require('./collection.js').Collection;

// a class that implements the structure and logic of the database
class DataBase { 
  constructor(name) {
    this.name = name;
    this.collections = new Map();
  }
  // a method for creating a new collection in the database
  createCollection(name, schema, keys, structType) {
    const collection = new Collection(schema, keys, structType);
    this.collections.set(name, collection);
  }
  // method for accessing(getting) the collection by its name
  getCollection(name) {
    return this.collections.get(name);
  }
  // method for deleting a collection by its name
  dropCollection(name) {
    this.collections.delete(name);
  }
  // a method for obtaining the names of all collections in the database
  getNamesOfCollections() {
    return Array.from(this.collections.keys());
  }
  // creating copies of collections
  createCopy() {
    let copy = Object.assign({}, this);
    copy.collections = new Object();
    this.collections.forEach((value, key) => {
      copy.collections[key] = value.createCopy();
    });
    return copy;
  }
}

module.exports = {
  DataBase
};
