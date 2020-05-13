class Tree {
  constructor (nodes, p, c, num) {
    nodes = JSON.parse(JSON.stringify(nodes))
    this.data = Tree.build(nodes, p, c, num)
  }
  static build (nodes, p, c, num) {
    let arr = []

    nodes.forEach((node) => {
      if (node[c] == num) {
        arr.push(node)
      }
      var parent = Tree.findParent(nodes, node[c], p)
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }
        parent.children.push(node)
      }
    })
    return arr
  }
  static findParent (nodes, parentId, p) {
    for (var i = 0; i < nodes.length; ++i) {
      var node = nodes[i]
      if (node[p] == parentId) {
        return node
      }
    }
    return null
  }
}
export default function(data,idName,parent_idName,rootId){
  return new Tree(data,idName,parent_idName,rootId).data
}

