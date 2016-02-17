var webpack = require('webpack');
var cwd = process.cwd();
var path = require('path');
var expect = require('expect');
var fs = require('fs');
var rmdir = require('rmdir');

var StubsCreatorPlugin = require(path.join(cwd, 'index')).StubsCreatorPlugin;

describe('StubsCreatorPlugin', () => {

    var stubsDir = path.resolve(cwd, 'test/bem-stubs');
    var stubsToCreate = [
        stubsDir,
        path.resolve(stubsDir, 'index.js'),
        path.resolve(stubsDir, 'button.css'),
        path.resolve(stubsDir, 'select.css'),
    ];

    afterEach((done) => {
        rmdir(stubsDir, done);
    });

    var checkStubs = function(webpackConfig, done) {
        webpack(webpackConfig, (err) => {
            expect(err).toNotExist();
            stubsToCreate.forEach(f => {
                var stat = fs.statSync(f);
                expect(stat).toExist();
            });

            var data = fs.readFileSync(path.resolve(stubsDir, 'index.js')).toString();
            ['button.css', 'select.css'].forEach(c => {
                expect(data.indexOf(`require('bem-loader!./${c}');`) !== -1).toBeTruthy();
            });

            done();
        });
    };

    it('should generate stubs using list of components', done => {
        var webpackConfig = {
            plugins: [
                new StubsCreatorPlugin({
                    stubsDir,
                    componentNames: [
                        'button',
                        'select',
                    ],
                }),
            ],
        };

        checkStubs(webpackConfig, done);
    });

    it('should generate stubs using paths to components', done => {
        var webpackConfig = {
            plugins: [
                new StubsCreatorPlugin({
                    stubsDir,
                    pathsToComponents: [
                        path.join(cwd, './test/components'),
                    ],
                }),
            ],
        };

        checkStubs(webpackConfig, done);
    });
});
