"use strict";

const { AxiosError } = require("axios");
const chalk = require("chalk");
const api = require("./api");

class DependencyProcessor {
  constructor(packageName) {
    this._packageName = packageName;
    this._packagesStack = [];
    this._dependencies = {};
  }

  _extractDependencies(packageInfo) {
    const versions = packageInfo.versions;
    const versionsKeys = Object.keys(versions);
    const lastVersion = versions[versionsKeys[versionsKeys.length - 1]];

    return lastVersion.dependencies &&
      Object.keys(lastVersion.dependencies).length
      ? Object.keys(lastVersion.dependencies)
      : null;
  }

  async _processPackage(packageName) {
    console.info(chalk.gray(`processing ${packageName}`));
    if (this._dependencies[packageName]) return;

    try {
      const res = await api.get(packageName);
      const packageDependencies = this._extractDependencies(res.data);

      if (!packageDependencies) return;

      this._dependencies[packageName] = packageDependencies;
      this._packagesStack.push(...packageDependencies);
    } catch (e) {
      if (e instanceof AxiosError) {
        console.warn(
          chalk.yellow(
            `Haven't managed to access '${packageName}' package with status ${res.status}. Graph is not full!`
          )
        );
      } else {
        console.error(chalk.red(e));
      }
    }
  }

  async getDependencies() {
    this._packagesStack.push(this._packageName);

    while (this._packagesStack.length) {
      await this._processPackage(this._packagesStack.pop());
    }

    return this._dependencies;
  }
}

module.exports = DependencyProcessor;
