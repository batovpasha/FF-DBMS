'use strict';

class HashSpace { // chaining hash table
  constructor() {
    this.space = new Map();
    this.items = []; // array of all added items(only for print)
  }

  createHash(set) {
    return set.join(''); // return joined set values as hash
  }

  getPowerSet(item) { // get all subsets of item values set
    return Object.values(item).reduce((subsets, value) => {
      return subsets.concat(subsets.map(set => [...set, value]));
    }, [[]]);
  }

  insert(item) {
    this.items.push(item); // add the new maybe not unique item
    // get all subsets of item values set and sort it for correct order
    let itemValuesPowerSet = this.getPowerSet(item).map(set => set.sort());
    itemValuesPowerSet.shift(); // remove empty set
    
    itemValuesPowerSet.forEach(set => {
      // creating the hash
      const hash = item.id.toString() + this.createHash(set); 
      if (!this.space.has(hash)) {       // if space have not items by this hash
        this.space.set(hash, []);        // then create empty chain(array)
        this.space.get(hash).push(item); // then push current item
      } else {
        this.space.get(hash).push(item);
      }
    });
  }
  // deleting item from hash space
  remove(item) {
    let itemValuesPowerSet = this.getPowerSet(item).map(set => set.sort());
    itemValuesPowerSet.shift(); // remove empty set

    itemValuesPowerSet.forEach(set => {
      const hash = this.id.toString() + this.createHash(set);
      if (this.space.has(hash)) {
        this.space.delete(hash);
      } else {
        console.log('There are no such items in the collection!');  
      }
    });
  }

  find(item) {
    // sort object values for correct order
    const hash = this.createHash(Object.values(item).sort()); 
    return this.space.has(hash) 
         ? this.space.get(hash) 
         : null;
  }

  print() {
    console.log([...this.space.values()]);
  }
}

module.exports = {
  HashSpace
};
