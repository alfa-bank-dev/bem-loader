var path = require('path');
var loader = require(path.join(process.cwd(), './index.js'));
var expect = require('expect');

describe('bem-css-loader', () => {

    it('should throw error', (done) => {
        try {
            loader.pitch.call({}, 'button.css');
        } catch(e) {
            expect(e.message).toBe('Styles for button block is not defined');
            done();
        }
    });

    it('should be ok', () => {
        loader.setData({
            blocks: {
                'button': [
                    'test.css',
                    'fooo-bar.css',
                ]
            }
        });

        var testParts = [
            'module.exports = (function() {',
            'require(\'test.css\');',
            'require(\'fooo-bar.css\');',
        ];
        var res = loader.pitch.call({ query: { tech: 'css' } }, 'button.css');
        testParts.forEach(part => {
            expect(res.indexOf(part)).toNotBe(-1);
        });
    });
});
