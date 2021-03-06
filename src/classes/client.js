'use strict';

// a class that describes the structure and capabilities of the client
class Client { 
  constructor(login, password) {
    this._login = login;
    this._password = password;
    this.dbms = null;
  }

  set login(login) {
    this._login = login;
  }

  get login() {
    return this._login;
  }

  set password(password) {
    this._password = password;
  }

  get password() {
    return this._password;
  }

  connect(dbms) { // method for connecting to database
    this.dbms = dbms.connect(this._login, this._password);

    if (this.dbms) {
      console.log('Successfully connected!');
      return true;
    } else {
      return false;
    }
  }

  isValid(types, args) {
    const typeCheck = (type, value) => {
      return Array.isArray(value) && type === '[]'
           ? Array.isArray(value) === Array.isArray([]) 
           : type === typeof(value);
    };  
    return args
             .map((el, i) => typeCheck(types[i], el))
             .every(el => el === true);
  }

  query(...args) { // method for handling various types of requests to the database
    if (args.length === 6) { /* arguments: type of query, name of database,
      name of collection, item schema(array), key schema(array), type of struct(number) */
      const arrayOfTypes = ['string', 'string', 'string', '[]', '[]', 'number'];
      let valid = this.isValid(arrayOfTypes, args);
      let typeOfQuery = args.shift();

      if (valid && typeOfQuery === 'createCollection') {
        return this.dbms[typeOfQuery](...args, this._login, this._password);
      }
    }
    // arguments: type of query, query object, name of database, name of collection
    if (args.length === 4) { 
      const reducer = (acc, cur, ind) =>
        acc && (ind == 1 ? typeof(cur) === 'object' : typeof(cur) === 'string');

      let valid = args.reduce(reducer, true);
      let typeOfQuery = args.shift();

      if (valid && /^find$|^insert$|^update$|^findOne$|^remove$/.test(typeOfQuery)) {
        return this.dbms[typeOfQuery](...args, this._login, this._password);
      }
    }
    // arguments: type of query, name of database, name of collection
    if (args.length === 3) { 
      const reducer = (acc, cur) => acc && typeof(cur) === 'string';

      let valid = args.reduce(reducer, true);
      let typeOfQuery = args.shift();

      if (valid && (typeOfQuery === 'dropCollection' || 
                    typeOfQuery === 'printCollection')) {
        return this.dbms[typeOfQuery](...args, this._login, this._password);
      }
    }
    // arguments: type of query, name of database
    if (args.length === 2) {
      const reducer = (acc, cur) => acc && typeof(cur) === 'string';

      let valid = args.reduce(reducer, true);
      let typeOfQuery = args.shift();

      if (valid && /^createDatabase$|^dropDatabase$|^showCollections$/.test(typeOfQuery)) {
        return this.dbms[typeOfQuery](...args, this._login, this._password);
      }
    }
    // arguments: type of query
    if (args.length === 1) { 
      let typeOfQuery = args.shift();

      if (typeOfQuery === 'showDatabases') {
        return this.dbms[typeOfQuery](this._login, this._password);
      }
    }

    console.log('Invalid syntax of query!');
  }
}

module.exports = {
  Client
};
