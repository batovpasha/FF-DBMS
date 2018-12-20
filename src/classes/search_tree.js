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
/*
  a class that describes the structure 
  and implementation of the multi-level 
  binary search tree
*/
class SearchTree { 
  constructor(userFields) {
    this.arrayOfFields = userFields
    this.root = null;
  }
  // method to switch to another branch when inserting element
  switchBranch(node, branch, item, field) { 
    if (!node[branch]) {
      node[branch] = new Node(field, item[field], item);
    } else {
      this.insert(node[branch], item);
    }
  }
  // method to switch to another tree(alternative) when inserting element
  switchTree(node, field, item) { 
    if (!node.alternativeTree) {
      let nextType = this.arrayOfFields[this.arrayOfFields.indexOf(node.field) + 1];

      if (nextType) {
        node.alternativeTree = new Node(nextType, node.value[nextType], node.value);
        this.insert(node.alternativeTree, item);
      }
    } else this.insert(node.alternativeTree, item);
  }
  // root initialization method when inserting the first element
  createRoot(item) { 
    let field = this.arrayOfFields[0];
    let key = item[field];
    this.root = new Node(field, key, item);
  }
  // method of adding a node to a tree
  insert(...args) {  
    if (args.length === 2) {
      let node = args[0];
      let item = args[1];
      let field = node.field;

      if (!(field in item)) item[field] = '';

      if (item[field] === node.key) 
        this.switchTree(node, field, item);

      if (item[field] > node.key) 
        this.switchBranch(node, 'right', item, field);

      if (item[field] < node.key) 
        this.switchBranch(node, 'left', item, field);
    } else if (args.length === 1) {
      let item = args[0];

      if (!this.root) this.createRoot(item);
      else this.insert(this.root, item);
    }
  }
  // method for searching for items in tree (query handler)
  find(...args) { 
    if (args.length === 3) {
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

    if (args.length === 1) {
      let result = [];
      if (this.root) this.find(this.root, args[0], result);
      return result;
    }
  }
  // a method for finding a minimal element in the subtree
  minimum(current) { 
    return (!current.left ? current : this.minimum(current.left));
  }
  // a method for removing an item from the subtree
  deleteNode (currNode, key) { 
    if (currNode.left != null && currNode.right != null) {
      let min = this.minimum(currNode.right);
      currNode.key = min.key;
      currNode.field = min.field;
      currNode.value = min.value;
      currNode.right = this.deleteNode(currNode.right, currNode.key);
    } else {
      if (currNode.left != null) currNode = currNode.left;
      else currNode = currNode.right;
    }
    return currNode;
  }

  print() {
    console.log(this.find({}));
  }
  // a method for removing items from a tree by pattern
  remove(...args) { 
    if (args.length === 2) {
      let node = args[0];
      let item = Object.assign({}, args[1]);
      let field = node.field;

      if (field in item) {
        if (item[field] == node.key) {
          if (!node.alternativeTree){
            let res = true;
            for (let i in item) res = res && item[i] === node.value[i];
            if (res){
              node = this.deleteNode(node, node[field]);;
            }
          } else if (node.alternativeTree) {
            delete item[field];
            if (Object.keys(item).length != 0){
              let newAltTree = this.remove(node.alternativeTree, item);
              if (newAltTree) node.value = newAltTree.value;
              node.alternativeTree = newAltTree;
            } else {
              node.alternativeTree = null;
              node = this.deleteNode(node, node[field]);
            }
          }
        }

        else if (item[field] > node.key && node.right) {
          node.right = this.remove(node.right, item);
        }

        else if (item[field] < node.key && node.left) {
          node.left = this.remove(node.left, item);
        }
      } else {
        let res = true;
        for (let i in item) res = res && item[i] === node.value[i];
        if (res) {
          if (node.alternativeTree) node.alternativeTree = this.remove(node.alternativeTree, item);
          node = this.deleteNode(node, node[field]);
          if (node) node = this.remove(node, item);
        }

        else if (node) {
          if (node.alternativeTree) node.alternativeTree = this.remove(node.alternativeTree, item);
          if (node.right) node.right = this.remove(node.right, item);
          if (node.left) node.left = this.remove(node.left, item);
        }
      }
      return node;
    }

    else if (args.length === 1) {
      if (this.root) this.root = this.remove(this.root, args[0]);
    }
  }
};

module.exports = {
  SearchTree
};