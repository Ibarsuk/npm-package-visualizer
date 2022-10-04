"use strict";

class GraphBuilder {
  constructor(dependencies) {
    this.dependencies = dependencies;
  }

  _getGraphStatement(entry) {
    const dependencies = entry[1]
      .map((dependency) => `"${dependency}"`)
      .join(" ");
    const packageName = entry[0];
    return `{${dependencies}} -> "${packageName}";`;
  }

  getGraph() {
    const graphStatements = Object.entries(this.dependencies).map((entry) =>
      this._getGraphStatement(entry)
    );

    return `digraph G {
\t${graphStatements.join(`\n\t`)}
}`;
  }
}

module.exports = GraphBuilder;
