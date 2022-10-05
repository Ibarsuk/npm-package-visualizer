"use strict";

const { AxiosError } = require("axios");
const chalk = require("chalk");
const api = require("./api");

class DependencyProcessor {
  constructor(packageName) {
    this._packageName = packageName;
    this._packages = [];
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
      this._packages.push(...packageDependencies);
    } catch (e) {
      if (e instanceof AxiosError) {
        console.warn(
          chalk.yellow(
            `Haven't managed to access '${packageName}' package with status ${e.code}. Graph is not full!`
          )
        );
      } else {
        console.error(chalk.red(e));
      }
    }
  }

  _getDependencyPromises() {
    const promises = this._packages.map((packageName) =>
      this._processPackage(packageName)
    );
    this._packages = [];

    return promises;
  }

  async getDependencies() {
    this._packages.push(this._packageName);

    while (this._packages.length) {
      await Promise.all(this._getDependencyPromises());
    }

    return this._dependencies;
  }
}

module.exports = DependencyProcessor;
