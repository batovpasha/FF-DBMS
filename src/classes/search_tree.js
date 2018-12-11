const Item = require('./item.js').Item;

class Node{
  constructor(type, key, value){
    this.type = type;
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

  switchBranch(node, branch, item, type){ // method to switch to another branch when inserting element
    if (node[branch] == undefined) node[branch] = new Node(type, item[type], item);
    else this.insertNode(node[branch], item);
  }

  switchTree(node, type, item){ // method to switch to another tree(alternative) when inserting element

    if (node.alternativeTree == undefined){

      let nextType = this.arrayOfFields[this.arrayOfFields.indexOf(node.type) + 1];

      if(nextType != undefined){
        node.alternativeTree = new Node(nextType, node.value[nextType], node.value);
        this.insertNode(node.alternativeTree, item);
      }

    } else this.insertNode(node.alternativeTree, item);

  }

  createRoot(item){ // root initialization method when inserting the first element
    let type = this.arrayOfFields[0];
    let key = item[type];
    this.root = new Node(type, key, item);
  }

  insertNode(...args){  // method of adding a node to a tree

    if(args.length == 2){

      let node = args[0];
      let item = args[1];
      let type = node.type;

      if (type in item){

        if (item[type] == node.key) this.switchTree(node, type, item);

        if (item[type] > node.key) this.switchBranch(node, 'right', item, type);

        if (item[type] < node.key) this.switchBranch(node, 'left', item, type);

      }

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
      let type = node.type;

      if (type in item){

        if(item[type] == node.key){
          delete item[type];
          if (node.alternativeTree) this.searchItem(node.alternativeTree, item, resultArray);
          else resultArray.push(node.value);
        }

        if(item[type] > node.key && node.right){
          this.searchItem(node.right, item, resultArray);
        }

        if(item[type] < node.key && node.left){
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

// let item1 = {
//   name: 'Peter',
//   surname: 'Digger',
//   age: 23
// }
//
//
// let item2 = {
//   name: 'Dick',
//   surname: 'Digger',
//   age: 23
// }
//
// let item3 = {
//   name: 'Nick',
//   surname: 'zigger',
//   age: 23
// }
//
// let item4 = {
//   name: 'Dick',
//   surname: 'zigger',
//   age: 25
// }
//
// let tree = new SearchTree(['name', 'surname', 'age']);
//
// tree.insertNode(item1);
// tree.insertNode(item2);
// tree.insertNode(item3);
// tree.insertNode(item4);
//
// let result = [];
//
// let searchQuery = {surname: 'zigger'};
//
// tree.searchItem(searchQuery, result)
// console.dir(result);
