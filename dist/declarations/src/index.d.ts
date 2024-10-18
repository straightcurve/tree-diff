import { DiffOptions, MaterialNode, TreeOperation } from "./types.js";
export default function diffpatch(src: MaterialNode, dst: MaterialNode, options?: DiffOptions): void;
export declare function diff(src: MaterialNode, dst: MaterialNode, options?: DiffOptions): TreeOperation[];
export declare function patch(operations: TreeOperation[]): void;
