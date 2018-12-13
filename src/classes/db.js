'use strict';

const Collection = require('./collection.js').Collection;

class DataBase { // a class that implements the structure and logic of the database
  constructor(name) {
    this.name = name;
    this.collections = new Map();
  }
  // a method for creating a new collection in the database
  createCollection(nameOfCollection, schemaOfCollection, keyOfCollection, option) {
    this.collections.set(nameOfCollection, new Collection(schemaOfCollection, keyOfCollection, option));
  }

  getCollection(nameOfCollection) { // method for accessing(getting) the collection by its name
    return this.collections.get(nameOfCollection);
  }

  deleteCollection(nameOfCollection) { //  method for deleting a collection by its name
    this.collections.delete(nameOfCollection);
  }

  getNamesOfCollections() { // a method for obtaining the names of all collections in the database
    return Array.from(this.collections.keys());
  }
}

// let db = new DataBase('Users');
//
// db.createCollection('admins', ['name', 'surname', 'age'], ['name']);
// db.createCollection('workers', ['name', 'surname', 'age'], ['name', 'surname']);
//
// let currCollection = db.getCollection('admins');
//
// let item = {
//   name: 'Peter',
//   surname: 'Digger',
//   age: 23
// }
//
// currCollection.insertItem(item, 'password');
//
// console.dir(db.getNamesOfCollections());
