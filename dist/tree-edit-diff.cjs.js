'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./tree-edit-diff.cjs.prod.js");
} else {
  module.exports = require("./tree-edit-diff.cjs.dev.js");
}
