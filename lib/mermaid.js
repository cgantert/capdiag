async function printMeramaid(entities, graphConf, options) {

  function cutCDS(sName) {
    return sName.startsWith("cds.") ? sName.substring(4) : sName;
  }

  function score(element) {
    if (element.isAssociation) return 0;
    else {
      if (element.key) return 2;
      return 1;
    }
  }

  function sorter(elementA, elementB) {
    let scoreA = score(elementA),
      scoreB = score(elementB);
    return scoreB - scoreA != 0
      ? scoreB - scoreA
      : elementA.name.localeCompare(elementB.name);
  }

  function included(entityName) {
    return !!entities.find((e) => e.name === entityName);
  }


  function printField(element) {
    return (element.key ? " +" : "  ") +
      cutCDS(element.type) +
      (element.length && element.type !== "cds.UUID" ? "~" + element.length + "~" : "") +
      (element.precision
        ? "~" + element.precision + "," + element.scale + "~"
        : "") +
      " : " +
      element.name;
  }

  let res = graphConf.title
    ? `---\ntitle: ${graphConf.title}\n---\nclassDiagram\n`
    : "classDiagram\n";

  entities.forEach((entity) => {
    res += "class " + entity.name + " {\n";
    let relationships = "\n";
    Object.values(entity.elements)
      .toSorted(sorter)
      .forEach((element) => {
        if (element.isAssociation) {
          if (
            graphConf.includeAssociationsToExcludedTargets ||
            included(element.target)
          ) {
            relationships +=
              entity.name +
              ' --> "' +
              (element.is2one ? "1" : "") +
              (element.is2many ? "0..N" : "") +
              '" ' +
              element.target +
              "\n";
          }
        } else {
          // not an association means it's a field
          if (!graphConf.noFields) {
            res +=
              printField(element) +
              "\n";
          }
        }
      });
    res += "}\n";
    res += relationships + "\n";
  });
  if (options?.asMarkdown) res = "```mermaid\n" + res + "```\n";
  return res;
}

module.exports = printMeramaid;
