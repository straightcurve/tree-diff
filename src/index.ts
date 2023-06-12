import { internalDiff, internalPatch } from "./internal";
import { MaterialNode, TreeOperation } from "./types";

export default function diffpatch(src: MaterialNode, dst: MaterialNode) {
  internalPatch(internalDiff(src, dst));
}

export function diff(src: MaterialNode, dst: MaterialNode) {
  return internalDiff(src, dst);
}

export function patch(operations: TreeOperation[]) {
  return internalPatch(operations);
}
