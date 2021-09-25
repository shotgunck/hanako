const nodeCanvas = require('canvas');

const images = {};

const pieces = ['wking', 'wqueen', 'wbishop', 'wknight',
    'wrook', 'wpawn', 'bking', 'bqueen', 'bbishop', 'bknight', 'brook', 'bpawn'];

const imagesToLoad = pieces.concat('board');

const loadImages = () => {
    let completed = 0;
    return new Promise(res => {
        imagesToLoad.forEach(name => {
            nodeCanvas.loadImage(`images/${name}.png`).then(image => {
                images[name] = image;
                completed++;
                if (completed >= imagesToLoad.length) {
                    res(images);
                }
            });
        });
    });
};

module.exports = { images, pieces, loadImages };