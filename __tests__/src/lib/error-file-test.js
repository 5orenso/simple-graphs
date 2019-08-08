/* eslint-env node, jest */

import { h } from "preact";
import Errorlist from './../../../lib/components/errorlist';
import render from "preact-render-to-string";

describe("lib/components/form/Errorlist", () => {
    it('should render Errorlist', () => {
        const errors = ['No coffee!'];
        const styles = {
            col_sm_12: 'black-coffee',
        };
        const input = render(<Errorlist that={this} messages={errors} styles={styles}/>);
        expect(input).toBe('<div class=\"alert alert-danger col-sm-12 black-coffee\"><h4 class=\"alert-heading\">Errors:</h4><ul><li>No coffee!</li></ul></div>');
    })
});
