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

class SearchTree{

  constructor(arrayOfFields){
    this.arrayOfFields = arrayOfFields;
    this.root = undefined;
  }

  switchBranch(node, branch, item, type){
    if (node[branch] == undefined) node[branch] = new Node(type, item[type], item);
    else this.addNode(node[branch], item);
  }

  switchTree(node, type, item){

    if (node.alternativeTree == undefined){

      let currIndex = this.arrayOfFields.indexOf(node.type);
      let nextType = this.arrayOfFields[currIndex + 1];

      if(nextType != undefined){
        node.alternativeTree = new Node(nextType, node.value[nextType], node.value);
        this.addNode(node.alternativeTree, item);
      }

    } else this.addNode(node.alternativeTree, item);

  }

  createRoot(item){
    let type = this.arrayOfFields[0];
    let key = item[type];
    this.root = new Node(type, key, item);
  }

  addNode(...args){

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

      else this.addNode(this.root, item);

    }
  }
};

let item1 = {
  name: 'Peter',
  surname: 'Digger',
  age: 23
}


let item2 = {
  name: 'Dick',
  surname: 'Digger',
  age: 23
}

let item3 = {
  name: 'Nick',
  surname: 'zigger',
  age: 23
}

let item4 = {
  name: 'Dick',
  surname: 'zigger',
  age: 25
}

let tree = new SearchTree(['name', 'surname', 'age']);

//console.dir(tree);

tree.addNode(item1);
tree.addNode(item2);
tree.addNode(item3);
tree.addNode(item4);
tree.addNode(item4);

console.dir(tree);
console.log(JSON.stringify(tree));
