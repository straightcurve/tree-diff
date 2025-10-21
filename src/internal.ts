import { MaterialNode, DiffOptions, TreeOperation } from "./types";
import { expose, hide, move, recFind } from "./utils";

export function internalDiff(
  src: MaterialNode,
  dst: MaterialNode,
  dstRoot: MaterialNode = dst,
  options: DiffOptions = {
    ignoreHidden: false,
    forceHide: false,
  }
): TreeOperation[] {
  const { ignoreHidden, forceHide } = options;
  const operations: TreeOperation[] = [];

  if (!src.nodes) return operations;
  if (!dst.nodes) return operations;

  /** basically a counter for dst nodes */
  let skipCount = 0;

  /** ignore amount starting from beginning due to add operations changing order */
  let ignoreCount = 0;

  for (let i = 0; i < src.nodes.length; i++) {
    const srcNode = src.nodes[i];

    let dstNode!: MaterialNode;
    let found = false;
    let hasRef = false;
    while (
      !hasRef &&
      !found &&
      i + skipCount - ignoreCount < dst.nodes.length
    ) {
      dstNode = dst.nodes[i + skipCount - ignoreCount];
      found = srcNode.id === dstNode.ref;

      if (!!dstNode.ref) {
        //  if dstNode is ref'd from another tree, skip it
        const existing = recFind(src, (n) => n.id === dstNode.ref);
        if (!existing) {
          hasRef = false;
          skipCount++;
        } else {
          hasRef = true;
        }
      } else {
        hasRef = false;
        skipCount++;
      }
    }

    if (!found) {
      const existing = recFind(dstRoot, (n) => n.ref === srcNode.id);
      if (!existing) {
        if (ignoreHidden || !srcNode.hidden) {
          operations.push({
            kind: "add",
            node: srcNode,
            dstNodes: dst.nodes,
            index: i + skipCount,
          });  
        }

        ignoreCount++;
      } else {
        if (!existing.parent?.nodes)
          throw new Error(`something went wrong in recFind()`);

        dstNode = existing.node;

        operations.push({
          kind: "move",
          node: dstNode,
          srcNodes: existing.parent.nodes,
          dstNodes: dst.nodes,
          index: i + skipCount,
        });

        if (forceHide || (!ignoreHidden && srcNode.hidden)) {
          operations.push({
            kind: "hide",
            node: dstNode,
          });

          operations.push(
            ...internalDiff(srcNode, dstNode, dstRoot, {
              ...options,
              forceHide: true,
            })
          );
        } else if (!ignoreHidden && !srcNode.hidden && dstNode.hidden) {
          operations.push({
            kind: "expose",
            node: dstNode,
          });

          operations.push(...internalDiff(srcNode, dstNode, dstRoot, options));
        } else {
          operations.push(...internalDiff(srcNode, dstNode, dstRoot, options));
        }
      }

      continue;
    }

    if (forceHide || (!ignoreHidden && srcNode.hidden)) {
      operations.push({
        kind: "hide",
        node: dstNode,
      });

      operations.push(
        ...internalDiff(srcNode, dstNode, dstRoot, {
          ...options,
          forceHide: true,
        })
      );
    } else if (!ignoreHidden && !srcNode.hidden && dstNode?.hidden) {
      operations.push({
        kind: "expose",
        node: dstNode,
      });

      operations.push(...internalDiff(srcNode, dstNode, dstRoot, options));
    } else {
      operations.push(...internalDiff(srcNode, dstNode, dstRoot, options));
    }
  }

  return operations;
}

export function internalPatch(
  operations: TreeOperation[],
  { ignoreHidden }: DiffOptions = { ignoreHidden: true }
) {
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
      case "expose": {
        expose(op.node);
        break;
      }
      case "add": {
        op.dstNodes.splice(op.index, 0, {
          ...op.node,
          ref: op.node.id,
          id: op.newId ?? op.node.id,
          hidden: ignoreHidden ? false : op.node.hidden,
        });
      }
    }
  }
}
