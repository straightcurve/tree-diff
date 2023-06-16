'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}

function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}

function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      var F = function () {};
      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function () {
      it = it.call(o);
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function move(node, srcNodes, dstNodes, index) {
  srcNodes.splice(srcNodes.indexOf(node), 1);
  dstNodes.splice(index, 0, node);
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
      var _node = _step.value;
      var x = recFind(_node, predicate, root);
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
  var operations = [];
  if (!src.nodes) return operations;
  if (!dst.nodes) return operations;

  /** basically a counter for dst nodes */
  var skip = 0;

  /** ignore amount starting from beginning due to add operations changing order */
  var ignore = 0;
  var _loop = function _loop() {
    var srcNode = src.nodes[i];
    var dstNode;
    var found = false;
    var hasRef = false;
    while (!hasRef && !found && i + skip - ignore < dst.nodes.length) {
      dstNode = dst.nodes[i + skip - ignore];
      found = srcNode.id === dstNode.ref;
      hasRef = !!dstNode.ref;
      if (!hasRef) skip++;
    }
    if (!found) {
      var existing = recFind(dstRoot, function (n) {
        return n.ref === srcNode.id;
      });
      if (!existing) {
        operations.push({
          kind: "add",
          node: srcNode,
          dstNodes: dst.nodes,
          index: i + skip
        });
        ignore++;
      } else {
        var _existing$parent;
        if (!((_existing$parent = existing.parent) !== null && _existing$parent !== void 0 && _existing$parent.nodes)) throw new Error("something went wrong in recFind()");
        operations.push({
          kind: "move",
          node: existing.node,
          srcNodes: existing.parent.nodes,
          dstNodes: dst.nodes,
          index: i + skip
        });
        operations.push.apply(operations, _toConsumableArray(internalDiff(srcNode, existing.node, dstRoot)));
      }
      return "continue";
    }
    if (srcNode.hidden) {
      operations.push({
        kind: "hide",
        node: dstNode
      });
    } else {
      operations.push.apply(operations, _toConsumableArray(internalDiff(srcNode, dstNode, dstRoot)));
    }
  };
  for (var i = 0; i < src.nodes.length; i++) {
    var _ret = _loop();
    if (_ret === "continue") continue;
  }
  return operations;
}
function internalPatch(operations) {
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
        case "add":
          {
            op.dstNodes.splice(op.index, 0, _objectSpread2(_objectSpread2({}, op.node), {}, {
              ref: op.node.id
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

function diffpatch(src, dst) {
  internalPatch(internalDiff(src, dst));
}
function diff(src, dst) {
  return internalDiff(src, dst);
}
function patch(operations) {
  return internalPatch(operations);
}

exports["default"] = diffpatch;
exports.diff = diff;
exports.patch = patch;
