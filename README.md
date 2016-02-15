BEM CSS loader
==============

[![Build Status](https://travis-ci.org/alfa-bank-dev/bem-css-loader.svg?branch=master)](https://travis-ci.org/alfa-bank-dev/bem-css-loader)

The aim of this loader and plugin is to require needed css files from BEM project into Webpack one.
It's necessary to set up plugin:

```js
    // -----> in webpack.config.js
    var loader = require('bem-css-loader');
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
    require('bem-css-loader!./button.css'); // this file have to exist and should be created manually,
                                            // also a name of the file is the name of BEM-block

    // ... Webpack should handle everything else
```

You can also generate stubs using StubsCreatorPlugin:

```js
    // -----> in webpack.config.js
    var loader = require('bem-css-loader');
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
