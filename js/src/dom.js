var dom = function(selector) {
    this.nodes = document.querySelectorAll(selector);
};

dom.prototype = {
    each: function(fn) {

        Array.prototype.slice.call(this.nodes, 0).forEach(function(el){

            fn.call(el);
        });
    },
    on: function(event, fn) {

        this.each(function() {

            this.addEventListener(event, fn);
        });
    },
    html: function(html) {

        this.each(function() {

            this.innerHTML = html;
        });
    },
    append: function(html) {

        this.each(function() {

            var div = document.createElement('div');

            div.innerHTML = html;

            this.appendChild(div.firstChild);
        });
    }
};

module.exports = function(selector) {

    return new dom(selector);
};
