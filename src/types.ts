export type Module = MaterialNode & {
  nodes: MaterialNode[];
};

export type MaterialNode = {
  id: number;
  hidden?: boolean;
  nodes?: MaterialNode[];
  ref?: number;
};
