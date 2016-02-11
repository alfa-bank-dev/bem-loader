var path = require('path');
var _ = require('lodash');
var Promise = require('bluebird');
var fs = require('fs');
var readFile = Promise.promisify(fs.readFile);

module.exports = function() {};

var data = {};

module.exports.setData = function(_data) {
    data = _data;
};

module.exports.pitch = function(remainingRequest) {
    var blockName = path.basename(remainingRequest, `.css`);

    if (!data[blockName]) {
        throw new Error(`Styles for ${blockName} block is not defined`);
    }
    var styles = data[blockName];
    var requireStr = styles.reduce((prev, cur) => {
        return `${prev}require('${cur}');`;
    }, '');

    return `module.exports = (function() {
        ${requireStr}
    })();`;
};

// FIXME: move to separate repository
module.exports.CollectBemAssetsPlugin = require('./plugin');
// FIXME: move to separate repository
/**
 * @param files - list of paths to bemhtml stuff
 * @return Promise
 */
module.exports.generateBemHtml = function(files) {
    var paths = [];
    Object.keys(files).forEach(blockName => paths = paths.concat(files[blockName]));
    paths = _.uniq(paths);

    paths = paths.filter(p => !/ua.bemhtml|i-bem.bemhtml/.test(p));

    return paths.reduce((prev, cur) => {
        prev += fs.readFileSync(cur).toString();
        return prev;
    }, '');
};
