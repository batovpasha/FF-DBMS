'use strict';

const ItemSchema = require('./item.js').ItemSchema;
const Item = require('./item.js').Item;
const HashSpace = require('./hash-space.js').HashSpace;
const SearchTree = require('./search_tree.js').SearchTree;

const crypto = require('crypto');

// a class that describes the structure and behavior of the collection
class Collection { 
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
  // a function that generates a hash value for a given key
  createHash(key, password) {
    const cipher = crypto.createCipher('aes192', password);

    const hash = cipher.update(key, 'utf8', 'hex') + cipher.final('hex');
    return hash;
  }
  // method of inserting an element into a hash table
  insert(item, password) {
    if (this.itemSchema.isValid(item)) {
      const key = this.keySchema.reduce((acc, val) => acc += item[val], '');
      const hash = this.createHash(key, password);

      this.hashTable.set(hash, new Item(hash, ++this.numberOfItems, item)); 

      item.id = ++this.numberOfItems; // set id to current item object
      this.searchStructure.insert(item);
    } else console.log("Incorrect item schema!");
  }
  // element by key search method
  findOne(query, password) {
    if (this.itemSchema.isValid(query)) {
      const key = this.keySchema.reduce((acc, val) => acc += query[val], '');
      const hash = this.createHash(key, password);

      return this.hashTable.get(hash).item;
    } else console.log("Incorrect item schema!");
  }
  // a method for finding elements in the structure by pattern
  find(query) {
    if (this.itemSchema.isValid(query)) {
      return this.searchStructure.find(query);
    } else {
      console.log("Incorrect item schema!")
    };
  }
  // method of updating the value according to the given key
  updateItem(item, password) {
    if (this.itemSchema.isValid(item)) {
      let targetItem = this.findOne(item, password);
      this.searchStructure.remove(targetItem);
      Object.keys(item).forEach(key => targetItem[key] = item[key]);
      this.searchStructure.insert(targetItem);
    } else console.log("Incorrect item schema!");
  }
  // creating copy of current collection object
  createCopy() {
    let copy = Object.assign({}, this);
    copy.hashTable = new Object();
    this.hashTable.forEach((value, key) => copy.hashTable[key] = value);
    delete copy.searchStructure;
    return copy;
  }
  // deleting from table of current collection
  deleteFromTable(item, password) {
    const key = this.keySchema.reduce((acc, val) => acc += item[val], '');
    const hash = this.createHash(key, password);
    this.hashTable.delete(hash);
  }
  // deleting from collection
  remove(item, password) {
    let result = this.searchStructure.find(item);
    result.forEach((item) => this.deleteFromTable(item, password));
    this.searchStructure.remove(item);
  }
  // print collection
  print() {
    this.searchStructure.print();
  }
  // clear and refresh current search structure
  drop() {
    this.hashTable.clear();

    if (this.typeOfStruct === 1)
      this.searchStructure = new HashSpace();
    if (this.typeOfStruct === 2)
      this.searchStructure = new SearchTree(this.itemSchema.userFields);
  }
};

module.exports = {
  Collection
};
