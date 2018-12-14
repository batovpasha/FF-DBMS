'use strict';

const DataBase = require('./db.js').DataBase;

class DBMS {
  constructor() {
    this.identificationData = new Map();
  }

  connect(login, password) {
    if (this.identificationData.has(login) && 
        this.identificationData.get(login).password === password) 
      return this;
    
    else if (this.identificationData.has(login) &&
             this.identificationData.get(login).password !== password) {
      console.log('Incorrect password!');
      return null;
    }

    else {
      this.identificationData.set(login, { password, databases: new Map() });
      return this;
    }
  }

  createDatabase(name, login, password) {
    if (this.identificationData.has(login) && 
        this.identificationData.get(login).password === password) {
      const database = new DataBase(name);
      this.identificationData.get(login).databases.set(name, database);
    }
    
    else if (this.identificationData.has(login) && 
             this.identificationData.get(login).password !== password) {
      console.log('Incorrect password!');
      return;
    }
  }

  dropDatabase(name, login, password) {
    if (this.identificationData.has(login) && 
        this.identificationData.get(login).password === password) {
      
      if (this.identificationData.get(login).databases.has(name)) {
        this.identificationData.get(login).databases.delete(name);
        return;
      }
      
      else if (!this.identificationData.get(login).databases.has(name)) {
        console.log(`This client has not ${name} database`);
        return;
      }
    }
    
    else if (this.identificationData.has(login) && 
             this.identificationData.get(login).password !== password) {
      console.log('Incorrect password!');
      return;
    }  
  }

  createCollection(database, collection, schema, keys, structType, login, password) {
    if (this.identificationData.has(login) && 
        this.identificationData.get(login).password === password) {
      
      if (this.identificationData.get(login).databases.has(database)) {
        const db = this.identificationData.get(login).databases.get(database);
        db.createCollection(collection, schema, keys, structType);
        return;
      }

      else if (!this.identificationData.get(login).databases.has(database)) {
        console.log(`This client has not ${database} database`);
        return;
      }
    }
    
    else if (this.identificationData.has(login) && 
             this.identificationData.get(login).password !== password) {
      console.log('Incorrect password!');
      return;
    }   
  }

  dropCollection(database, collection, login, password) {
    if (this.identificationData.has(login) && 
        this.identificationData.get(login).password === password) {
      
      if (this.identificationData.get(login).databases.has(database)) {
        const db = this.identificationData.get(login).databases.get(database);
        db.dropCollection(collection);
        return;
      }

      else if (!this.identificationData.get(login).databases.has(database)) {
        console.log(`This client has not ${database} database`);
        return;
      }

    }
    
    else if (this.identificationData.has(login) && 
             this.identificationData.get(login).password !== password) {
      console.log('Incorrect password!');
      return;
    }    
  }

  showDatabases(login, password) {
    if (this.identificationData.has(login) && 
        this.identificationData.get(login).password === password) {
      // get list with all database names
      const list = [...this.identificationData.get(login).databases.keys()]; 
      console.log(list);
      return;
    }
    
    else if (this.identificationData.has(login) && 
             this.identificationData.get(login).password !== password) {
      console.log('Incorrect password!');
      return;
    }
  }

  showCollections(database, login, password) {
    if (this.identificationData.has(login) && 
        this.identificationData.get(login).password === password) {

      if (this.identificationData.get(login).databases.has(database)) {
        const db = this.identificationData.get(login).databases.get(database);
        console.log(db.getNamesOfCollections());
        return;
      }

      else if (!this.identificationData.get(login).databases.has(database)) {
        console.log(`This client has not ${database} database`);
        return;
      }
    
    }
    
    else if (this.identificationData.has(login) && 
             this.identificationData.get(login).password !== password) {
      console.log('Incorrect password!');
      return;
    }    
  }

  find(query, database, collection, login, password) {
    if (this.identificationData.has(login) && 
        this.identificationData.get(login).password === password) {
      
      if (this.identificationData.get(login).databases.has(database)) {
        const db = this.identificationData.get(login).databases.get(database);
        return db.getCollection(collection).find(query);
      }

      else if (!this.identificationData.get(login).databases.has(database)) {
        console.log(`This client has not ${database} database`);
      }
    }
    
    else if (this.identificationData.has(login) &&
             this.identificationData.get(login).password !== password) {
      console.log('Incorrect password!');
      return null;
    }     
  }

  insert(query, database, collection, login, password) {
    if (this.identificationData.has(login) && 
        this.identificationData.get(login).password === password) {
      
      if (this.identificationData.get(login).databases.has(database)) {
        const db = this.identificationData.get(login).databases.get(database);
        return db.getCollection(collection).insert(query, password);
      }

      else if (!this.identificationData.get(login).databases.has(database)) {
        console.log(`This client has not ${database} database`);
      }
    }
    
    else if (this.identificationData.has(login) &&
             this.identificationData.get(login).password !== password) {
      console.log('Incorrect password!');
      return null;
    }     
  }

  updateItem(query, database, collection, login, password) {
    if (this.identificationData.has(login) && 
        this.identificationData.get(login).password === password) {
      
      if (this.identificationData.get(login).databases.has(database)) {
        const db = this.identificationData.get(login).databases.get(database);
        return db.getCollection(collection).updateItem(query, password);
      }

      else if (!this.identificationData.get(login).databases.has(database)) {
        console.log(`This client has not ${database} database`);
      }
    }
    
    else if (this.identificationData.has(login) &&
             this.identificationData.get(login).password !== password) {
      console.log('Incorrect password!');
      return null;
    }     
  }

  findOne(query, database, collection, login, password) {
    if (this.identificationData.has(login) && 
        this.identificationData.get(login).password === password) {
      
      if (this.identificationData.get(login).databases.has(database)) {
        const db = this.identificationData.get(login).databases.get(database);
        return db.getCollection(collection).findOne(query, password);
      }

      else if (!this.identificationData.get(login).databases.has(database)) {
        console.log(`This client has not ${database} database`);
      }
    }
    
    else if (this.identificationData.has(login) &&
             this.identificationData.get(login).password !== password) {
      console.log('Incorrect password!');
      return null;
    }     
  }

  print() {
    console.log(this.identificationData);
  }
};

const dbms = new DBMS();

module.exports = {
  dbms
};

// dbms.connect('Pasha', '12345');

// dbms.createDatabase('users1', 'Pasha', '12345');
// dbms.createDatabase('users2', 'Pasha', '12345');
// dbms.createDatabase('users3', 'Pasha', '12345');
// dbms.createDatabase('users4', 'Pasha', '12345');
// dbms.createDatabase('users5', 'Pasha', '12345');

// dbms.createCollection('users1', 'sd1', ['name', 'surname', 'age'], ['name', 'surname'], 2, 'Pasha', '12345');
// dbms.createCollection('users1', 'sd2', ['name', 'surname', 'age'], ['name', 'surname'], 2, 'Pasha', '12345');
// dbms.createCollection('users1', 'sd3', ['name', 'surname', 'age'], ['name', 'surname'], 2, 'Pasha', '12345');
// dbms.createCollection('users1', 'sd4', ['name', 'surname', 'age'], ['name', 'surname'], 2, 'Pasha', '12345');


// dbms.print();
// dbms.showDatabases('Pasha', '12345');
// dbms.showCollections('users1', 'Pasha', '12345');

// dbms.insert({ name: 'Pavel', surname: 'Batov' }, 'users1', 'sd1', 'Pasha', '12345');
// dbms.insert({ name: 'Homer1', surname: 'Simpson' }, 'users1', 'sd1', 'Pasha', '12345');
// dbms.insert({ name: 'Homer1', surname: 'Simpson' }, 'users1', 'sd1', 'Pasha', '12345');
// dbms.insert({ name: 'Homer2', surname: 'Simpson' }, 'users1', 'sd1', 'Pasha', '12345');
// dbms.insert({ name: 'Homer3', surname: 'Simpson' }, 'users1', 'sd1', 'Pasha', '12345');
// dbms.insert({ name: 'Homer4', surname: 'Simpson' }, 'users1', 'sd1', 'Pasha', '12345');

// console.log(dbms.find({ name: 'Simpson'}, 'users1', 'sd1', 'Pasha', '12345'));