import { MaterialNode } from "./types";

export function move(
  node: MaterialNode,
  srcNodes: MaterialNode[],
  dstNodes: MaterialNode[],
  index: number
) {
  srcNodes.splice(srcNodes.indexOf(node), 1);
  dstNodes.splice(index, 0, node);
}

export function hide(node: MaterialNode) {
  node.hidden = true;
}

export function dump(node: MaterialNode, label: string = "") {
  if (node.hidden) return label;

  if (node.ref) label += `${node.ref}'`;
  else label += node.id;

  if (node.nodes) {
    label += "(";
    node.nodes.forEach((n, i) => {
      label += dump(n);
      if (node.nodes && i < node.nodes.length - 1 && !node.nodes[i + 1].hidden)
        label += ", ";
    });
    label += ")";
  }

  return label;
}
