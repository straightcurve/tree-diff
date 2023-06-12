import { MaterialNode, TreeOperation } from "./types";
export default function diffpatch(src: MaterialNode, dst: MaterialNode): void;
export declare function diff(src: MaterialNode, dst: MaterialNode): TreeOperation[];
export declare function patch(operations: TreeOperation[]): void;
