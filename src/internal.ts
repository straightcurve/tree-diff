import { MaterialNode, TreeOperation } from "./types";
import { hide, move, recFind } from "./utils";

export function internalDiff(
  src: MaterialNode,
  dst: MaterialNode,
  dstRoot: MaterialNode = dst
): TreeOperation[] {
  const operations: TreeOperation[] = [];

  if (!src.nodes) return operations;
  if (!dst.nodes) return operations;

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
      const existing = recFind(dstRoot, (n) => n.ref === srcNode.id);
      if (!existing) {
        operations.push({
          kind: "add",
          node: srcNode,
          dstNodes: dst.nodes,
          index: i + skip - 1,
        });
      } else {
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
    } else {
      operations.push(...internalDiff(srcNode, dstNode, dstRoot));
    }
  }

  return operations;
}

export function internalPatch(operations: TreeOperation[]) {
  for (const op of operations) {
    switch (op.kind) {
      case "move": {
        move(op.node, op.srcNodes, op.dstNodes, op.index);
        break;
      }
      case "hide": {
        hide(op.node);
        break;
      }
      case "add": {
        throw new Error("@todo");
      }
    }
  }
}
