var path = require('path');
var loader = require(path.join(process.cwd(), './index.js'));
var expect = require('expect');
var cwd = process.cwd();
var generateBemHtml = loader.generateBemHtml;
var fs = require('fs');

describe('bem-loader', () => {

    it('should throw error', (done) => {
        try {
            loader.pitch.call({}, 'button.css');
        } catch (e) {
            expect(e.message).toBe('Styles for button block is not defined');
            done();
        }
    });

    it('should be ok', () => {
        loader.setStylesData({
            button: [
                'test.css',
                'fooo-bar.css',
            ],
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

    it('should generate module with bemhtml', () => {
        var data = {
            button: [
                path.join(cwd, 'test/bem-project/common.blocks/button/button.bemhtml'),
                path.join(cwd, 'test/bem-project/common.blocks/button/__icon/button__icon.bemhtml'),
            ],
            select: [
                path.join(cwd, 'test/bem-project/common.blocks/button/button.bemhtml'),
                path.join(cwd, 'test/bem-project/common.blocks/select/select.bemhtml'),
                path.join(cwd, 'test/bem-project/common.blocks/button/__icon/button__icon.bemhtml'),
            ],
        };

        var res = generateBemHtml(data);
        var bemhtml = [];
        Object.keys(data).forEach(block => {
            bemhtml = bemhtml.concat(data[block].map(p => fs.readFileSync(p).toString()));
        });

        bemhtml.forEach(b => expect(res).toContain(b));
    });
});
