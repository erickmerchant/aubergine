module.exports = function(size, color) {

    var canvas = document.createElement('canvas');

    var context = canvas.getContext('2d');

    canvas.width = size;

    canvas.height = size;

    context.fillStyle = color;

    context.fillRect(0, 0, size, size);

    return canvas.toDataURL();
};
