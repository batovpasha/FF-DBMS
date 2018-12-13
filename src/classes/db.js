'use strict';

const Collection = require('./collection.js').Collection;

class DataBase { // a class that implements the structure and logic of the database
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
  deleteCollection(name) { 
    this.collections.delete(name);
  }
  // a method for obtaining the names of all collections in the database
  getNamesOfCollections() { 
    return Array.from(this.collections.keys());
  }
}

// let db = new DataBase('Users');

// db.createCollection('admins', ['name', 'surname', 'age'], ['name'], 1);
// db.createCollection('workers', ['name', 'surname', 'age'], ['name', 'surname'], 1);

// let currCollection = db.getCollection('admins');

// let item = {
//   name: 'Peter',
//   surname: 'Digger',
//   age: 23
// }

// currCollection.insert(item, 'password');

// console.dir(db.getNamesOfCollections());

module.exports = {
  DataBase
};