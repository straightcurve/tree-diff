import { MaterialNode, TreeOperation } from "./types";
export declare function internalDiff(src: MaterialNode, dst: MaterialNode, dstRoot?: MaterialNode): TreeOperation[];
export declare function internalPatch(operations: TreeOperation[]): void;
