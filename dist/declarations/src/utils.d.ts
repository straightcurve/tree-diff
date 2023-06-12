import { MaterialNode } from "./types";
export declare function move(node: MaterialNode, srcNodes: MaterialNode[], dstNodes: MaterialNode[], index: number): void;
export declare function hide(node: MaterialNode): void;
export declare function dump(node: MaterialNode, label?: string): string;
export declare function recFind(root: MaterialNode | null | undefined, predicate: (node: MaterialNode, parent?: MaterialNode) => boolean, parent?: MaterialNode): MaterialNode | undefined;
