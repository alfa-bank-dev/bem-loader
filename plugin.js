var getAssets = require('./lib/getAssets');
var getDeps = require('./lib/getDeps');
var path = require('path');

/**
 * @param options
 *    - setData callback
 *    - levels
 *    - tech
 */
function CollectBemAssetsPlugin(options) {
    this.options = options;
    this.cssPaths = [];
};

CollectBemAssetsPlugin.prototype.apply = function(compiler) {
    var handler = (params, callback) => {
        getAssets(this.options.levels).then((res) => {
            var blocks = Object.keys(res[this.options.tech]);
            blocks.forEach(block => {
                this.cssPaths = this.cssPaths.concat(res[this.options.tech][block]);
            });

            return getDeps(blocks, this.options.levels);
        }).then((deps) => {
            var results = {};
            deps.forEach((depData) => {
                var blockDeps = depData.deps;
                var tech = this.options.tech;
                var tmpResults = blockDeps.map(dep => {
                    var path = `${dep.block}/`;
                    if (!dep.elem && !dep.modName) {
                        return `${path}${dep.block}.${tech}`;
                    }

                    if (dep.elem) {
                        path += `__${dep.elem}/${dep.block}__${dep.elem}.${tech}`;
                    }

                    if (dep.modName && dep.modVal) {
                        if (dep.modVal === true) {
                            path += `_${dep.modName}/${dep.block}_${dep.modName}.${tech}`;
                        } else {
                            path += `_${dep.modName}/${dep.block}_${dep.modName}_${dep.modVal}.${tech}`;
                        }
                    }

                    return path;
                });

                var allPossiblePaths = [];
                this.options.levels.forEach(level => {
                    allPossiblePaths = allPossiblePaths.concat(tmpResults.map(r => path.join(level, r)));
                });

                results[depData.block] = allPossiblePaths.filter(p => this.cssPaths.indexOf(p) !== -1);
            });

            this.options.setData(results);

            callback();
        }).catch(callback);
    };

    compiler.plugin('watch-run', handler);
    compiler.plugin('run', handler);
};

module.exports = CollectBemAssetsPlugin;
