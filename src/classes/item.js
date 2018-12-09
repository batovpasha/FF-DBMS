'use strict';

class ItemScheme { // a class that contains a schema of user`s objects
  constructor(arrayOfUserFields){
    this.userFields = new Array();
    for (let i of arrayOfUserFields){
      this.userFields.push(i);
    }
  }
  validityCheck(userObject){ // function to check the pattern match user`s object
    let result = true;
    for (let i in userObject){
      result = result && (this.userFields.indexOf(i) == -1 ? false : true);
    }
    return result;
  }
};

class Item { // a class that contains a user`s object, its hash and id
  constructor(userObject){
    this.hash = 0;
    this.id = 0;
    this.item = userObject;
  }

  setHash(hash){
    this.hash = hash;
  }

  getHash(){
    return this.hash;
  }

  setId(id){
    this.id = id;
  }

  getId(){
    return this.id;
  }

  getItem(){
    return this.item;
  }
}
