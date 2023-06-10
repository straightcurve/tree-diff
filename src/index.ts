import { MaterialNode } from "./types";
import { hide, move } from "./utils";
const copy = require("@stdlib/utils-copy");

export default function diff(src: MaterialNode, dst: MaterialNode) {
  const operations = [];

  if (!src.nodes) return;
  if (!dst.nodes) return;

  let skip = 0;
  for (let i = 0; i < src.nodes.length; i++) {
    const srcNode = src.nodes[i];

    let dstNode!: MaterialNode;
    let found = false;
    let hasRef = false;
    while (!hasRef && !found && i + skip < dst.nodes.length) {
      dstNode = dst.nodes[i + skip];
      found = srcNode.id === dstNode.ref;
      hasRef = !!dstNode.ref;
      if (!hasRef) skip++;
    }

    if (!found) {
      const existing = dst.nodes.find((n) => n.ref === srcNode.id);
      if (!existing) {
        operations.push({
          kind: "add",
          node: srcNode,
          dstNodes: dst.nodes,
          index: i + skip - 1,
        });
      } else {
        //  @todo: make sure this doesn't always run
        operations.push({
          kind: "move",
          node: existing as MaterialNode,
          srcNodes: dst.nodes,
          dstNodes: dst.nodes,
          index: i + skip,
        });
      }

      continue;
    }

    if (srcNode.hidden) {
      operations.push({
        kind: "hide",
        node: dstNode,
      });
    }
  }

  for (const op of operations) {
    switch (op.kind) {
      case "move": {
        //@ts-expect-error
        move(op.node, op.srcNodes, op.dstNodes, op.index);
        break;
      }
      case "hide": {
        hide(op.node);
        break;
      }
      case "add": {
        const toAdd = copy(op.node) as MaterialNode;
        toAdd.ref = toAdd.id;
        toAdd.id = 1337;
        op.dstNodes?.splice(op.index, 0, toAdd);
        break;
      }
    }
  }
}
