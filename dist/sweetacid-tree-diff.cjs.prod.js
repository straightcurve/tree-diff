'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}

function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

function _createForOfIteratorHelper(r, e) {
  var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (!t) {
    if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) {
      t && (r = t);
      var n = 0,
        F = function () {};
      return {
        s: F,
        n: function () {
          return n >= r.length ? {
            done: !0
          } : {
            done: !1,
            value: r[n++]
          };
        },
        e: function (r) {
          throw r;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var o,
    a = !0,
    u = !1;
  return {
    s: function () {
      t = t.call(r);
    },
    n: function () {
      var r = t.next();
      return a = r.done, r;
    },
    e: function (r) {
      u = !0, o = r;
    },
    f: function () {
      try {
        a || null == t.return || t.return();
      } finally {
        if (u) throw o;
      }
    }
  };
}

function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}

function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}

function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}

function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}

function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r);
}

function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _toConsumableArray(r) {
  return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}

function move(node, srcNodes, dstNodes, index) {
  srcNodes.splice(srcNodes.indexOf(node), 1);
  dstNodes.splice(index, 0, node);
}
function expose(node) {
  node.hidden = false;
}
function hide(node) {
  node.hidden = true;
}
function recFind(root, predicate, parent) {
  if (!root) return undefined;
  if (predicate(root, parent)) return {
    node: root,
    parent: parent
  };
  if (!root.nodes) return undefined;
  var _iterator = _createForOfIteratorHelper(root.nodes),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var node = _step.value;
      var x = recFind(node, predicate, root);
      if (x !== undefined) return x;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return undefined;
}

function internalDiff(src, dst) {
  var dstRoot = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : dst;
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
    ignoreHidden: false,
    forceHide: false
  };
  var ignoreHidden = options.ignoreHidden,
    forceHide = options.forceHide;
  var operations = [];
  if (!src.nodes) return operations;
  if (!dst.nodes) return operations;

  /** basically a counter for dst nodes */
  var skipCount = 0;

  /** ignore amount starting from beginning due to add operations changing order */
  var ignoreCount = 0;
  var _loop = function _loop() {
    var _dstNode;
    var srcNode = src.nodes[i];
    var dstNode;
    var found = false;
    var hasRef = false;
    while (!hasRef && !found && i + skipCount - ignoreCount < dst.nodes.length) {
      dstNode = dst.nodes[i + skipCount - ignoreCount];
      found = srcNode.id === dstNode.ref;
      if (!!dstNode.ref) {
        //  if dstNode is ref'd from another tree, skip it
        var existing = recFind(src, function (n) {
          return n.id === dstNode.ref;
        });
        if (!existing) {
          hasRef = false;
          skipCount++;
        } else {
          hasRef = true;
        }
      } else {
        hasRef = false;
        skipCount++;
      }
    }
    if (!found) {
      var _existing = recFind(dstRoot, function (n) {
        return n.ref === srcNode.id;
      });
      if (!_existing) {
        if (ignoreHidden || !srcNode.hidden) {
          operations.push({
            kind: "add",
            node: srcNode,
            dstNodes: dst.nodes,
            index: i + skipCount
          });
        }
        ignoreCount++;
      } else {
        var _existing$parent;
        if (!((_existing$parent = _existing.parent) !== null && _existing$parent !== void 0 && _existing$parent.nodes)) throw new Error("something went wrong in recFind()");
        dstNode = _existing.node;
        operations.push({
          kind: "move",
          node: dstNode,
          srcNodes: _existing.parent.nodes,
          dstNodes: dst.nodes,
          index: i + skipCount
        });
        if (forceHide || !ignoreHidden && srcNode.hidden) {
          operations.push({
            kind: "hide",
            node: dstNode
          });
          operations.push.apply(operations, _toConsumableArray(internalDiff(srcNode, dstNode, dstRoot, _objectSpread2(_objectSpread2({}, options), {}, {
            forceHide: true
          }))));
        } else if (!ignoreHidden && !srcNode.hidden && dstNode.hidden) {
          operations.push({
            kind: "expose",
            node: dstNode
          });
          operations.push.apply(operations, _toConsumableArray(internalDiff(srcNode, dstNode, dstRoot, options)));
        } else {
          operations.push.apply(operations, _toConsumableArray(internalDiff(srcNode, dstNode, dstRoot, options)));
        }
      }
      return 1; // continue
    }
    if (forceHide || !ignoreHidden && srcNode.hidden) {
      operations.push({
        kind: "hide",
        node: dstNode
      });
      operations.push.apply(operations, _toConsumableArray(internalDiff(srcNode, dstNode, dstRoot, _objectSpread2(_objectSpread2({}, options), {}, {
        forceHide: true
      }))));
    } else if (!ignoreHidden && !srcNode.hidden && (_dstNode = dstNode) !== null && _dstNode !== void 0 && _dstNode.hidden) {
      operations.push({
        kind: "expose",
        node: dstNode
      });
      operations.push.apply(operations, _toConsumableArray(internalDiff(srcNode, dstNode, dstRoot, options)));
    } else {
      operations.push.apply(operations, _toConsumableArray(internalDiff(srcNode, dstNode, dstRoot, options)));
    }
  };
  for (var i = 0; i < src.nodes.length; i++) {
    if (_loop()) continue;
  }
  return operations;
}
function internalPatch(operations) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      ignoreHidden: true
    },
    ignoreHidden = _ref.ignoreHidden;
  var _iterator = _createForOfIteratorHelper(operations),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var op = _step.value;
      switch (op.kind) {
        case "move":
          {
            move(op.node, op.srcNodes, op.dstNodes, op.index);
            break;
          }
        case "hide":
          {
            hide(op.node);
            break;
          }
        case "expose":
          {
            expose(op.node);
            break;
          }
        case "add":
          {
            var _op$newId;
            op.dstNodes.splice(op.index, 0, _objectSpread2(_objectSpread2({}, op.node), {}, {
              ref: op.node.id,
              id: (_op$newId = op.newId) !== null && _op$newId !== void 0 ? _op$newId : op.node.id,
              hidden: ignoreHidden ? false : op.node.hidden
            }));
          }
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}

function diffpatch(src, dst, options) {
  internalPatch(internalDiff(src, dst, dst, options), options);
}
function diff(src, dst, options) {
  return internalDiff(src, dst, dst, options);
}
function patch(operations) {
  return internalPatch(operations);
}

exports["default"] = diffpatch;
exports.diff = diff;
exports.patch = patch;
