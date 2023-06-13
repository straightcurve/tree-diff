'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./sweetacid-tree-diff.cjs.prod.js");
} else {
  module.exports = require("./sweetacid-tree-diff.cjs.dev.js");
}
