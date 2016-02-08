var path = require('path');

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

module.exports.CollectBemAssetsPlugin = require('./plugin');
