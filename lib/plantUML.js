function printPlantUML(entities, graphConf) {
  function cutCDS(sName) {
    return sName.startsWith("cds.") ? sName.substring(4) : sName;
  }

  function score(element) {
    if (element.isAssociation) return 0;
    return element.key ? 2 : 1;
  }

  function sorter(elementA, elementB) {
    const scoreA = score(elementA), scoreB = score(elementB);
    return scoreB - scoreA !== 0
      ? scoreB - scoreA
      : elementA.name.localeCompare(elementB.name);
  }

  function included(entityName) {
    return !!entities.find((e) => e.name === entityName);
  }

  function printField(element) {
    return (element.key ? "  +" : "  ") +
      element.name +
      " : " +
      cutCDS(element.type) +
      (element.length && element.type !== "cds.UUID" ? "(" + element.length + ")" : "") +
      (element.precision ? "(" + element.precision + "," + element.scale + ")" : "");
  }

  let res = "@startuml\n";
  if (graphConf.title) res += "title " + graphConf.title + "\n";

  entities.forEach((entity) => {
    res += "class " + entity.name + " {\n";
    let relationships = "\n";
    Object.values(entity.elements)
      .toSorted(sorter)
      .forEach((element) => {
        if (element.isAssociation) {
          if (graphConf.includeAssociationsToExcludedTargets || included(element.target)) {
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
          if (!graphConf.noFields) {
            res += printField(element) + "\n";
          }
        }
      });
    res += "}\n";
    res += relationships + "\n";
  });

  res += "@enduml\n";
  return res;
}

module.exports = printPlantUML;
