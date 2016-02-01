var webpack = require('webpack');
var cwd = process.cwd();
var path = require('path');
var expect = require('expect');

var CollectBemAssetsPlugin = require(path.join(cwd, 'index')).CollectBemAssetsPlugin;

describe('CollectBemAssetsPlugin', () => {
    it('should set data', (done) => {
        var setDataWasCalled = false;
        var expectingResults = {
            button: [
                path.join(cwd, 'test/bem-project/common.blocks/button/button.css'),
                path.join(cwd, 'test/bem-project/common.blocks/button/_theme/button_theme_test.css'),
                path.join(cwd, 'test/bem-project/common.blocks/button/_theme/button_theme_x1.css')
            ],
            select: [
                path.join(cwd, 'test/bem-project/common.blocks/button/button.css'),
                path.join(cwd, 'test/bem-project/common.blocks/select/select.css'),
                path.join(cwd, 'test/bem-project/common.blocks/button/_theme/button_theme_test.css'),
                path.join(cwd, 'test/bem-project/common.blocks/button/_theme/button_theme_x1.css'),
            ]
        };
        var data;
        var webpackConfig = {
            plugins: [
                new CollectBemAssetsPlugin({
                    setData: function(_data) {
                        setDataWasCalled = true;
                        data = _data;
                    },
                    tech: 'css',
                    levels: [
                        path.join(cwd, './test/bem-project/common.blocks'),
                    ]
                }),
            ],
        };

        webpack(webpackConfig, (err, state) => {
            expect(err).toNotExist();
            expect(data).toEqual(expectingResults);
            expect(setDataWasCalled).toBe(true);
            done();
        });
    });
});


