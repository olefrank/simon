"use strict";

describe('Simon', function() {

    it("should fail because true is not false!", function() {
        var expected = true;
        var actual = true;

        expect(expected).toBe(actual);
    });

});
