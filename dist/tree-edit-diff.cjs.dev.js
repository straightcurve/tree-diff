'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function move(node, srcNodes, dstNodes, index) {
  srcNodes.splice(srcNodes.indexOf(node), 1);
  dstNodes.splice(index, 0, node);
}
function hide(node) {
  node.hidden = true;
}

var copy = require("@stdlib/utils-copy");
function diff(src, dst) {
  var operations = [];
  if (!src.nodes) return;
  if (!dst.nodes) return;
  var _loop = function _loop() {
    var srcNode = src.nodes[i];
    var skip = 0;
    var dstNode;
    var found = false;
    var hasRef = false;
    while (!hasRef && !found && i + skip < dst.nodes.length) {
      dstNode = dst.nodes[i + skip];
      found = srcNode.id === dstNode.ref;
      hasRef = !!dstNode.ref;
      if (!hasRef) skip++;
    }
    if (!found) {
      var existing = dst.nodes.find(function (n) {
        return n.ref === srcNode.id;
      });
      if (!existing) {
        operations.push({
          kind: "add",
          node: srcNode,
          dstNodes: dst.nodes,
          index: i + skip
        });
      } else {
        //  @todo: make sure this doesn't always run
        operations.push({
          kind: "move",
          node: existing,
          srcNodes: dst.nodes,
          dstNodes: dst.nodes,
          index: i + skip
        });
      }
      return "continue";
    }
    if (srcNode.hidden) {
      operations.push({
        kind: "hide",
        node: dstNode
      });
    }
  };
  for (var i = 0; i < src.nodes.length; i++) {
    var _ret = _loop();
    if (_ret === "continue") continue;
  }
  for (var _i = 0, _operations = operations; _i < _operations.length; _i++) {
    var op = _operations[_i];
    switch (op.kind) {
      case "move":
        {
          //@ts-expect-error
          move(op.node, op.srcNodes, op.dstNodes, op.index);
          break;
        }
      case "hide":
        {
          hide(op.node);
          break;
        }
      case "add":
        {
          var _op$dstNodes;
          var toAdd = copy(op.node);
          toAdd.ref = toAdd.id;
          toAdd.id = 1337;
          (_op$dstNodes = op.dstNodes) === null || _op$dstNodes === void 0 ? void 0 : _op$dstNodes.splice(op.index, 0, toAdd);
          break;
        }
    }
  }
}

exports["default"] = diff;
