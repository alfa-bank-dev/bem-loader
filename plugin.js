var getAssets = require('./lib/getAssets');
var getDeps = require('./lib/getDeps');
var path = require('path');
var bemNaming = require('bem-naming');

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
                    var filename = `${bemNaming.stringify(dep)}.${tech}`;

                    if (bemNaming.isBlock(dep)) {
                        return `${path}${filename}`;
                    }

                    if (bemNaming.isElem(dep)) {
                        return `${path}/__${dep.elem}/${filename}`;
                    }

                    if (bemNaming.isBlockMod(dep)) {
                        return `${path}/_${dep.modName}/${filename}`;
                    }

                    if (bemNaming.isElemMod(dep)) {
                        return `${path}/__${dep.elem}/_${dep.modName}/${filename}`;
                    }

                    throw new Error(`Cannot generate correct path to file using dep ${dep}`);
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
