var favicons = require('favicons');

favicons({
    // I/O
    source: 'eggplant.png',
    dest: './',

    // Icon Types
    android: false,
    apple: false,
    coast: false,
    favicons: true,
    firefox: false,
    windows: false,

    // Miscellaneous
    html: null,
    background: '#1d1d1d',
    tileBlackWhite: true,
    manifest: null,
    trueColor: false,
    logging: false,
    callback: null
});
