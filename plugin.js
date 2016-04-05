var getAssets = require('./lib/getAssets');
var getDeps = require('./lib/getDeps');
var path = require('path');
var bemNaming = require('bem-naming');
var _ = require('lodash');

/**
 * @param options
 *    - done callback
 *    - levels
 *    - techs - array of techs
 */
function CollectBemAssetsPlugin(options) {
    this.options = options;
    this.assets = {};
    this.possiblePaths = {};
}

function generateBemPath(dep, tech) {
    var path = `${dep.block}/`;
    var filename = `${bemNaming.stringify(dep)}.${tech}`;

    if (bemNaming.isBlock(dep)) {
        path = `${path}${filename}`;
    }

    if (bemNaming.isElem(dep)) {
        path = `${path}__${dep.elem}/${filename}`;
    }

    if (bemNaming.isBlockMod(dep)) {
        path = `${path}_${dep.modName}/${filename}`;
    }

    if (bemNaming.isElemMod(dep)) {
        path = `${path}__${dep.elem}/_${dep.modName}/${filename}`;
    }

    return path;
}

CollectBemAssetsPlugin.prototype.apply = function(compiler) {
    var handler = (params, callback) => {
        getAssets(this.options.levels).then((res) => {
            var allBlocks = [];
            this.options.techs.forEach(tech => {
                this.possiblePaths[tech] = [];

                if (!res[tech]) {
                    this.possiblePaths[tech] = [];
                    return;
                }

                var blocks = Object.keys(res[tech]);
                allBlocks = allBlocks.concat(blocks);

                blocks.forEach(block => {
                    this.possiblePaths[tech] = this.possiblePaths[tech].concat(res[tech][block]);
                });
            });

            return getDeps(_.uniq(allBlocks), this.options.levels);
        }).then((deps) => {
            var results = {};
            var tmpResults = [];

            this.options.techs.forEach(tech => {
                results[tech] = {};
                deps.forEach(depData => {
                    tmpResults = depData.deps.map(dep => {
                        var path = generateBemPath(dep, tech);

                        if (!path) {
                            throw new Error(`Cannot generate
                                correct path to file using dep ${dep}`);
                        }

                        return path;
                    });

                    var allPossiblePaths = [];
                    this.options.levels.forEach(level => {
                        allPossiblePaths = allPossiblePaths.concat(tmpResults.map(r => path.join(level, r)));
                    });

                    results[tech][depData.block] = allPossiblePaths
                        .filter(p => this.possiblePaths[tech].indexOf(p) !== -1);
                });
            });
            this.options.done(results);
        }).then(callback).catch((err) => {
            console.log(err);
            callback(err);
        });
    };

    compiler.plugin('watch-run', handler);
    compiler.plugin('run', handler);
};

module.exports = CollectBemAssetsPlugin;
