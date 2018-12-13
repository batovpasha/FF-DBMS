'use strict';

const ItemSchema = require('./item.js').ItemSchema;
const Item = require('./item.js').Item;
const HashSpace = require('./hash-space.js').HashSpace;
const SearchTree = require('./search_tree.js').SearchTree;

const crypto = require('crypto');

class Collection { // a class that describes the structure and behavior of the collection
  constructor(itemSchema, keySchema, typeOfStruct) {
    this.itemSchema = new ItemSchema(itemSchema);
    this.keySchema = keySchema;
    this.typeOfStruct = typeOfStruct;
    this.hashTable = new Map();
    this.numberOfItems = 0;

    if (typeOfStruct === 1)
      this.searchStructure = new HashSpace();
    if (typeOfStruct === 2)
      this.searchStructure = new SearchTree(this.itemSchema.userFields);
  }

  createHash(key, password) { // a function that generates a hash value for a given key
    const cipher = crypto.createCipher('aes192', password);

    const hash = cipher.update(key, 'utf8', 'hex') + cipher.final('hex');
    return hash;
  }

  insert(item, password) { // method of inserting an element into a hash table
    if (this.itemSchema.validityCheck(item)) {
      const key = this.keySchema.reduce((acc, val) => acc += item[val], '');
      const hash = this.createHash(key, password);

      this.hashTable.set(hash, new Item(hash, ++this.numberOfItems, item));
      this.searchStructure.insert(item);
    } else console.log("Incorrect item schema!");
  }

  findOne(query, password) { // element by key search method
    if (this.itemSchema.validityCheck(query)) {
      const key = this.keySchema.reduce((acc, val) => acc += query[val], '');
      const hash = this.createHash(key, password);

      return this.hashTable.get(hash).item;
    } else console.log("Incorrect item schema!");
  }

  find(query) { // a method for finding elements in the structure by pattern
    if (this.itemSchema.validityCheck(query)) {
      return this.searchStructure.find(query);
    } else console.log("Incorrect item schema!");
  }

  updateItem(item, password) { // method of updating the value according to the given key
    if (this.itemSchema.validityCheck(item)) {
      let targetItem = this.findOne(item, password);

      Object.keys(item).forEach(key => targetItem[key] = item[key]);
    } else console.log("Incorrect item schema!");
  }

  drop() { // method of cleaning the collection
    this.hashTable.clear();

    if (this.typeOfStruct === 1)
      this.searchStructure = new HashSpace();
    if (this.typeOfStruct === 2)
      this.searchStructure = new SearchTree(this.itemSchema.userFields);
  }
};

/* ---EXAMPLES--- */

// let col = new Collection(['name', 'surname', 'age'], ['name', 'surname'], 1);

// let item = {
//   name: 'Peter',
//   surname: 'Digger',
//   age: 23
// };

// col.insert(item, 'password');

// console.dir(col.findOne(item, 'password'));
// console.dir(col.find({surname: 'Digger'}));
// console.dir(col.find({surname: 'Diger'}));

// console.dir(col);

// col.drop();

// console.dir(col);

module.exports = {
  Collection
};
