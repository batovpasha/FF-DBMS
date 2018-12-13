'use strict';

const ItemSchema = require('./item.js').ItemSchema;

class HashSpace { // chaining hash table
  constructor(itemSchema) {
    this.itemSchema = new ItemSchema(Object.keys(itemSchema));
    this.space = new Map();
    this.items = new Array(); // array of all added items
  }

  createHash(set) {
    return set.join(''); // return joined set values as hash
  }

  getPowerSet(item) { // get all subsets of item values set
    return Object.values(item).reduce((subsets, value) => {
      return subsets.concat(subsets.map(set => [...set, value])) 
    }, [[]]);
  }

  insert(item) {
    if (this.itemSchema.validityCheck(item)) {
      this.items.push(item); // add the new maybe not unique item
      // get all subsets of item values set and sort it for correct order
      let itemValuesPowerSet = this.getPowerSet(item).map(set => set.sort());
      itemValuesPowerSet.shift(); // remove empty set

      itemValuesPowerSet.forEach(set => {
        const hash = this.createHash(set);
        if (!this.space.has(hash)) {       // if space have not items by this hash
          this.space.set(hash, []);        // then create empty chain(array)
          this.space.get(hash).push(item); // then push current item
        } else {
          this.space.get(hash).push(item);
        }
      });
    } else console.log('Incorrect schema!');
  }

  find(item) {
    const hash = this.createHash(Object.values(item).sort()); // sort object values for correct order 

    return this.space.has(hash) ? this.space.get(hash) : null; 
  }

  print() {
    console.log(this.items);
  }
}

module.exports = { 
  HashSpace 
};
