import { internalDiff, internalPatch } from "./internal";
import { DiffOptions, MaterialNode, TreeOperation } from "./types";

export default function diffpatch(
  src: MaterialNode,
  dst: MaterialNode,
  diffOpts?: DiffOptions,
) {
  internalPatch(internalDiff(src, dst, dst, diffOpts));
}

export function diff(
  src: MaterialNode,
  dst: MaterialNode,
  diffOpts?: DiffOptions,
) {
  return internalDiff(src, dst, dst, diffOpts);
}

export function patch(operations: TreeOperation[]) {
  return internalPatch(operations);
}
