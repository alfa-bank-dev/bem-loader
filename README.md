BEM loader
==============

[![Build Status](https://travis-ci.org/alfa-bank-dev/bem-loader.svg?branch=master)](https://travis-ci.org/alfa-bank-dev/bem-loader)

The module has several purposes:
 - load CSS from bem-based project
 - provide functions to combine bemhtml templates from bem-based project


Loading CSS
------------

It's necessary to set up plugin:

```js
    // -----> in webpack.config.js
    var loader = require('bem-loader');
    var CollectBemAssetsPlugin = loader.CollectBemAssetsPlugin;

    module.exports = {
        // ...

        plugins: [
            new CollectBemAssetsPlugin({
                done: loader.setData, // pass setData callback into plugin
                techs: ['css', 'bemhtml'], // or maybe post.css
                // where to search css
                levels: [
                    './bem-project/common.blocks'),
                ]
            }),
        ]
    };
```

And use loader:

```js

    // -----> somewhere in code
    require('bem-loader!./button.css'); // this file have to exist and should be created manually,
                                            // also a name of the file is the name of BEM-block

    // ... Webpack should handle everything else
```

You can also generate stubs using StubsCreatorPlugin:

```js
    // -----> in webpack.config.js
    var loader = require('bem-loader');
    var CollectBemAssetsPlugin = loader.StubsCreatorPlugin;

    var stubsDir = './bem-stubs';
    module.exports = {
        // ...

        plugins: [
            new StubsCreatorPlugin({
                stubsDir,
                componentNames: [
                    'button',
                    'select',
                ],
                // or if you want to generate stubs for all components in some library
                // pathsToComponents: [ 'src/components' ]
            }),
        ]
    };

```

And somethere in your code:

```js
    require('./bem-stubs');
```


Loading BEMHTML
---------------

```js

    // -----> in webpack.config.js
    var loader = require('bem-loader');
    var CollectBemAssetsPlugin = loader.CollectBemAssetsPlugin;
    var generateBemHtml = loader.generateBemHtml;

    module.exports = {
        plugins: [
            new CollectBemAssetsPlugin({
                done: function(data) {
                    if (process.env.STANDALONE) {
                        // e.g.
                        var out = bemxjst.vidom.generate(generateBemHtml(data.bemhtml));
                        fs.writeFileSync(
                            './dist/bem-templates.js',
                            out
                        );
                    }
                },
                techs: ['bemhtml'],
                levels: [
                    './bem-project/common.blocks'),
                ]

            }),
        ],
    };
```
