var path = require('path');
var getDeps = require(path.join(process.cwd(), './lib/getDeps'));
var expect = require('expect');

describe('getDeps', () => {
    it('should return a list of deps', (done) => {
        getDeps(
            ['button', 'select'],
            ['./test/bem-project/common.blocks', './test/bem-project/additional']
        ).then((res) => {
            expect(res.filter(d => d.block === 'select')[0].deps[0]).toEqual({ block: 'button' });
            expect(res.filter(d => d.block === 'button')[0]
                .deps.filter(d => d.elem === 'additional-elem').length === 1).toBeTruthy();
            done();
        });
    });
});
