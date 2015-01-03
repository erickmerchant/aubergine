
var dom = function(selector) {
    this.nodes = document.querySelectorAll(selector);
}

dom.prototype = {
    each: function(fn) {

        for(var i = 0; i < this.nodes.length; i++) {

            fn(this.nodes[i])
        }
    },
    on: function(event, fn) {

        this.each(function(el){

            el.addEventListener(event, fn);
        });
    },
    html: function(html) {

        this.each(function(el){

            el.innerHTML = html;
        });
    },
    append: function(html) {

        var div = document.createElement('div');

        div.innerHTML = html;

        this.each(function(el) {

            el.appendChild(div.firstChild);
        })
    }
};

module.exports = function(selector) {

    return new dom(selector);
};
