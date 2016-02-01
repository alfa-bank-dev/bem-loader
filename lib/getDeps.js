var bemDeps = require('@bem/deps');
var toArray = require('stream-to-array');

/**
 * Returns dependencies for passed blocks.
 *
 * @param entities - a list of blocks
 * @param levels - a list of paths to bem levels
 * @return Promise
 */
module.exports = function getDeps(entities, levels) {
    return new Promise((resolve, reject) => {
        toArray(bemDeps.load({ levels }), (err, relations) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(entities.map((block) => {
                return { block, deps: bemDeps.resolve([{ block }], relations).entities };
            }));
        });
    });
};
