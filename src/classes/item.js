'use strict';

class ItemScheme { // a class that contains a schema of user`s objects
  constructor(arrayOfUserFields) {
    this.userFields = arrayOfUserFields.slice();
  }
  
  validityCheck(userObject) { // function to check the pattern match user`s object
    // validity reducer
    const reducer = (acc, key) => acc && this.arrayOfUserFields.includes(key);

    let result = Object.keys(userObject).reduce(reducer, true);
    return result;
  }
};

class Item { // a class that contains a user`s object, its hash and id
  constructor(userObject) {
    this.hash = 0;
    this.id = 0;
    this.item = Object.assign({}, userObject);
  }

  set hash(hash) {
    this.hash = hash;
  }

  get hash() {
    return this.hash;
  }

  set id(id) {
    this.id = id;
  }

  get id() {
    return this.id;
  }

  get item() {
    return this.item;
  }
}
