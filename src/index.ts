import { internalDiff, internalPatch } from "./internal";
import { DiffOptions, MaterialNode, TreeOperation } from "./types";

export default function diffpatch(
  src: MaterialNode,
  dst: MaterialNode,
  options?: DiffOptions
) {
  internalPatch(internalDiff(src, dst, dst, options), options);
}

export function diff(
  src: MaterialNode,
  dst: MaterialNode,
  options?: DiffOptions
) {
  return internalDiff(src, dst, dst, options);
}

export function patch(operations: TreeOperation[]) {
  return internalPatch(operations);
}
