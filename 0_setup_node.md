**Setting up mocha / chai**

    npm i -D mocha chai

**Set up nodemon to make like easier**

    npm i -D nodemon

**Add script to package.json to easily start continuously running scripts**

    "start": "nodemon $*"
    "debug": "nodemon --debug $*"

run with

    npm run start 0_setup_node.js

**Import expect from chai in files to test / assert**

    const { expect } = require('chai');
    expect(20 + 20).to.equal(41);

_Note: passing expect doesn't produce output, only failing - same as assert_
