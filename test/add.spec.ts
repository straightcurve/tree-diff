import { diff, patch } from "../src";
import { AddOperation, Module } from "../src/types";
import { dump, hide, move } from "../src/utils";

describe("tree diff", () => {
  let next: () => number;

  beforeEach(() => {
    next = (() => {
      let nextId = 0;

      return () => nextId++;
    })();
  });

  describe("add", () => {
    it("should use provided node id", () => {
      const src: Module = {
        id: next(),
        nodes: [{ id: next() }, { id: next() }],
      };
      const dst: Module = {
        id: next(),
        nodes: [
          { id: next(), ref: src.nodes[0].id },
          { id: next() },
          { id: next(), ref: src.nodes[1].id },
        ],
      };

      src.nodes.push({ id: next() });

      const patches = diff(src, dst);
      patches.filter((p): p is AddOperation => p.kind === "add")[0].newId =
        1337;

      patch(patches);

      expect(dst.nodes[dst.nodes.length - 1].id).toEqual(1337);
    });

    it("should not add nodes if the refs are hidden", () => {
      const src: Module = {
        id: next(),
        nodes: [{ id: next() }, { id: next() }],
      };
      const dst: Module = {
        id: next(),
        nodes: [
          { id: next(), ref: src.nodes[0].id, hidden: true },
          { id: next() },
          { id: next(), ref: src.nodes[1].id },
        ],
      };

      const patches = diff(src, dst);
      patch(patches);

      expect(dst.nodes[0].id).toEqual(4);
      expect(dst.nodes[0].hidden).toBeTruthy();
      expect(dst.nodes.length).toEqual(3);
    });
  });
});
