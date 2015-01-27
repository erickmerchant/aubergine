var dom = function(selector) {
    this.nodes = document.querySelectorAll(selector);
};

dom.prototype = {
    each: function(fn) {

        [].slice.call(this.nodes).forEach(function(el){

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
    }
};

module.exports = function(selector) {

    return new dom(selector);
};
