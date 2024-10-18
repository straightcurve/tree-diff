import { diff, patch } from "../src";
import { HideOperation, MaterialNode, Module } from "../src/types";
import { dump, hide } from "../src/utils";

const recDo = (
  node: MaterialNode,
  fn: (node: MaterialNode, parent?: MaterialNode) => void,
  parent?: MaterialNode
) => {
  fn(node, parent);

  let children = node.nodes;
  if (!Array.isArray(children)) {
    return;
  }

  for (const child of children) {
    recDo(child, fn, node);
  }
};

const test = (src: MaterialNode, dst: MaterialNode) => {
  const patches = diff(src, dst);
  let srcHiddenNodeCount = 0;
  recDo(src, (node, parent) => {
    if (node.hidden || parent?.hidden) {
      srcHiddenNodeCount++;
    }
  });

  const hideOperationCount = patches.filter(
    (p): p is HideOperation => p.kind == "hide"
  ).length;

  expect(hideOperationCount).toEqual(srcHiddenNodeCount);

  return patches;
};

describe("tree diff", () => {
  let next: () => number;

  beforeEach(() => {
    next = (() => {
      let nextId = 0;

      return () => nextId++;
    })();
  });

  describe("hide", () => {
    it("should work with single leaf", () => {
      const src: Module = {
        id: 0,
        nodes: [
          {
            id: 1,
            hidden: undefined,
            ref: undefined,
            nodes: [
              {
                id: 2,
                ref: undefined,
                hidden: true,
              },
              {
                id: 3,
                ref: undefined,
                hidden: undefined,
              },
              {
                id: 4,
                ref: undefined,
                hidden: undefined,
              },
              {
                id: 5,
                ref: undefined,
                hidden: false,
              },
            ],
          },
        ],
      };

      const dst: Module = {
        id: 100,
        ref: 0,
        nodes: [
          {
            id: 101,
            ref: 1,
            hidden: undefined,
            nodes: [
              {
                id: 102,
                ref: 2,
                hidden: false,
              },
              {
                id: 1231231231,
                ref: 2767346573,
                hidden: false,
              },
              {
                id: 103,
                ref: 3,
                hidden: false,
              },
              {
                id: 104,
                ref: 4,
                hidden: false,
              },
              {
                id: 105,
                ref: 5,
                hidden: false,
              },
            ],
          },
        ],
      };

      patch(test(src, dst));
      test(src, dst);
    });

    it("should work with multiple leaves", () => {
      const src: Module = {
        id: 0,
        nodes: [
          {
            id: 1,
            hidden: undefined,
            ref: undefined,
            nodes: [
              {
                id: 2,
                ref: undefined,
                hidden: true,
              },
              {
                id: 3,
                ref: undefined,
                hidden: undefined,
              },
              {
                id: 4,
                ref: undefined,
                hidden: undefined,
              },
              {
                id: 5,
                ref: undefined,
                hidden: true,
              },
            ],
          },
        ],
      };

      const dst: Module = {
        id: 100,
        ref: 0,
        nodes: [
          {
            id: 101,
            ref: 1,
            hidden: undefined,
            nodes: [
              {
                id: 102,
                ref: 2,
                hidden: false,
              },
              {
                id: 1231231231,
                ref: 2767346573,
                hidden: false,
              },
              {
                id: 103,
                ref: 3,
                hidden: false,
              },
              {
                id: 104,
                ref: 4,
                hidden: false,
              },
              {
                id: 105,
                ref: 5,
                hidden: false,
              },
            ],
          },
        ],
      };

      patch(test(src, dst));
      test(src, dst);
    });

    it("should work with non-leaves", () => {
      const src: Module = {
        id: 0,
        nodes: [
          {
            id: 1,
            hidden: undefined,
            ref: undefined,
            nodes: [
              {
                id: 2,
                ref: undefined,
                hidden: true,
                nodes: [
                  {
                    id: 3,
                    ref: undefined,
                    hidden: undefined,
                  },
                  {
                    id: 4,
                    ref: undefined,
                    hidden: undefined,
                  },
                ],
              },
              {
                id: 5,
                ref: undefined,
                hidden: false,
              },
            ],
          },
        ],
      };

      const dst: Module = {
        id: 100,
        ref: 0,
        nodes: [
          {
            id: 101,
            ref: 1,
            hidden: undefined,
            nodes: [
              {
                id: 102,
                ref: 2,
                hidden: false,
                nodes: [
                  {
                    id: 103,
                    ref: 3,
                    hidden: false,
                  },
                  {
                    id: 104,
                    ref: 4,
                    hidden: false,
                  },
                ],
              },
              {
                id: 1231231231,
                ref: 2767346573,
                hidden: false,
              },
              {
                id: 105,
                ref: 5,
                hidden: false,
              },
            ],
          },
        ],
      };

      patch(test(src, dst));
      test(src, dst);
    });
  });
});
