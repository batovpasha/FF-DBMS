'use strict';

class Node {
  constructor(field, key, value) {
    this.field = field;
    this.key = key;
    this.value = value;
    this.alternativeTree = null;
    this.left = null;
    this.right = null;
  }
}

class SearchTree { // a class that describes the structure and implementation of the multi-level binary search tree

  constructor(userFields) {
    this.arrayOfFields = userFields
    this.root = null;
  }

  switchBranch(node, branch, item, field) { // method to switch to another branch when inserting element
    if (!node[branch]) node[branch] = new Node(field, item[field], item);
    else this.insert(node[branch], item);
  }

  switchTree(node, field, item) { // method to switch to another tree(alternative) when inserting element

    if (!node.alternativeTree) {

      let nextType = this.arrayOfFields[this.arrayOfFields.indexOf(node.field) + 1];

      if (nextType) {
        node.alternativeTree = new Node(nextType, node.value[nextType], node.value);
        this.insert(node.alternativeTree, item);
      }

    } else this.insert(node.alternativeTree, item);

  }

  createRoot(item) { // root initialization method when inserting the first element
    let field = this.arrayOfFields[0];
    let key = item[field];
    this.root = new Node(field, key, item);
  }

  insert(...args) {  // method of adding a node to a tree

    if (args.length == 2) {

      let node = args[0];
      let item = args[1];
      let field = node.field;

      if (!(field in item)) item[field] = '';

      if (item[field] == node.key) this.switchTree(node, field, item);
      if (item[field] > node.key) this.switchBranch(node, 'right', item, field);
      if (item[field] < node.key) this.switchBranch(node, 'left', item, field);


    } else if (args.length == 1) {

      let item = args[0];

      if (!this.root) this.createRoot(item);
      else this.insert(this.root, item);
    }
  }

  find(...args) { // method for searching for items in tree (query handler)

    if(args.length == 3) {

      let node = args[0];
      let item = Object.assign({}, args[1]);;
      let resultArray = args[2];
      let field = node.field;

      if (field in item) {

        if (item[field] == node.key) {
          delete item[field];
          if (node.alternativeTree) this.find(node.alternativeTree, item, resultArray);
          else resultArray.push(node.value);
        }

        if (item[field] > node.key && node.right) {
          this.find(node.right, item, resultArray);
        }

        if (item[field] < node.key && node.left) {
          this.find(node.left, item, resultArray);
        }

      } else {

        let res = true;
        for (let i in item) res = res && item[i] == node.value[i];
        if (res && !node.alternativeTree) resultArray.push(node.value);

        if (node.alternativeTree) this.find(node.alternativeTree, item, resultArray);
        if (node.right) this.find(node.right, item, resultArray);
        if (node.left) this.find(node.left, item, resultArray);

      }

    }

    if (args.length == 1){
      let result = [];
      this.find(this.root, args[0], result);
      return result;
    }

  }

  minimum(current) { // a method for finding a minimal element in the subtree
    return curr.left === null ? current : minimum(current.left);
  }

  deleteNode (currNode, key) { // a method for removing an item from the subtree
    if (currNode.left != null && currNode.right != null) {
      let min = minimum(currNode.right);
      currNode.key = min.key;
      currNode.field = min.field;
      currNode.value = min.value;
      currNode.right = delete(currNode.right, currNode.key);
    } else {
      if (currNode.left != null) currNode = currNode.left;
      else currNode = currNode.right;
    }
    return currNode;
  }

  print() {
    console.log(this.find({}));
  }

  remove(...args) { // a method for removing items from a tree by pattern
    if (args.length === 2){
      let node = args[0];
      let item = Object.assign({}, args[1]);;
      let field = node.field;

      if (field in item) {

        if (item[field] == node.key) {
          delete item[field];
          if (Object.keys(item).length === 0){
            node = this.deleteNode(node, node[field]);
          } else if (node.alternativeTree){
            let newAltTree = this.remove(node.alternativeTree, item);
            if (newAltTree) node.value = newAltTree.value;
            node.alternativeTree = newAltTree;
          }
        }

        else if (item[field] > node.key && node.right) {
          node.right = this.remove(node.right, item);
        }

        else if (item[field] < node.key && node.left) {
          node.right = this.remove(node.left, item);
        }
      } else {

        let res = true;
        for (let i in item) res = res && item[i] === node.value[i];
        if (res) {
          if (node.alternativeTree) node.alternativeTree = this.remove(node.alternativeTree, item);
          node = this.deleteNode(node, node[field]);
        }

        if(node){
          if (node.alternativeTree) node.alternativeTree = this.remove(node.alternativeTree, item);
          if (node.right) node.right = this.remove(node.right, item);
          if (node.left) node.left = this.remove(node.left, item);
        }

      }
      return node;
    }

    if (args.length === 1){
      this.root = this.remove(this.root, args[0])
    }
  }
};

/* ---EXAMPLES--- */


let obj1 = {
  name: 'Homer',
  surname: 'Simpson',
  city: 'Kiev'
};

let obj2 = {
  name: 'Pasha',
  surname: 'Batov',
  city: 'Lutsk'
};

let obj3 = {
  name: 'Pasha',
  surname: 'Zubach',
  city: 'Lutsk'
};


// let tree = new SearchTree(['name', 'surname', 'city']);
//
//
// tree.insert(obj1);
// tree.insert(obj2);
// tree.insert(obj3);
//
// let searchQuery = {name: 'Pasha', surname: 'Zubach'};
//
// console.dir(tree.remove(searchQuery));
//
// console.dir(JSON.stringify(tree));

module.exports = {
  SearchTree
}
