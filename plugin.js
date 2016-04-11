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
 *    - techExtensions - a hash map techName => String[] - it's possible that tech has more than one extension
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

function getTechExtensions(tech, extensions) {
    return extensions && extensions[tech] && extensions[tech].length > 0
        ? extensions[tech]
        : [tech];
}

CollectBemAssetsPlugin.prototype.apply = function(compiler) {
    var handler = (params, callback) => {
        getAssets(this.options.levels).then((res) => {
            var allBlocks = [];
            this.options.techs.forEach(tech => {
                this.possiblePaths[tech] = [];
                var techExtensions = getTechExtensions(tech, this.options.techExtensions).filter(t => res[t]);

                if (techExtensions.length === 0) {
                    return;
                }

                var blocks = techExtensions
                    .map(t => Object.keys(res[t]))
                    .reduce((acc, blocks) => acc.concat(blocks), []);
                allBlocks = allBlocks.concat(blocks);

                blocks.forEach(block => {
                    this.possiblePaths[tech] = this.possiblePaths[tech]
                        .concat(techExtensions
                            .map(t => res[t][block])
                            .reduce((acc, paths) => acc.concat(paths), []));
                });
                this.possiblePaths[tech] = this.possiblePaths[tech].filter(p => p);
            });

            return getDeps(_.uniq(allBlocks), this.options.levels);
        }).then((deps) => {
            var results = {};
            var tmpResults = [];

            this.options.techs.forEach(tech => {
                results[tech] = {};
                var techExtensions = getTechExtensions(tech, this.options.techExtensions);

                deps.forEach(depData => {
                    tmpResults = depData.deps.map(dep => {
                        return techExtensions.map(t => {
                            var path = generateBemPath(dep, t);

                            if (!path) {
                                throw new Error(`Cannot generate
                                    correct path to file using dep ${dep}`);
                            }

                            return path;
                        });
                    }).reduce((acc, paths) => acc.concat(paths), []);

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
