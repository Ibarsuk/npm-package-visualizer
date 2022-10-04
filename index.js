"use strict";
const chalk = require("chalk");
const DependencyProcessor = require("./src/DependencyProcessor");
const GraphBuilder = require("./src/GraphBuilder");
const fs = require(`fs`).promises;

const args = process.argv.slice(2);

const packageName = args[0];
const file = args[1];

if (!packageName) {
  console.error(chalk.red(`Package name argument required`));
  process.exit(1);
}

(async () => {
  const dependencyProcessor = new DependencyProcessor(packageName);
  const dependencies = await dependencyProcessor.getDependencies();

  const graphBuilder = new GraphBuilder(dependencies);
  const graph = graphBuilder.getGraph();

  if (file) {
    await fs.writeFile(file, graph);
    console.info(chalk.green(`Graph saved to ${file}`));
    process.exit(0);
  } else {
    console.info(chalk.blue(graph));
  }
})();
