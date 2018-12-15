'use strict';

class ItemSchema { // a class that contains a schema of user`s objects
  constructor(arrayOfUserFields) {
    this.userFields = arrayOfUserFields.slice();
  }

  validityCheck(userObject) { // function to check the pattern match user`s object
    const keys = Object.keys(userObject);
    const result = keys.every(key => this.userFields.includes(key));
    return result;
  }
};

class Item { // a class that contains a user`s object, its hash and id
  constructor(hash, id, userObject) {
    this._hash = hash;
    this._id = id;
    this._item = Object.assign({}, userObject);
  }

  set hash(hash) {
    this._hash = hash;
  }

  get hash() {
    return this._hash;
  }

  set id(id) {
    this._id = id;
  }

  get id() {
    return this._id;
  }

  set item(item) {
    this._item = item;
  }

  get item() {
    return this._item;
  }
}

module.exports = {
  ItemSchema,
  Item
}
