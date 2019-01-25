#!/usr/bin/env node

process.env.NODE_PATH = `${__dirname}/../node_modules/`;

const path = require("path");
const program = require("commander");

const cmd = function(cmd) {
  require(`../commands/${cmd}.js`);
};

program
  .version(require("../package.json").version)
  .usage("<command> [options]")
  .command("generate")
  .description("create a padekuai-based project")
  .alias("gen")
  .action(() => {
    cmd("generate");
  });

program.parse(process.argv);
