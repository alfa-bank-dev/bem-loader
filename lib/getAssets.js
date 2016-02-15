var walk = require('bem-walk');

/**
 * It will walk through bem levels and generate the list of assets divided by bem-technology.
 *
 * @paths - array of paths to bem levels
 * @return Promise
 */
module.exports = function getAssets(paths) {
    var results = {};

    var levels = {};
    paths.forEach(path => {
        levels[path] = { scheme: 'nested' };
    });
    var config = {
        levels,
    };

    return new Promise((resolve, reject) => {
        walk(paths, config)
            .on('data', (data) => {
                var name = data.entity.block;
                var tech = data.tech;
                if (!results[tech]) {
                    results[tech] = {};
                }

                if (!results[tech][name]) {
                    results[tech][name] = [];
                }

                results[tech][name].push(data.path);
            })
            .on('end', () => {
                resolve(results);
            })
            .on('errpr', reject);
    });
};
