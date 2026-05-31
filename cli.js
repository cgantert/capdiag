#!/usr/bin/env node
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const modelParser = require("./lib/modelParser");
const fs = require("fs");

const CONFIG_FILNAME = "./.capdiag.json";

module.exports = exports;

exports.exec = async () => {
  const options = yargs(hideBin(process.argv))
    .usage(
      "Generates class diagrams from SAP CAP/NodeJS models.\n\nUsage: cap-diag [options]",
    )
    .option("type", {
      alias: "t",
      describe: "choose a diagram type, overridden by config file",
      default: "mermaid",
      choices: ["mermaid", "plantUML", "svg"],
    })
    .option("config", {
      describe: "Full path of diagram configuration file",
      type: "string",
    })
    .option("dir", {
      alias: "D",
      describe: "Path of the target director in which to place the generated diagram files",
      default: "diagrams",
      type: "string",
    })
    .option("modelRoot", {
      alias: "m",
      describe: "Root directory of the CDS model. All CDS files within it are loaded.",
      default: ".",
      type: "string",
    })
    .option("asMarkdown", {
      alias: "md",
      describe: "Wrap Mermaid output in a ```mermaid code block (ignored for other diagram types).",
      type: "boolean",
      default: true,
    })
    .help()
    .alias("help", "h")
    .parse();

  var config = null;

  if (options.config) {
    try {
      config = JSON.parse(fs.readFileSync(options.config, "utf8"));
    } catch (e) {
      console.log(
        `Configuration file '${options.config}' either does not exist or cannot be parsed.`,
      );
      process.exit(1);
    }
  } else {
    if (fs.existsSync(CONFIG_FILNAME)) {
      try {
        config = JSON.parse(fs.readFileSync(CONFIG_FILNAME, "utf8"));
      } catch (e) {
        console.log(
          `Default configuration file '${CONFIG_FILNAME}' cannot be parsed.`,
        );
        process.exit(1);
      }
    } else {
      config = { "all.md": {} };
    }
  }
  await modelParser(options, config);
  return;
};

if (require.main === module) exports.exec();
