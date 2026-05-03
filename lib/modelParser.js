const cds = require("@sap/cds");
const fs = require("fs");
const path = require("path");

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function parseModel(options, config) {
  const csn = await cds.load(options.modelRoot + "/*").then(cds.minify);
  cds.model = cds.compile.for.nodejs(csn);

  function getNamespace(sName) {
    return sName.substring(0, sName.lastIndexOf("."));
  }

  fs.mkdirSync(options.dir, { recursive: true });

  function toRegex(patterns) {
    const alts = patterns.map((p) => "(" + p.split("*").map(escapeRegex).join(".*") + ")");
    return new RegExp("^" + alts.join("|") + "$", "i");
  }

  for (const name in config) {
    const graphConf = config[name];

    const effectiveType = graphConf.type || options.type;
    const fPrinter = effectiveType == "mermaid" ? require("./mermaid") : require("./plantUML");
    const effectiveOptions = { ...options, type: effectiveType, asMarkdown: graphConf.asMarkdown ?? options.asMarkdown };

    const includesRegex = graphConf.includes ? toRegex(graphConf.includes) : null;
    const excludesRegex = graphConf.excludes ? toRegex(graphConf.excludes) : null;

    const entities = Object.values(cds.model.definitions).filter((a) =>
      isEntity(a) &&
      (!graphConf.includes || includesRegex.test(a.name)) &&
      (!graphConf.excludes || !excludesRegex.test(a.name))
    );

    fs.writeFileSync(path.join(options.dir, name), await fPrinter(entities, graphConf, effectiveOptions), { encoding: "utf-8" });
  }

  function isEntity(entity) {
    return entity?.kind == "entity" && !entity._service;
  }
}

module.exports = parseModel;
