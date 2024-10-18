import diffpatch, { diff, patch } from "../src";
import { Module } from "../src/types";
import { dump, hide, move } from "../src/utils";

describe("tree diff", () => {
  let next: () => number;

  beforeEach(() => {
    next = (() => {
      let nextId = 0;

      return () => nextId++;
    })();
  });

  it("no change ref from other tree", () => {
    const src: Module = { id: 0, nodes: [{ id: 1 }, { id: 2 }] };
    const dst: Module = {
      id: 100,
      nodes: [
        { id: 101, ref: 1 },
        { id: 12327463, ref: 12334545454 },
        { id: 102, ref: 2 },
      ],
    };

    diffpatch(src, dst);

    expect(dst.nodes[0].ref).toEqual(1);
    expect(dst.nodes[2].ref).toEqual(2);
  });

  /**
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

    diffpatch(src, dst);

    expect(dst.nodes[0].ref).toEqual(src.nodes[0].id);
    expect(dst.nodes[2].ref).toEqual(src.nodes[1].id);
  });

  /**
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

    diffpatch(src, dst);

    expect(dst.nodes[0].ref).toEqual(src.nodes[0].id);
    expect(dst.nodes[2].ref).toEqual(src.nodes[1].id);
  });

  /**
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

    diffpatch(src, dst);

    expect(dst.nodes[0].ref).toEqual(src.nodes[0].id);
    expect(dst.nodes[2].hidden).toBeTruthy();
  });

  /**
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

    diffpatch(src, dst);

    expect(dst.nodes[0].ref).toEqual(src.nodes[0].id);
    expect(dst.nodes[2].ref).toEqual(src.nodes[1].id);
    expect(dst.nodes[3].ref).toEqual(src.nodes[2].id);
  });

  /**
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

    diffpatch(src, dst);

    expect(dst.nodes[0].ref).toEqual(src.nodes[0].id);
    expect(dst.nodes[1].ref).toEqual(src.nodes[1].id);
    expect(dst.nodes[3].ref).toEqual(src.nodes[2].id);
  });

  it("add in the middle", () => {
    const src: Module = { id: next(), nodes: [{ id: next() }, { id: next() }] };
    const dst: Module = {
      id: next(),
      nodes: [
        { id: next(), ref: src.nodes[0].id },
        { id: next() },
        { id: next(), ref: src.nodes[1].id },
      ],
    };

    src.nodes.splice(1, 0, { id: next() });

    diffpatch(src, dst);

    expect(dst.nodes[0].ref).toEqual(src.nodes[0].id);
    expect(dst.nodes[2].ref).toEqual(src.nodes[1].id);
    expect(dst.nodes[3].ref).toEqual(src.nodes[2].id);
  });

  /**
   * t0:
   *   0(1(2, 3))
   *   4(1'(2', 3'))
   *
   * t1:
   *   0(1(3, 2))
   *   4(1'(3', 2'))
   */
  describe("recursive", () => {
    it("move", () => {
      const src: Module = {
        id: next(),
        nodes: [{ id: next(), nodes: [{ id: next() }, { id: next() }] }],
      };
      const dst: Module = {
        id: next(),
        nodes: [
          {
            id: next(),
            ref: src.nodes[0].id,
            nodes: [
              { id: next(), ref: src.nodes.at(0)?.nodes?.at(0)?.id },
              { id: next(), ref: src.nodes.at(0)?.nodes?.at(1)?.id },
            ],
          },
        ],
      };

      move(
        // @ts-expect-error
        src.nodes.at(0)?.nodes?.at(0),
        src.nodes.at(0)?.nodes,
        src.nodes.at(0)?.nodes,
        1
      );

      diffpatch(src, dst);

      expect(dst.nodes.at(0)?.nodes?.at(0)?.ref).toEqual(
        src.nodes.at(0)?.nodes?.at(0)?.id
      );
      expect(dst.nodes.at(0)?.nodes?.at(1)?.ref).toEqual(
        src.nodes.at(0)?.nodes?.at(1)?.id
      );
    });

    /**
     * t0:
     *   0(1(2, 3))
     *   4(1'(2', 3'))
     *
     * t1:
     *   0(2, 1(3))
     *   4(2', 1'(3'))
     */
    it("move to ancestor", () => {
      const src: Module = {
        id: next(),
        nodes: [{ id: next(), nodes: [{ id: next() }, { id: next() }] }],
      };
      const dst: Module = {
        id: next(),
        nodes: [
          {
            id: next(),
            ref: src.nodes[0].id,
            nodes: [
              { id: next(), ref: src.nodes.at(0)?.nodes?.at(0)?.id },
              { id: next(), ref: src.nodes.at(0)?.nodes?.at(1)?.id },
            ],
          },
        ],
      };

      move(
        // @ts-expect-error
        src.nodes.at(0)?.nodes?.at(0),
        src.nodes.at(0)?.nodes,
        src.nodes,
        0
      );

      diffpatch(src, dst);

      expect(dst.nodes.at(0)?.ref).toEqual(src.nodes.at(0)?.id);
      expect(dst.nodes.at(1)?.ref).toEqual(src.nodes.at(1)?.id);
      expect(dst.nodes.at(1)?.nodes?.at(0)?.ref).toEqual(
        src.nodes.at(1)?.nodes?.at(0)?.id
      );
      expect(dst.nodes.length).toEqual(src.nodes.length);
      expect(dst.nodes.at(1)?.nodes?.length).toEqual(
        src.nodes.at(1)?.nodes?.length
      );
    });

    /**
     * t0:
     *   0(1, 2(3))
     *   4(1', 2'(3'))
     *
     * t1:
     *   0(2(1, 3))
     *   4(2'(1', 3'))
     */
    it("move to child", () => {
      const src: Module = {
        id: next(),
        nodes: [{ id: next() }, { id: next(), nodes: [{ id: next() }] }],
      };
      const dst: Module = {
        id: next(),
        nodes: [
          { id: next(), ref: src.nodes[0].id },
          {
            id: next(),
            ref: src.nodes[1].id,
            nodes: [{ id: next(), ref: src.nodes.at(1)?.nodes?.at(0)?.id }],
          },
        ],
      };

      move(
        // @ts-expect-error
        src.nodes.at(0),
        src.nodes,
        src.nodes.at(1)?.nodes,
        0
      );

      diffpatch(src, dst);

      expect(dst.nodes.at(0)?.ref).toEqual(src.nodes.at(0)?.id);
      expect(dst.nodes.at(0)?.nodes?.at(0)?.ref).toEqual(
        src.nodes.at(0)?.nodes?.at(0)?.id
      );
      expect(dst.nodes.at(0)?.nodes?.at(1)?.ref).toEqual(
        src.nodes.at(0)?.nodes?.at(1)?.id
      );
    });
  });
});
