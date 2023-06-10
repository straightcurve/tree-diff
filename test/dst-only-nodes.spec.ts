import diff from "../src";
import { Module } from "../src/types";
import { hide, move } from "../src/utils";

describe("tree edit diff", () => {
  let next: () => number;

  beforeEach(() => {
    next = (() => {
      let nextId = 0;

      return () => nextId++;
    })();
  });

  /**
   *
   * t0:
   *   0(1, 2)
   *   3(1', 5, 2')
   *
   * t1:
   *   0(1, 2)
   *   3(1', 5, 2')
   */
  it("no change", () => {
    const src: Module = { id: next(), nodes: [{ id: next() }, { id: next() }] };
    const dst: Module = {
      id: next(),
      nodes: [
        { id: next(), ref: src.nodes[0].id },
        { id: next() },
        { id: next(), ref: src.nodes[1].id },
      ],
    };

    diff(src, dst);

    expect(dst.nodes[0].ref).toEqual(src.nodes[0].id);
    expect(dst.nodes[2].ref).toEqual(src.nodes[1].id);
  });

  /**
   *
   * t0:
   *   0(1, 2)
   *   3(1', 5, 2')
   *
   * t1:
   *   0(2, 1)
   *   3(2', 5, 1')
   */
  it("move", () => {
    const src: Module = { id: next(), nodes: [{ id: next() }, { id: next() }] };
    const dst: Module = {
      id: next(),
      nodes: [
        { id: next(), ref: src.nodes[0].id },
        { id: next() },
        { id: next(), ref: src.nodes[1].id },
      ],
    };

    move(src.nodes[0], src.nodes, src.nodes, 1);

    diff(src, dst);

    expect(dst.nodes[0].ref).toEqual(src.nodes[0].id);
    expect(dst.nodes[2].ref).toEqual(src.nodes[1].id);
  });

  /**
   *
   * t0:
   *   0(1, 2)
   *   3(1', 5, 2')
   *
   * t1:
   *   0(1)
   *   3(1', 5)
   */
  it("hide", () => {
    const src: Module = { id: next(), nodes: [{ id: next() }, { id: next() }] };
    const dst: Module = {
      id: next(),
      nodes: [
        { id: next(), ref: src.nodes[0].id },
        { id: next() },
        { id: next(), ref: src.nodes[1].id },
      ],
    };

    hide(src.nodes[1]);

    diff(src, dst);

    expect(dst.nodes[0].ref).toEqual(src.nodes[0].id);
    expect(dst.nodes[2].hidden).toBeTruthy();
  });

  /**
   *
   * t0:
   *   0(1, 2)
   *   3(1', 5, 2')
   *
   * t1:
   *   0(1, 2, 7)
   *   3(1', 5, 2', 7')
   */
  it("add at the end", () => {
    const src: Module = { id: next(), nodes: [{ id: next() }, { id: next() }] };
    const dst: Module = {
      id: next(),
      nodes: [
        { id: next(), ref: src.nodes[0].id },
        { id: next() },
        { id: next(), ref: src.nodes[1].id },
      ],
    };

    src.nodes.push({ id: next() });

    diff(src, dst);

    expect(dst.nodes[0].ref).toEqual(src.nodes[0].id);
    expect(dst.nodes[2].ref).toEqual(src.nodes[1].id);
    expect(dst.nodes[3].ref).toEqual(src.nodes[2].id);
  });

  /**
   *
   * t0:
   *   0(1, 2)
   *   3(1', 5, 2')
   *
   * t1:
   *   0(7, 1, 2)
   *   3(7', 1', 5, 2')
   */
  it("add at the start", () => {
    const src: Module = { id: next(), nodes: [{ id: next() }, { id: next() }] };
    const dst: Module = {
      id: next(),
      nodes: [
        { id: next(), ref: src.nodes[0].id },
        { id: next() },
        { id: next(), ref: src.nodes[1].id },
      ],
    };

    src.nodes.unshift({ id: next() });

    diff(src, dst);

    expect(dst.nodes[0].ref).toEqual(src.nodes[0].id);
    expect(dst.nodes[1].ref).toEqual(src.nodes[1].id);
    expect(dst.nodes[3].ref).toEqual(src.nodes[2].id);
  });
});
