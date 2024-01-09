import { DiffOptions, MaterialNode, TreeOperation } from "./types.js";
export default function diffpatch(src: MaterialNode, dst: MaterialNode, diffOpts?: DiffOptions): void;
export declare function diff(src: MaterialNode, dst: MaterialNode, diffOpts?: DiffOptions): TreeOperation[];
export declare function patch(operations: TreeOperation[]): void;
