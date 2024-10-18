import { diff, patch } from "../src";
import {
  ExposeOperation,
  HideOperation,
  MaterialNode,
  Module,
} from "../src/types";
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
  let dstHiddenNodeCount = 0;
  recDo(dst, (node) => {
    if (node.hidden === true) {
      dstHiddenNodeCount++;
    }
  });
  const exposeOperationCount = patches.filter(
    (p): p is ExposeOperation => p.kind === "expose"
  ).length;

  expect(exposeOperationCount).toEqual(dstHiddenNodeCount);

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

  describe("expose", () => {
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
                hidden: false,
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
                hidden: undefined,
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
                hidden: true,
              },
              {
                id: 1231231231,
                ref: 2767346573,
                hidden: undefined,
              },
              {
                id: 103,
                ref: 3,
                hidden: undefined,
              },
              {
                id: 104,
                ref: 4,
                hidden: undefined,
              },
              {
                id: 105,
                ref: 5,
                hidden: undefined,
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
                hidden: false,
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
                hidden: true,
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
                hidden: true,
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
                hidden: false,
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
                hidden: undefined,
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
                hidden: true,
                nodes: [
                  {
                    id: 103,
                    ref: 3,
                    hidden: undefined,
                  },
                  {
                    id: 104,
                    ref: 4,
                    hidden: undefined,
                  },
                ],
              },
              {
                id: 1231231231,
                ref: 2767346573,
                hidden: undefined,
              },
              {
                id: 105,
                ref: 5,
                hidden: undefined,
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
