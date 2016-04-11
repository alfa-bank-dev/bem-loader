var webpack = require('webpack');
var cwd = process.cwd();
var path = require('path');
var expect = require('expect');

var CollectBemAssetsPlugin = require(path.join(cwd, 'index')).CollectBemAssetsPlugin;

describe('CollectBemAssetsPlugin', () => {
    it('should set data', done => {
        var doneWasCalled = false;
        var expectingResults = {
            css: {
                button: [
                    path.join(cwd, 'test/bem-project/common.blocks/button/button.css'),
                    path.join(cwd, 'test/bem-project/common.blocks/button/__icon/button__icon.css'),
                    path.join(cwd, 'test/bem-project/common.blocks/button/__icon/_theme/button__icon_theme_black.css'),
                    path.join(cwd, 'test/bem-project/common.blocks/button/_theme/button_theme_test.css'),
                    path.join(cwd, 'test/bem-project/common.blocks/button/_theme/button_theme_x1.css'),
                ],
                select: [
                    path.join(cwd, 'test/bem-project/common.blocks/button/button.css'),
                    path.join(cwd, 'test/bem-project/common.blocks/select/select.css'),
                    path.join(cwd, 'test/bem-project/common.blocks/button/__icon/button__icon.css'),
                    path.join(cwd, 'test/bem-project/common.blocks/button/__icon/_theme/button__icon_theme_black.css'),
                    path.join(cwd, 'test/bem-project/common.blocks/button/_theme/button_theme_test.css'),
                    path.join(cwd, 'test/bem-project/common.blocks/button/_theme/button_theme_x1.css'),
                ],
                link: [],
            },
            bemhtml: {
                link: [
                    path.join(cwd, 'test/bem-project/common.blocks/link/link.bemhtml.js'),
                ],
                button: [
                    path.join(cwd, 'test/bem-project/common.blocks/button/button.bemhtml'),
                    path.join(cwd, 'test/bem-project/common.blocks/button/__icon/button__icon.bemhtml'),
                ],
                select: [
                    path.join(cwd, 'test/bem-project/common.blocks/button/button.bemhtml'),
                    path.join(cwd, 'test/bem-project/common.blocks/select/select.bemhtml'),
                    path.join(cwd, 'test/bem-project/common.blocks/button/__icon/button__icon.bemhtml'),
                ],
            },
            lololo: {
                button: [],
                select: [],
                link: [],
            },
        };
        var data;
        var webpackConfig = {
            plugins: [
                new CollectBemAssetsPlugin({
                    done: _data => {
                        doneWasCalled = true;
                        data = _data;
                    },

                    techs: ['css', 'bemhtml', 'lololo'],
                    techExtensions: { bemhtml: ['bemhtml', 'bemhtml.js'] },
                    levels: [
                        path.join(cwd, './test/bem-project/common.blocks'),
                    ],
                }),
            ],
        };

        webpack(webpackConfig, (err) => {
            expect(err).toNotExist();
            expect(data).toEqual(expectingResults);
            expect(doneWasCalled).toBe(true);
            done();
        });
    });
});
