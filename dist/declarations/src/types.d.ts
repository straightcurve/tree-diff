export type Module = MaterialNode & {
    nodes: MaterialNode[];
};
export type MaterialNode = {
    id: number;
    hidden?: boolean;
    nodes?: MaterialNode[];
    ref?: number;
};
export type MoveOperation = {
    kind: "move";
    node: MaterialNode;
    srcNodes: MaterialNode[];
    dstNodes: MaterialNode[];
    index: number;
};
export type HideOperation = {
    kind: "hide";
    node: MaterialNode;
};
export type AddOperation = {
    kind: "add";
    node: MaterialNode;
    dstNodes: MaterialNode[];
    index: number;
};
export type TreeOperation = AddOperation | MoveOperation | HideOperation;
