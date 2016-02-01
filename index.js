var path = require('path');

module.exports = function() {};

var data = {
    blocks: {},
};

module.exports.setData = function(_data) {
    data = _data;
};

module.exports.pitch = function(remainingRequest) {
    var blockName = path.basename(remainingRequest, `.css`);

    if (!data.blocks[blockName]) {
        throw new Error(`Styles for ${blockName} block is not defined`);
    }
    var styles = data.blocks[blockName];
    var requireStr = styles.reduce((prev, cur) => {
        return `${prev}require('${cur}');`;
    }, '');

    return `module.exports = (function() {
        ${requireStr}
    })();`;
};

module.exports.CollectBemAssetsPlugin = require('./plugin');
