const ItemSchema = require('./item.js').ItemSchema;
const Item = require('./item.js').Item;
const crypto = require('crypto');

class Collection { // a class that describes the structure and behavior of the collection
  constructor(itemSchema, keySchema) {
    this.itemSchema = new ItemSchema(itemSchema);
    this.keySchema = keySchema;
    this.hashTable = new Map();
    this.numberOfItems = 0;
  }

  createHash(key, password) { // a function that generates a hash value for a given key
    const cipher = crypto.createCipher('aes192', password);
   
    let hash = cipher.update(key, 'utf8', 'hex') + cipher.final('hex');
    return hash;
  }

  insertItem(item, password) { // method of inserting an element into a hash table
    if (this.itemSchema.validityCheck(item)) {
      let key = '';

      this.keySchema.forEach(i => key += item[i].toString());
      
      let hash = this.createHash(key, password);
      this.hashTable.set(hash, new Item(hash, ++this.numberOfItems, item));
    }
  }

  findItem(query, password) { // element by key search method
    let key = '';
    
    for (let i of this.keySchema) 
      key += item[i].toString();

    let hash = this.createHash(key, password);
    return this.hashTable.get(hash).item;
  }

  updateItem(item, password) { // method of updating the value according to the given key
    if (this.itemSchema.validityCheck(item)) {
      let targetItem = this.findItem(item, password);

      Object.keys(item).forEach(key => targetItem[key] = item[key]);
    }
  }

  drop() { // method of cleaning the collection
    this.hashTable.clear();
  }
};

// let col = new Collection(['name', 'surname', 'age'], ['name', 'surname']);

// let item = {
//   name: 'Peter',
//   surname: 'Digger',
//   age: 23
// }

// col.insertItem(item, 'password');

// console.dir(col.findItem(item, 'password'));

// col.updateItem({name: "c", surname: 'fdsfds', age: 43243}, 'password');

// console.dir(col.findItem(item, 'password'));

// console.dir(col);

// col.drop();

// console.dir(col);
