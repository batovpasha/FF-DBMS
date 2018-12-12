const Item = require('./item.js').Item;

class Node{
  constructor(field, key, value){
    this.field = field;
    this.key = key;
    this.value = value;
    this.alternativeTree = undefined;
    this.left = undefined;
    this.right = undefined;
  }
}

class SearchTree{ // a class that describes the structure and implementation of the multi-level binary search tree

  constructor(arrayOfFields){
    this.arrayOfFields = arrayOfFields;
    this.root = undefined;
  }

  switchBranch(node, branch, item, field){ // method to switch to another branch when inserting element
    if (node[branch] == undefined) node[branch] = new Node(field, item[field], item);
    else this.insertNode(node[branch], item);
  }

  switchTree(node, field, item){ // method to switch to another tree(alternative) when inserting element

    if (node.alternativeTree == undefined){

      let nextType = this.arrayOfFields[this.arrayOfFields.indexOf(node.field) + 1];

      if(nextType != undefined){
        node.alternativeTree = new Node(nextType, node.value[nextType], node.value);
        this.insertNode(node.alternativeTree, item);
      }

    } else this.insertNode(node.alternativeTree, item);

  }

  createRoot(item){ // root initialization method when inserting the first element
    let field = this.arrayOfFields[0];
    let key = item[field];
    this.root = new Node(field, key, item);
  }

  insertNode(...args){  // method of adding a node to a tree

    if(args.length == 2){

      let node = args[0];
      let item = args[1];
      let field = node.field;

      if (!(field in item)) item[field] = '';

      if (item[field] == node.key) this.switchTree(node, field, item);

      if (item[field] > node.key) this.switchBranch(node, 'right', item, field);

      if (item[field] < node.key) this.switchBranch(node, 'left', item, field);


    } else if (args.length == 1){

      let item = args[0];

      if (this.root == undefined) this.createRoot(item);

      else this.insertNode(this.root, item);

    }
  } // method of adding a node to a tree

  searchItem(...args){ // method for searching for items in tree (query handler)

    if(args.length == 3){

      let node = args[0];
      let item = Object.assign({}, args[1]);;
      let resultArray = args[2];
      let field = node.field;

      if (field in item){

        if(item[field] == node.key){
          delete item[field];
          if (node.alternativeTree) this.searchItem(node.alternativeTree, item, resultArray);
          else resultArray.push(node.value);
        }

        if(item[field] > node.key && node.right){
          this.searchItem(node.right, item, resultArray);
        }

        if(item[field] < node.key && node.left){
          this.searchItem(node.left, item, resultArray);
        }

      } else {

        let res = true;
        for (let i in item) res = res && item[i] == node.value[i];
        if (res && !node.alternativeTree) resultArray.push(node.value);

        if(node.alternativeTree) this.searchItem(node.alternativeTree, item, resultArray);
        if(node.right) this.searchItem(node.right, item, resultArray);
        if(node.left) this.searchItem(node.left, item, resultArray);

      }

    }

    if(args.length == 2) this.searchItem(this.root, args[0], args[1]);

  }

};

/* ---EXAMPLES--- */

// let obj1 = {
//   name: 'Homer',
//   surname: 'Simpson',
//   age: 29,
//   school: 32,
//   city: 'Kiev'
// };
//
// let obj2 = {
//   name: 'Pasha',
//   surname: 'Batov',
//   city: 'Lutsk'
// };
//
//
// let tree = new SearchTree(['name', 'surname', 'age', 'school', 'city']);
//
//
// tree.insertNode(obj1);
// tree.insertNode(obj2);
//
// let result = [];
//
// let searchQuery = {name: 'Homer'};
//
// tree.searchItem(searchQuery, result)
// console.dir(result);
