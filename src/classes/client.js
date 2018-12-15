'use strict';

class Client { // a class that describes the structure and capabilities of the client
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
      console.log('Successfuly connected!');
      return true;
    } else {
      return false;
    }
  }

  validCheck(types, args) {
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
      // const reducer = (acc, cur, ind) => {
      //   acc = acc && (ind < 3 ? typeof(cur) === 'string' : true);
      //   acc = acc && (ind > 2 && ind < 5 ? Array.isArray(cur) : true);
      //   acc = acc && (ind === 5 ? typeof(cur) === 'number' : true);
      //   return acc;
      // }
      const arrayOfTypes = ['string', 'string', 'string', '[]', '[]', 'number'];
      let valid = this.validCheck(arrayOfTypes, args);
      let typeOfQuery = args.shift();

      if (valid && typeOfQuery === 'createCollection') {
        return this.dbms[typeOfQuery](...args, this._login, this._password);
      }
    }

    if (args.length === 4) { // arguments: type of query, query object, name of database, name of collection
      const reducer = (acc, cur, ind) =>
        acc && (ind == 1 ? typeof(cur) === 'object' : typeof(cur) === 'string');

      let valid = args.reduce(reducer, true);
      let typeOfQuery = args.shift();

      if (valid && /^find$|^insert$|^update$|^findOne$|^remove$/.test(typeOfQuery)) {
        return this.dbms[typeOfQuery](...args, this._login, this._password);
      }
    }

    if (args.length === 3) { // arguments: type of query, name of database, name of collection
      const reducer = (acc, cur) => acc && typeof(cur) === 'string';

      let valid = args.reduce(reducer, true);
      let typeOfQuery = args.shift();

      if (valid && typeOfQuery === 'dropCollection') {
        return this.dbms[typeOfQuery](...args, this._login, this._password);
      }
    }

    if (args.length === 2) { // arguments: type of query, name of database
      const reducer = (acc, cur) => acc && typeof(cur) === 'string';

      let valid = args.reduce(reducer, true);
      let typeOfQuery = args.shift();

      if (valid && /^createDatabase$|^dropDatabase$|^showCollections$/.test(typeOfQuery)) {
        return this.dbms[typeOfQuery](...args, this._login, this._password);
      }
    }

    if (args.length === 1) { // arguments: type of query
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

/* ---EXAMPLES--- */

// let cl = new Client('client', 'password');
// cl.query('createCollection', 'db', 'collection', ['name', 'surname', 'age'], ['name'], 1);
// cl.query('insert', {}, 'db', 'collection');
// cl.query('dropTable', 'db', 'collection');
// cl.query('showCollections', 'db');
// cl.query('showDatabases');


