var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');
var existsAsync = (path) => {
    return new Promise((resolve) => {
        fs.stat(path, (err, res) => {
            if (res) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
};

var writeFileAsync = Promise.promisify(fs.writeFile);
var POSTFIX = 'css';

/**
 * @params { Object } - options
 *  - componentNames
 *  - pathsToComponents
 *  - stubsDir
 */
function StubsCreatorPlugin(options) {
    this.options = options;
}

StubsCreatorPlugin.prototype.apply = function(compiler) {

    var stubsDir = this.options.stubsDir;
    var stubsIndex = path.resolve(stubsDir, 'index.js');

    var handler = (params, callback) => {
        var stubsToCreate = [];
        var genStubItem = (n) => {
            return {
                name: n,
                path: `${path.resolve(stubsDir, n)}.${POSTFIX}`,
            };
        };

        if (this.options.pathsToComponents) {
            this.options.pathsToComponents.forEach(p => {
                stubsToCreate = stubsToCreate.concat(
                    fs.readdirSync(p).map(genStubItem)
                );
            });
        } else {
            stubsToCreate = this.options.componentNames.map(genStubItem);
        }

        existsAsync(stubsDir).then(exists => {
            if (!exists) {
                fs.mkdirSync(stubsDir);
            }

            return Promise.all(stubsToCreate.map(s => existsAsync(s.path)));
        }).then(res => {
            return res.map((r, i) => {
                return {
                    exists: r,
                    path: stubsToCreate[i].path,
                };
            }).filter(a => !a.exists);
        }).then(res => {
            return Promise.all(res.map(r => writeFileAsync(r.path, '')));
        }).then(() => {
            return existsAsync(stubsIndex);
        }).then((exists) => {
            if (!exists) { // we'd like to not create new files because of watch mode
                fs.writeFileSync(stubsIndex, stubsToCreate.map(s => {
                    return `require('bem-css-loader!./${s.name}.css');`;
                }).join('\n'));
            }
        }).then(() => {
            callback();
        });
    };

    compiler.plugin('watch-run', handler);
    compiler.plugin('run', handler);
};

module.exports = StubsCreatorPlugin;
