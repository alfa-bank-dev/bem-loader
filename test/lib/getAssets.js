var path = require('path');
var getAssets = require(path.join(process.cwd(), './lib/getAssets'));
var expect = require('expect');

var assets = {
    button: [
       'test/bem-project/common.blocks/button/button.css',
       'test/bem-project/common.blocks/button/__icon/button__icon.css',
       'test/bem-project/common.blocks/button/_theme/button_theme_test.css',
       'test/bem-project/common.blocks/button/_theme/button_theme_x1.css',
       'test/bem-project/common.blocks/button/__icon/_theme/button__icon_theme_black.css',
    ],
    select: [
        'test/bem-project/common.blocks/select/select.css',
    ],
};

describe('getAssets', () => {
    it('should return a list of assets', (done) => {
        getAssets(['./test/bem-project/common.blocks']).then((res) => {
            expect(res.css).toEqual(assets);
            done();
        }).catch(done);
    });
});
