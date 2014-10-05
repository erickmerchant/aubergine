/*!
  * =============================================================
  * Ender: open module JavaScript framework (https://enderjs.com)
  * Build: ender build qwery bonzo bean moment kizzy pnglib onecolor
  * Packages: ender-core@2.0.0 ender-commonjs@1.0.7 qwery@4.0.0 bonzo@2.0.0 bean@1.0.14 moment@2.8.3 kizzy@0.0.5 pnglib@0.0.1 onecolor@2.4.2
  * =============================================================
  */

(function () {

  /*!
    * Ender: open module JavaScript framework (client-lib)
    * http://enderjs.com
    * License MIT
    */
  
  /**
   * @constructor
   * @param  {*=}      item      selector|node|collection|callback|anything
   * @param  {Object=} root      node(s) from which to base selector queries
   */
  function Ender(item, root) {
    var i
    this.length = 0 // Ensure that instance owns length
  
    if (typeof item == 'string')
      // start with strings so the result parlays into the other checks
      // the .selector prop only applies to strings
      item = ender._select(this['selector'] = item, root)
  
    if (null == item) return this // Do not wrap null|undefined
  
    if (typeof item == 'function') ender._closure(item, root)
  
    // DOM node | scalar | not array-like
    else if (typeof item != 'object' || item.nodeType || (i = item.length) !== +i || item == item.window)
      this[this.length++] = item
  
    // array-like - bitwise ensures integer length
    else for (this.length = i = (i > 0 ? ~~i : 0); i--;)
      this[i] = item[i]
  }
  
  /**
   * @param  {*=}      item   selector|node|collection|callback|anything
   * @param  {Object=} root   node(s) from which to base selector queries
   * @return {Ender}
   */
  function ender(item, root) {
    return new Ender(item, root)
  }
  
  
  /**
   * @expose
   * sync the prototypes for jQuery compatibility
   */
  ender.fn = ender.prototype = Ender.prototype
  
  /**
   * @enum {number}  protects local symbols from being overwritten
   */
  ender._reserved = {
    reserved: 1,
    ender: 1,
    expose: 1,
    noConflict: 1,
    fn: 1
  }
  
  /**
   * @expose
   * handy reference to self
   */
  Ender.prototype.$ = ender
  
  /**
   * @expose
   * make webkit dev tools pretty-print ender instances like arrays
   */
  Ender.prototype.splice = function () { throw new Error('Not implemented') }
  
  /**
   * @expose
   * @param   {function(*, number, Ender)}  fn
   * @param   {object=}                     scope
   * @return  {Ender}
   */
  Ender.prototype.forEach = function (fn, scope) {
    var i, l
    // opt out of native forEach so we can intentionally call our own scope
    // defaulting to the current item and be able to return self
    for (i = 0, l = this.length; i < l; ++i) i in this && fn.call(scope || this[i], this[i], i, this)
    // return self for chaining
    return this
  }
  
  /**
   * @expose
   * @param {object|function} o
   * @param {boolean=}        chain
   */
  ender.ender = function (o, chain) {
    var o2 = chain ? Ender.prototype : ender
    for (var k in o) !(k in ender._reserved) && (o2[k] = o[k])
    return o2
  }
  
  /**
   * @expose
   * @param {string}  s
   * @param {Node=}   r
   */
  ender._select = function (s, r) {
    return s ? (r || document).querySelectorAll(s) : []
  }
  
  /**
   * @expose
   * @param {function} fn
   */
  ender._closure = function (fn) {
    fn.call(document, ender)
  }
  
  if (typeof module !== 'undefined' && module['exports']) module['exports'] = ender
  var $ = ender
  
  /**
   * @expose
   * @param {string} name
   * @param {*}      value
   */
  ender.expose = function (name, value) {
    ender.expose.old[name] = window[name]
    window[name] = value
  }
  
  /**
   * @expose
   */
  ender.expose.old = {}
  
  /**
   * @expose
   * @param {boolean} all   restore only $ or all ender globals
   */
  ender.noConflict = function (all) {
    window['$'] = ender.expose.old['$']
    if (all) for (var k in ender.expose.old) window[k] = ender.expose.old[k]
    return this
  }
  
  ender.expose('$', ender)
  ender.expose('ender', ender); // uglify needs this semi-colon between concating files
  
  /*!
    * Ender: open module JavaScript framework (module-lib)
    * http://enderjs.com
    * License MIT
    */
  
  var global = this
  
  /**
   * @param  {string}  id   module id to load
   * @return {object}
   */
  function require(id) {
    if ('$' + id in require._cache)
      return require._cache['$' + id]
    if ('$' + id in require._modules)
      return (require._cache['$' + id] = require._modules['$' + id]._load())
    if (id in window)
      return window[id]
  
    throw new Error('Requested module "' + id + '" has not been defined.')
  }
  
  /**
   * @param  {string}  id       module id to provide to require calls
   * @param  {object}  exports  the exports object to be returned
   */
  function provide(id, exports) {
    return (require._cache['$' + id] = exports)
  }
  
  /**
   * @expose
   * @dict
   */
  require._cache = {}
  
  /**
   * @expose
   * @dict
   */
  require._modules = {}
  
  /**
   * @constructor
   * @param  {string}                                          id   module id for this module
   * @param  {function(Module, object, function(id), object)}  fn   module definition
   */
  function Module(id, fn) {
    this.id = id
    this.fn = fn
    require._modules['$' + id] = this
  }
  
  /**
   * @expose
   * @param  {string}  id   module id to load from the local module context
   * @return {object}
   */
  Module.prototype.require = function (id) {
    var parts, i
  
    if (id.charAt(0) == '.') {
      parts = (this.id.replace(/\/.*?$/, '/') + id.replace(/\.js$/, '')).split('/')
  
      while (~(i = parts.indexOf('.')))
        parts.splice(i, 1)
  
      while ((i = parts.lastIndexOf('..')) > 0)
        parts.splice(i - 1, 2)
  
      id = parts.join('/')
    }
  
    return require(id)
  }
  
  /**
   * @expose
   * @return {object}
   */
  Module.prototype._load = function () {
    var m = this
  
    if (!m._loaded) {
      m._loaded = true
  
      /**
       * @expose
       */
      m.exports = {}
      m.fn.call(global, m, m.exports, function (id) { return m.require(id) }, global)
    }
  
    return m.exports
  }
  
  /**
   * @expose
   * @param  {string}                     id        main module id
   * @param  {Object.<string, function>}  modules   mapping of module ids to definitions
   * @param  {string}                     main      the id of the main module
   */
  Module.createPackage = function (id, modules, main) {
    var path, m
  
    for (path in modules) {
      new Module(id + '/' + path, modules[path])
      if (m = path.match(/^(.+)\/index$/)) new Module(id + '/' + m[1], modules[path])
    }
  
    if (main) require._modules['$' + id] = require._modules['$' + id + '/' + main]
  }
  
  if (ender && ender.expose) {
    /*global global,require,provide,Module */
    ender.expose('global', global)
    ender.expose('require', require)
    ender.expose('provide', provide)
    ender.expose('Module', Module)
  }
  
  Module.createPackage('qwery', {
    'qwery': function (module, exports, require, global) {
      /*!
        * @preserve Qwery - A selector engine
        * https://github.com/ded/qwery
        * (c) Dustin Diaz 2014 | License MIT
        */
      
      (function (name, context, definition) {
        if (typeof module != 'undefined' && module.exports) module.exports = definition()
        else if (typeof define == 'function' && define.amd) define(definition)
        else context[name] = definition()
      })('qwery', this, function () {
      
        var classOnly = /^\.([\w\-]+)$/
          , doc = document
          , win = window
          , html = doc.documentElement
          , nodeType = 'nodeType'
        var isAncestor = 'compareDocumentPosition' in html ?
          function (element, container) {
            return (container.compareDocumentPosition(element) & 16) == 16
          } :
          function (element, container) {
            container = container == doc || container == window ? html : container
            return container !== element && container.contains(element)
          }
      
        function toArray(ar) {
          return [].slice.call(ar, 0)
        }
      
        function isNode(el) {
          var t
          return el && typeof el === 'object' && (t = el.nodeType) && (t == 1 || t == 9)
        }
      
        function arrayLike(o) {
          return (typeof o === 'object' && isFinite(o.length))
        }
      
        function flatten(ar) {
          for (var r = [], i = 0, l = ar.length; i < l; ++i) arrayLike(ar[i]) ? (r = r.concat(ar[i])) : (r[r.length] = ar[i])
          return r
        }
      
        function uniq(ar) {
          var a = [], i, j
          label:
          for (i = 0; i < ar.length; i++) {
            for (j = 0; j < a.length; j++) {
              if (a[j] == ar[i]) {
                continue label
              }
            }
            a[a.length] = ar[i]
          }
          return a
        }
      
      
        function normalizeRoot(root) {
          if (!root) return doc
          if (typeof root == 'string') return qwery(root)[0]
          if (!root[nodeType] && arrayLike(root)) return root[0]
          return root
        }
      
        /**
         * @param {string|Array.<Element>|Element|Node} selector
         * @param {string|Array.<Element>|Element|Node=} opt_root
         * @return {Array.<Element>}
         */
        function qwery(selector, opt_root) {
          var m, root = normalizeRoot(opt_root)
          if (!root || !selector) return []
          if (selector === win || isNode(selector)) {
            return !opt_root || (selector !== win && isNode(root) && isAncestor(selector, root)) ? [selector] : []
          }
          if (selector && arrayLike(selector)) return flatten(selector)
      
      
          if (doc.getElementsByClassName && selector == 'string' && (m = selector.match(classOnly))) {
            return toArray((root).getElementsByClassName(m[1]))
          }
          // using duck typing for 'a' window or 'a' document (not 'the' window || document)
          if (selector && (selector.document || (selector.nodeType && selector.nodeType == 9))) {
            return !opt_root ? [selector] : []
          }
          return toArray((root).querySelectorAll(selector))
        }
      
        qwery.uniq = uniq
      
        return qwery
      }, this);
      
    },
    'src/ender': function (module, exports, require, global) {
      (function ($) {
        var q = require('qwery')
      
        $._select = function (s, r) {
          // detect if sibling module 'bonzo' is available at run-time
          // rather than load-time since technically it's not a dependency and
          // can be loaded in any order
          // hence the lazy function re-definition
          return ($._select = (function () {
            var b
            if (typeof $.create == 'function') return function (s, r) {
              return /^\s*</.test(s) ? $.create(s, r) : q(s, r)
            }
            try {
              b = require('bonzo')
              return function (s, r) {
                return /^\s*</.test(s) ? b.create(s, r) : q(s, r)
              }
            } catch (e) { }
            return q
          })())(s, r)
        }
      
        $.ender({
            find: function (s) {
              var r = [], i, l, j, k, els
              for (i = 0, l = this.length; i < l; i++) {
                els = q(s, this[i])
                for (j = 0, k = els.length; j < k; j++) r.push(els[j])
              }
              return $(q.uniq(r))
            }
          , and: function (s) {
              var plus = $(s)
              for (var i = this.length, j = 0, l = this.length + plus.length; i < l; i++, j++) {
                this[i] = plus[j]
              }
              this.length += plus.length
              return this
            }
        }, true)
      }(ender));
      
    }
  }, 'qwery');

  Module.createPackage('bonzo', {
    'bonzo': function (module, exports, require, global) {
      /*!
        * Bonzo: DOM Utility (c) Dustin Diaz 2012
        * https://github.com/ded/bonzo
        * License MIT
        */
      (function (name, context, definition) {
        if (typeof module != 'undefined' && module.exports) module.exports = definition()
        else if (typeof define == 'function' && define.amd) define(definition)
        else context[name] = definition()
      })('bonzo', this, function() {
        var win = window
          , doc = win.document
          , html = doc.documentElement
          , parentNode = 'parentNode'
          , specialAttributes = /^(checked|value|selected|disabled)$/i
            // tags that we have trouble inserting *into*
          , specialTags = /^(select|fieldset|table|tbody|tfoot|td|tr|colgroup)$/i
          , simpleScriptTagRe = /\s*<script +src=['"]([^'"]+)['"]>/
          , table = ['<table>', '</table>', 1]
          , td = ['<table><tbody><tr>', '</tr></tbody></table>', 3]
          , option = ['<select>', '</select>', 1]
          , noscope = ['_', '', 0, 1]
          , tagMap = { // tags that we have trouble *inserting*
                thead: table, tbody: table, tfoot: table, colgroup: table, caption: table
              , tr: ['<table><tbody>', '</tbody></table>', 2]
              , th: td , td: td
              , col: ['<table><colgroup>', '</colgroup></table>', 2]
              , fieldset: ['<form>', '</form>', 1]
              , legend: ['<form><fieldset>', '</fieldset></form>', 2]
              , option: option, optgroup: option
              , script: noscope, style: noscope, link: noscope, param: noscope, base: noscope
            }
          , stateAttributes = /^(checked|selected|disabled)$/
          , hasClass, addClass, removeClass
          , uidMap = {}
          , uuids = 0
          , digit = /^-?[\d\.]+$/
          , dattr = /^data-(.+)$/
          , px = 'px'
          , setAttribute = 'setAttribute'
          , getAttribute = 'getAttribute'
          , features = function() {
              var e = doc.createElement('p')
              return {
                transform: function () {
                  var props = ['transform', 'webkitTransform', 'MozTransform', 'OTransform', 'msTransform'], i
                  for (i = 0; i < props.length; i++) {
                    if (props[i] in e.style) return props[i]
                  }
                }()
              , classList: 'classList' in e
              }
            }()
          , whitespaceRegex = /\s+/
          , toString = String.prototype.toString
          , unitless = { lineHeight: 1, zoom: 1, zIndex: 1, opacity: 1, boxFlex: 1, WebkitBoxFlex: 1, MozBoxFlex: 1 }
          , query = doc.querySelectorAll && function (selector) { return doc.querySelectorAll(selector) }
      
      
        function getStyle(el, property) {
          var value = null
            , computed = doc.defaultView.getComputedStyle(el, '')
          computed && (value = computed[property])
          return el.style[property] || value
        }
      
      
        function isNode(node) {
          return node && node.nodeName && (node.nodeType == 1 || node.nodeType == 11)
        }
      
      
        function normalize(node, host, clone) {
          var i, l, ret
          if (typeof node == 'string') return bonzo.create(node)
          if (isNode(node)) node = [ node ]
          if (clone) {
            ret = [] // don't change original array
            for (i = 0, l = node.length; i < l; i++) ret[i] = cloneNode(host, node[i])
            return ret
          }
          return node
        }
      
        /**
         * @param {string} c a class name to test
         * @return {boolean}
         */
        function classReg(c) {
          return new RegExp('(^|\\s+)' + c + '(\\s+|$)')
        }
      
      
        /**
         * @param {Bonzo|Array} ar
         * @param {function(Object, number, (Bonzo|Array))} fn
         * @param {Object=} opt_scope
         * @param {boolean=} opt_rev
         * @return {Bonzo|Array}
         */
        function each(ar, fn, opt_scope, opt_rev) {
          var ind, i = 0, l = ar.length
          for (; i < l; i++) {
            ind = opt_rev ? ar.length - i - 1 : i
            fn.call(opt_scope || ar[ind], ar[ind], ind, ar)
          }
          return ar
        }
      
      
        /**
         * @param {Bonzo|Array} ar
         * @param {function(Object, number, (Bonzo|Array))} fn
         * @param {Object=} opt_scope
         * @return {Bonzo|Array}
         */
        function deepEach(ar, fn, opt_scope) {
          for (var i = 0, l = ar.length; i < l; i++) {
            if (isNode(ar[i])) {
              deepEach(ar[i].childNodes, fn, opt_scope)
              fn.call(opt_scope || ar[i], ar[i], i, ar)
            }
          }
          return ar
        }
      
      
        /**
         * @param {string} s
         * @return {string}
         */
        function camelize(s) {
          return s.replace(/-(.)/g, function (m, m1) {
            return m1.toUpperCase()
          })
        }
      
      
        /**
         * @param {string} s
         * @return {string}
         */
        function decamelize(s) {
          return s ? s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() : s
        }
      
      
        /**
         * @param {Element} el
         * @return {*}
         */
        function data(el) {
          el[getAttribute]('data-node-uid') || el[setAttribute]('data-node-uid', ++uuids)
          var uid = el[getAttribute]('data-node-uid')
          return uidMap[uid] || (uidMap[uid] = {})
        }
      
      
        /**
         * removes the data associated with an element
         * @param {Element} el
         */
        function clearData(el) {
          var uid = el[getAttribute]('data-node-uid')
          if (uid) delete uidMap[uid]
        }
      
      
        function dataValue(d) {
          var f
          try {
            return (d === null || d === undefined) ? undefined :
              d === 'true' ? true :
                d === 'false' ? false :
                  d === 'null' ? null :
                    (f = parseFloat(d)) == d ? f : d;
          } catch(e) {}
          return undefined
        }
      
      
        /**
         * @param {Bonzo|Array} ar
         * @param {function(Object, number, (Bonzo|Array))} fn
         * @param {Object=} opt_scope
         * @return {boolean} whether `some`thing was found
         */
        function some(ar, fn, opt_scope) {
          for (var i = 0, j = ar.length; i < j; ++i) if (fn.call(opt_scope || null, ar[i], i, ar)) return true
          return false
        }
      
      
        /**
         * this could be a giant enum of CSS properties
         * but in favor of file size sans-closure deadcode optimizations
         * we're just asking for any ol string
         * then it gets transformed into the appropriate style property for JS access
         * @param {string} p
         * @return {string}
         */
        function styleProperty(p) {
            (p == 'transform' && (p = features.transform)) ||
              (/^transform-?[Oo]rigin$/.test(p) && (p = features.transform + 'Origin'))
            return p ? camelize(p) : null
        }
      
        // this insert method is intense
        function insert(target, host, fn, rev) {
          var i = 0, self = host || this, r = []
            // target nodes could be a css selector if it's a string and a selector engine is present
            // otherwise, just use target
            , nodes = query && typeof target == 'string' && target.charAt(0) != '<' ? query(target) : target
          // normalize each node in case it's still a string and we need to create nodes on the fly
          each(normalize(nodes), function (t, j) {
            each(self, function (el) {
              fn(t, r[i++] = j > 0 ? cloneNode(self, el) : el)
            }, null, rev)
          }, this, rev)
          self.length = i
          each(r, function (e) {
            self[--i] = e
          }, null, !rev)
          return self
        }
      
      
        /**
         * sets an element to an explicit x/y position on the page
         * @param {Element} el
         * @param {?number} x
         * @param {?number} y
         */
        function xy(el, x, y) {
          var $el = bonzo(el)
            , style = $el.css('position')
            , offset = $el.offset()
            , rel = 'relative'
            , isRel = style == rel
            , delta = [parseInt($el.css('left'), 10), parseInt($el.css('top'), 10)]
      
          if (style == 'static') {
            $el.css('position', rel)
            style = rel
          }
      
          isNaN(delta[0]) && (delta[0] = isRel ? 0 : el.offsetLeft)
          isNaN(delta[1]) && (delta[1] = isRel ? 0 : el.offsetTop)
      
          x != null && (el.style.left = x - offset.left + delta[0] + px)
          y != null && (el.style.top = y - offset.top + delta[1] + px)
      
        }
      
        // classList support for class management
        // altho to be fair, the api sucks because it won't accept multiple classes at once
        if (features.classList) {
          hasClass = function (el, c) {
            return el.classList.contains(c)
          }
          addClass = function (el, c) {
            el.classList.add(c)
          }
          removeClass = function (el, c) {
            el.classList.remove(c)
          }
        }
        else {
          hasClass = function (el, c) {
            return classReg(c).test(el.className)
          }
          addClass = function (el, c) {
            el.className = (el.className + ' ' + c).trim()
          }
          removeClass = function (el, c) {
            el.className = (el.className.replace(classReg(c), ' ')).trim()
          }
        }
      
      
        /**
         * this allows method calling for setting values
         *
         * @example
         * bonzo(elements).css('color', function (el) {
         *   return el.getAttribute('data-original-color')
         * })
         *
         * @param {Element} el
         * @param {function (Element)|string} v
         * @return {string}
         */
        function setter(el, v) {
          return typeof v == 'function' ? v.call(el, el) : v
        }
      
        function scroll(x, y, type) {
          var el = this[0]
          if (!el) return this
          if (x == null && y == null) {
            return (isBody(el) ? getWindowScroll() : { x: el.scrollLeft, y: el.scrollTop })[type]
          }
          if (isBody(el)) {
            win.scrollTo(x, y)
          } else {
            x != null && (el.scrollLeft = x)
            y != null && (el.scrollTop = y)
          }
          return this
        }
      
        /**
         * @constructor
         * @param {Array.<Element>|Element|Node|string} elements
         */
        function Bonzo(elements) {
          this.length = 0
          if (elements) {
            elements = typeof elements !== 'string' &&
              !elements.nodeType &&
              typeof elements.length !== 'undefined' ?
                elements :
                [elements]
            this.length = elements.length
            for (var i = 0; i < elements.length; i++) this[i] = elements[i]
          }
        }
      
        Bonzo.prototype = {
      
            /**
             * @param {number} index
             * @return {Element|Node}
             */
            get: function (index) {
              return this[index] || null
            }
      
            // itetators
            /**
             * @param {function(Element|Node)} fn
             * @param {Object=} opt_scope
             * @return {Bonzo}
             */
          , each: function (fn, opt_scope) {
              return each(this, fn, opt_scope)
            }
      
            /**
             * @param {Function} fn
             * @param {Object=} opt_scope
             * @return {Bonzo}
             */
          , deepEach: function (fn, opt_scope) {
              return deepEach(this, fn, opt_scope)
            }
      
      
            /**
             * @param {Function} fn
             * @param {Function=} opt_reject
             * @return {Array}
             */
          , map: function (fn, opt_reject) {
              var m = [], n, i
              for (i = 0; i < this.length; i++) {
                n = fn.call(this, this[i], i)
                opt_reject ? (opt_reject(n) && m.push(n)) : m.push(n)
              }
              return m
            }
      
          // text and html inserters!
      
          /**
           * @param {string} h the HTML to insert
           * @param {boolean=} opt_text whether to set or get text content
           * @return {Bonzo|string}
           */
          , html: function (h, opt_text) {
              var method = opt_text
                    ? 'textContent'
                    : 'innerHTML'
                , that = this
                , append = function (el, i) {
                    each(normalize(h, that, i), function (node) {
                      el.appendChild(node)
                    })
                  }
                , updateElement = function (el, i) {
                    try {
                      if (opt_text || (typeof h == 'string' && !specialTags.test(el.tagName))) {
                        return el[method] = h
                      }
                    } catch (e) {}
                    append(el, i)
                  }
              return typeof h != 'undefined'
                ? this.empty().each(updateElement)
                : this[0] ? this[0][method] : ''
            }
      
            /**
             * @param {string=} opt_text the text to set, otherwise this is a getter
             * @return {Bonzo|string}
             */
          , text: function (opt_text) {
              return this.html(opt_text, true)
            }
      
            // more related insertion methods
      
            /**
             * @param {Bonzo|string|Element|Array} node
             * @return {Bonzo}
             */
          , append: function (node) {
              var that = this
              return this.each(function (el, i) {
                each(normalize(node, that, i), function (i) {
                  el.appendChild(i)
                })
              })
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} node
             * @return {Bonzo}
             */
          , prepend: function (node) {
              var that = this
              return this.each(function (el, i) {
                var first = el.firstChild
                each(normalize(node, that, i), function (i) {
                  el.insertBefore(i, first)
                })
              })
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
             * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
             * @return {Bonzo}
             */
          , appendTo: function (target, opt_host) {
              return insert.call(this, target, opt_host, function (t, el) {
                t.appendChild(el)
              })
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
             * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
             * @return {Bonzo}
             */
          , prependTo: function (target, opt_host) {
              return insert.call(this, target, opt_host, function (t, el) {
                t.insertBefore(el, t.firstChild)
              }, 1)
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} node
             * @return {Bonzo}
             */
          , before: function (node) {
              var that = this
              return this.each(function (el, i) {
                each(normalize(node, that, i), function (i) {
                  el[parentNode].insertBefore(i, el)
                })
              })
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} node
             * @return {Bonzo}
             */
          , after: function (node) {
              var that = this
              return this.each(function (el, i) {
                each(normalize(node, that, i), function (i) {
                  el[parentNode].insertBefore(i, el.nextSibling)
                }, null, 1)
              })
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
             * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
             * @return {Bonzo}
             */
          , insertBefore: function (target, opt_host) {
              return insert.call(this, target, opt_host, function (t, el) {
                t[parentNode].insertBefore(el, t)
              })
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
             * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
             * @return {Bonzo}
             */
          , insertAfter: function (target, opt_host) {
              return insert.call(this, target, opt_host, function (t, el) {
                var sibling = t.nextSibling
                sibling ?
                  t[parentNode].insertBefore(el, sibling) :
                  t[parentNode].appendChild(el)
              }, 1)
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} node
             * @return {Bonzo}
             */
          , replaceWith: function (node) {
              var that = this
              return this.each(function (el, i) {
                each(normalize(node, that, i), function (i) {
                  el[parentNode] && el[parentNode].replaceChild(i, el)
                })
              })
            }
      
            /**
             * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
             * @return {Bonzo}
             */
          , clone: function (opt_host) {
              var ret = [] // don't change original array
                , l, i
              for (i = 0, l = this.length; i < l; i++) ret[i] = cloneNode(opt_host || this, this[i])
              return bonzo(ret)
            }
      
            // class management
      
            /**
             * @param {string} c
             * @return {Bonzo}
             */
          , addClass: function (c) {
              c = toString.call(c).split(whitespaceRegex)
              return this.each(function (el) {
                // we `each` here so you can do $el.addClass('foo bar')
                each(c, function (c) {
                  if (c && !hasClass(el, setter(el, c)))
                    addClass(el, setter(el, c))
                })
              })
            }
      
      
            /**
             * @param {string} c
             * @return {Bonzo}
             */
          , removeClass: function (c) {
              c = toString.call(c).split(whitespaceRegex)
              return this.each(function (el) {
                each(c, function (c) {
                  if (c && hasClass(el, setter(el, c)))
                    removeClass(el, setter(el, c))
                })
              })
            }
      
      
            /**
             * @param {string} c
             * @return {boolean}
             */
          , hasClass: function (c) {
              c = toString.call(c).split(whitespaceRegex)
              return some(this, function (el) {
                return some(c, function (c) {
                  return c && hasClass(el, c)
                })
              })
            }
      
      
            /**
             * @param {string} c classname to toggle
             * @param {boolean=} opt_condition whether to add or remove the class straight away
             * @return {Bonzo}
             */
          , toggleClass: function (c, opt_condition) {
              c = toString.call(c).split(whitespaceRegex)
              return this.each(function (el) {
                each(c, function (c) {
                  if (c) {
                    typeof opt_condition !== 'undefined' ?
                      opt_condition ? !hasClass(el, c) && addClass(el, c) : removeClass(el, c) :
                      hasClass(el, c) ? removeClass(el, c) : addClass(el, c)
                  }
                })
              })
            }
      
            // display togglers
      
            /**
             * @param {string=} opt_type useful to set back to anything other than an empty string
             * @return {Bonzo}
             */
          , show: function (opt_type) {
              opt_type = typeof opt_type == 'string' ? opt_type : ''
              return this.each(function (el) {
                el.style.display = opt_type
              })
            }
      
      
            /**
             * @return {Bonzo}
             */
          , hide: function () {
              return this.each(function (el) {
                el.style.display = 'none'
              })
            }
      
      
            /**
             * @param {Function=} opt_callback
             * @param {string=} opt_type
             * @return {Bonzo}
             */
          , toggle: function (opt_callback, opt_type) {
              opt_type = typeof opt_type == 'string' ? opt_type : '';
              typeof opt_callback != 'function' && (opt_callback = null)
              return this.each(function (el) {
                el.style.display = (el.offsetWidth || el.offsetHeight) ? 'none' : opt_type;
                opt_callback && opt_callback.call(el)
              })
            }
      
      
            // DOM Walkers & getters
      
            /**
             * @return {Element|Node}
             */
          , first: function () {
              return bonzo(this.length ? this[0] : [])
            }
      
      
            /**
             * @return {Element|Node}
             */
          , last: function () {
              return bonzo(this.length ? this[this.length - 1] : [])
            }
      
      
            /**
             * @return {Element|Node}
             */
          , next: function () {
              return this.related('nextSibling')
            }
      
      
            /**
             * @return {Element|Node}
             */
          , previous: function () {
              return this.related('previousSibling')
            }
      
      
            /**
             * @return {Element|Node}
             */
          , parent: function() {
              return this.related(parentNode)
            }
      
      
            /**
             * @private
             * @param {string} method the directional DOM method
             * @return {Element|Node}
             */
          , related: function (method) {
              return bonzo(this.map(
                function (el) {
                  el = el[method]
                  while (el && el.nodeType !== 1) {
                    el = el[method]
                  }
                  return el || 0
                },
                function (el) {
                  return el
                }
              ))
            }
      
      
            /**
             * @return {Bonzo}
             */
          , focus: function () {
              this.length && this[0].focus()
              return this
            }
      
      
            /**
             * @return {Bonzo}
             */
          , blur: function () {
              this.length && this[0].blur()
              return this
            }
      
            // style getter setter & related methods
      
            /**
             * @param {Object|string} o
             * @param {string=} opt_v
             * @return {Bonzo|string}
             */
          , css: function (o, opt_v) {
              var p, iter = o
              // is this a request for just getting a style?
              if (opt_v === undefined && typeof o == 'string') {
                // repurpose 'v'
                opt_v = this[0]
                if (!opt_v) return null
                if (opt_v === doc || opt_v === win) {
                  p = (opt_v === doc) ? bonzo.doc() : bonzo.viewport()
                  return o == 'width' ? p.width : o == 'height' ? p.height : ''
                }
                return (o = styleProperty(o)) ? getStyle(opt_v, o) : null
              }
      
              if (typeof o == 'string') {
                iter = {}
                iter[o] = opt_v
              }
      
              function fn(el, p, v) {
                for (var k in iter) {
                  if (iter.hasOwnProperty(k)) {
                    v = iter[k];
                    // change "5" to "5px" - unless you're line-height, which is allowed
                    (p = styleProperty(k)) && digit.test(v) && !(p in unitless) && (v += px)
                    try { el.style[p] = setter(el, v) } catch(e) {}
                  }
                }
              }
              return this.each(fn)
            }
      
      
            /**
             * @param {number=} opt_x
             * @param {number=} opt_y
             * @return {Bonzo|number}
             */
          , offset: function (opt_x, opt_y) {
              if (opt_x && typeof opt_x == 'object' && (typeof opt_x.top == 'number' || typeof opt_x.left == 'number')) {
                return this.each(function (el) {
                  xy(el, opt_x.left, opt_x.top)
                })
              } else if (typeof opt_x == 'number' || typeof opt_y == 'number') {
                return this.each(function (el) {
                  xy(el, opt_x, opt_y)
                })
              }
              if (!this[0]) return {
                  top: 0
                , left: 0
                , height: 0
                , width: 0
              }
              var el = this[0]
                , de = el.ownerDocument.documentElement
                , bcr = el.getBoundingClientRect()
                , scroll = getWindowScroll()
                , width = el.offsetWidth
                , height = el.offsetHeight
                , top = bcr.top + scroll.y - Math.max(0, de && de.clientTop, doc.body.clientTop)
                , left = bcr.left + scroll.x - Math.max(0, de && de.clientLeft, doc.body.clientLeft)
      
              return {
                  top: top
                , left: left
                , height: height
                , width: width
              }
            }
      
      
            /**
             * @return {number}
             */
          , dim: function () {
              if (!this.length) return { height: 0, width: 0 }
              var el = this[0]
                , de = el.nodeType == 9 && el.documentElement // document
                , orig = !de && !!el.style && !el.offsetWidth && !el.offsetHeight ?
                   // el isn't visible, can't be measured properly, so fix that
                   function (t) {
                     var s = {
                         position: el.style.position || ''
                       , visibility: el.style.visibility || ''
                       , display: el.style.display || ''
                     }
                     t.first().css({
                         position: 'absolute'
                       , visibility: 'hidden'
                       , display: 'block'
                     })
                     return s
                  }(this) : null
                , width = de
                    ? Math.max(el.body.scrollWidth, el.body.offsetWidth, de.scrollWidth, de.offsetWidth, de.clientWidth)
                    : el.offsetWidth
                , height = de
                    ? Math.max(el.body.scrollHeight, el.body.offsetHeight, de.scrollHeight, de.offsetHeight, de.clientHeight)
                    : el.offsetHeight
      
              orig && this.first().css(orig)
              return {
                  height: height
                , width: width
              }
            }
      
            // attributes are hard. go shopping
      
            /**
             * @param {string} k an attribute to get or set
             * @param {string=} opt_v the value to set
             * @return {Bonzo|string}
             */
          , attr: function (k, opt_v) {
              var el = this[0]
                , n
      
              if (typeof k != 'string' && !(k instanceof String)) {
                for (n in k) {
                  k.hasOwnProperty(n) && this.attr(n, k[n])
                }
                return this
              }
      
              return typeof opt_v == 'undefined' ?
                !el ? null : specialAttributes.test(k) ?
                  stateAttributes.test(k) && typeof el[k] == 'string' ?
                    true : el[k] :  el[getAttribute](k) :
                this.each(function (el) {
                  specialAttributes.test(k) ? (el[k] = setter(el, opt_v)) : el[setAttribute](k, setter(el, opt_v))
                })
            }
      
      
            /**
             * @param {string} k
             * @return {Bonzo}
             */
          , removeAttr: function (k) {
              return this.each(function (el) {
                stateAttributes.test(k) ? (el[k] = false) : el.removeAttribute(k)
              })
            }
      
      
            /**
             * @param {string=} opt_s
             * @return {Bonzo|string}
             */
          , val: function (s) {
              return (typeof s == 'string' || typeof s == 'number') ?
                this.attr('value', s) :
                this.length ? this[0].value : null
            }
      
            // use with care and knowledge. this data() method uses data attributes on the DOM nodes
            // to do this differently costs a lot more code. c'est la vie
            /**
             * @param {string|Object=} opt_k the key for which to get or set data
             * @param {Object=} opt_v
             * @return {Bonzo|Object}
             */
          , data: function (opt_k, opt_v) {
              var el = this[0], o, m
              if (typeof opt_v === 'undefined') {
                if (!el) return null
                o = data(el)
                if (typeof opt_k === 'undefined') {
                  each(el.attributes, function (a) {
                    (m = ('' + a.name).match(dattr)) && (o[camelize(m[1])] = dataValue(a.value))
                  })
                  return o
                } else {
                  if (typeof o[opt_k] === 'undefined')
                    o[opt_k] = dataValue(this.attr('data-' + decamelize(opt_k)))
                  return o[opt_k]
                }
              } else {
                return this.each(function (el) { data(el)[opt_k] = opt_v })
              }
            }
      
            // DOM detachment & related
      
            /**
             * @return {Bonzo}
             */
          , remove: function () {
              this.deepEach(clearData)
              return this.detach()
            }
      
      
            /**
             * @return {Bonzo}
             */
          , empty: function () {
              return this.each(function (el) {
                deepEach(el.childNodes, clearData)
      
                while (el.firstChild) {
                  el.removeChild(el.firstChild)
                }
              })
            }
      
      
            /**
             * @return {Bonzo}
             */
          , detach: function () {
              return this.each(function (el) {
                el[parentNode] && el[parentNode].removeChild(el)
              })
            }
      
            // who uses a mouse anyway? oh right.
      
            /**
             * @param {number} y
             */
          , scrollTop: function (y) {
              return scroll.call(this, null, y, 'y')
            }
      
      
            /**
             * @param {number} x
             */
          , scrollLeft: function (x) {
              return scroll.call(this, x, null, 'x')
            }
      
        }
      
      
        function cloneNode(host, el) {
          var c = el.cloneNode(true)
            , cloneElems
            , elElems
            , i
      
          // check for existence of an event cloner
          // preferably https://github.com/fat/bean
          // otherwise Bonzo won't do this for you
          if (host.$ && typeof host.cloneEvents == 'function') {
            host.$(c).cloneEvents(el)
      
            // clone events from every child node
            cloneElems = host.$(c).find('*')
            elElems = host.$(el).find('*')
      
            for (i = 0; i < elElems.length; i++)
              host.$(cloneElems[i]).cloneEvents(elElems[i])
          }
          return c
        }
      
        function isBody(element) {
          return element === win || (/^(?:body|html)$/i).test(element.tagName)
        }
      
        function getWindowScroll() {
          return { x: win.pageXOffset || html.scrollLeft, y: win.pageYOffset || html.scrollTop }
        }
      
        function createScriptFromHtml(html) {
          var scriptEl = document.createElement('script')
            , matches = html.match(simpleScriptTagRe)
          scriptEl.src = matches[1]
          return scriptEl
        }
      
        /**
         * @param {Array.<Element>|Element|Node|string} els
         * @return {Bonzo}
         */
        function bonzo(els) {
          return new Bonzo(els)
        }
      
        bonzo.setQueryEngine = function (q) {
          query = q;
          delete bonzo.setQueryEngine
        }
      
        bonzo.aug = function (o, target) {
          // for those standalone bonzo users. this love is for you.
          for (var k in o) {
            o.hasOwnProperty(k) && ((target || Bonzo.prototype)[k] = o[k])
          }
        }
      
        bonzo.create = function (node) {
          // hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
          return typeof node == 'string' && node !== '' ?
            function () {
              if (simpleScriptTagRe.test(node)) return [createScriptFromHtml(node)]
              var tag = node.match(/^\s*<([^\s>]+)/)
                , el = doc.createElement('div')
                , els = []
                , p = tag ? tagMap[tag[1].toLowerCase()] : null
                , dep = p ? p[2] + 1 : 1
                , ns = p && p[3]
                , pn = parentNode
      
              el.innerHTML = p ? (p[0] + node + p[1]) : node
              while (dep--) el = el.firstChild
              // for IE NoScope, we may insert cruft at the begining just to get it to work
              if (ns && el && el.nodeType !== 1) el = el.nextSibling
              do {
                if (!tag || el.nodeType == 1) {
                  els.push(el)
                }
              } while (el = el.nextSibling)
              // IE < 9 gives us a parentNode which messes up insert() check for cloning
              // `dep` > 1 can also cause problems with the insert() check (must do this last)
              each(els, function(el) { el[pn] && el[pn].removeChild(el) })
              return els
            }() : isNode(node) ? [node.cloneNode(true)] : []
        }
      
        bonzo.doc = function () {
          var vp = bonzo.viewport()
          return {
              width: Math.max(doc.body.scrollWidth, html.scrollWidth, vp.width)
            , height: Math.max(doc.body.scrollHeight, html.scrollHeight, vp.height)
          }
        }
      
        bonzo.firstChild = function (el) {
          for (var c = el.childNodes, i = 0, j = (c && c.length) || 0, e; i < j; i++) {
            if (c[i].nodeType === 1) e = c[j = i]
          }
          return e
        }
      
        bonzo.viewport = function () {
          return {
              width: win.innerWidth
            , height: win.innerHeight
          }
        }
      
        bonzo.isAncestor = 'compareDocumentPosition' in html ?
          function (container, element) {
            return (container.compareDocumentPosition(element) & 16) == 16
          } :
          function (container, element) {
            return container !== element && container.contains(element);
          }
      
        return bonzo
      }); // the only line we care about using a semi-colon. placed here for concatenation tools
      
    },
    'src/ender': function (module, exports, require, global) {
      (function ($) {
      
        var b = require('bonzo')
        b.setQueryEngine($)
        $.ender(b)
        $.ender(b(), true)
        $.ender({
          create: function (node) {
            return $(b.create(node))
          }
        })
      
        $.id = function (id) {
          return $([document.getElementById(id)])
        }
      
        function indexOf(ar, val) {
          for (var i = 0; i < ar.length; i++) if (ar[i] === val) return i
          return -1
        }
      
        function uniq(ar) {
          var r = [], i = 0, j = 0, k, item, inIt
          for (; item = ar[i]; ++i) {
            inIt = false
            for (k = 0; k < r.length; ++k) {
              if (r[k] === item) {
                inIt = true; break
              }
            }
            if (!inIt) r[j++] = item
          }
          return r
        }
      
        $.ender({
          parents: function (selector, closest) {
            if (!this.length) return this
            if (!selector) selector = '*'
            var collection = $(selector), j, k, p, r = []
            for (j = 0, k = this.length; j < k; j++) {
              p = this[j]
              while (p = p.parentNode) {
                if (~indexOf(collection, p)) {
                  r.push(p)
                  if (closest) break;
                }
              }
            }
            return $(uniq(r))
          }
      
        , parent: function() {
            return $(uniq(b(this).parent()))
          }
      
        , closest: function (selector) {
            return this.parents(selector, true)
          }
      
        , first: function () {
            return $(this.length ? this[0] : this)
          }
      
        , last: function () {
            return $(this.length ? this[this.length - 1] : [])
          }
      
        , next: function () {
            return $(b(this).next())
          }
      
        , previous: function () {
            return $(b(this).previous())
          }
      
        , related: function (t) {
            return $(b(this).related(t))
          }
      
        , appendTo: function (t) {
            return b(this.selector).appendTo(t, this)
          }
      
        , prependTo: function (t) {
            return b(this.selector).prependTo(t, this)
          }
      
        , insertAfter: function (t) {
            return b(this.selector).insertAfter(t, this)
          }
      
        , insertBefore: function (t) {
            return b(this.selector).insertBefore(t, this)
          }
      
        , clone: function () {
            return $(b(this).clone(this))
          }
      
        , siblings: function () {
            var i, l, p, r = []
            for (i = 0, l = this.length; i < l; i++) {
              p = this[i]
              while (p = p.previousSibling) p.nodeType == 1 && r.push(p)
              p = this[i]
              while (p = p.nextSibling) p.nodeType == 1 && r.push(p)
            }
            return $(r)
          }
      
        , children: function () {
            var i, l, el, r = []
            for (i = 0, l = this.length; i < l; i++) {
              if (!(el = b.firstChild(this[i]))) continue;
              r.push(el)
              while (el = el.nextSibling) el.nodeType == 1 && r.push(el)
            }
            return $(uniq(r))
          }
      
        , height: function (v) {
            return dimension.call(this, 'height', v)
          }
      
        , width: function (v) {
            return dimension.call(this, 'width', v)
          }
        }, true)
      
        /**
         * @param {string} type either width or height
         * @param {number=} opt_v becomes a setter instead of a getter
         * @return {number}
         */
        function dimension(type, opt_v) {
          return typeof opt_v == 'undefined'
            ? b(this).dim()[type]
            : this.css(type, opt_v)
        }
      }(ender));
    }
  }, 'bonzo');

  Module.createPackage('bean', {
    'bean': function (module, exports, require, global) {
      /*!
        * Bean - copyright (c) Jacob Thornton 2011-2012
        * https://github.com/fat/bean
        * MIT license
        */
      (function (name, context, definition) {
        if (typeof module != 'undefined' && module.exports) module.exports = definition()
        else if (typeof define == 'function' && define.amd) define(definition)
        else context[name] = definition()
      })('bean', this, function (name, context) {
        name    = name    || 'bean'
        context = context || this
      
        var win            = window
          , old            = context[name]
          , namespaceRegex = /[^\.]*(?=\..*)\.|.*/
          , nameRegex      = /\..*/
          , addEvent       = 'addEventListener'
          , removeEvent    = 'removeEventListener'
          , doc            = document || {}
          , root           = doc.documentElement || {}
          , W3C_MODEL      = root[addEvent]
          , eventSupport   = W3C_MODEL ? addEvent : 'attachEvent'
          , ONE            = {} // singleton for quick matching making add() do one()
      
          , slice          = Array.prototype.slice
          , str2arr        = function (s, d) { return s.split(d || ' ') }
          , isString       = function (o) { return typeof o == 'string' }
          , isFunction     = function (o) { return typeof o == 'function' }
      
            // events that we consider to be 'native', anything not in this list will
            // be treated as a custom event
          , standardNativeEvents =
              'click dblclick mouseup mousedown contextmenu '                  + // mouse buttons
              'mousewheel mousemultiwheel DOMMouseScroll '                     + // mouse wheel
              'mouseover mouseout mousemove selectstart selectend '            + // mouse movement
              'keydown keypress keyup '                                        + // keyboard
              'orientationchange '                                             + // mobile
              'focus blur change reset select submit '                         + // form elements
              'load unload beforeunload resize move DOMContentLoaded '         + // window
              'readystatechange message '                                      + // window
              'error abort scroll '                                              // misc
            // element.fireEvent('onXYZ'... is not forgiving if we try to fire an event
            // that doesn't actually exist, so make sure we only do these on newer browsers
          , w3cNativeEvents =
              'show '                                                          + // mouse buttons
              'input invalid '                                                 + // form elements
              'touchstart touchmove touchend touchcancel '                     + // touch
              'gesturestart gesturechange gestureend '                         + // gesture
              'textinput '                                                     + // TextEvent
              'readystatechange pageshow pagehide popstate '                   + // window
              'hashchange offline online '                                     + // window
              'afterprint beforeprint '                                        + // printing
              'dragstart dragenter dragover dragleave drag drop dragend '      + // dnd
              'loadstart progress suspend emptied stalled loadmetadata '       + // media
              'loadeddata canplay canplaythrough playing waiting seeking '     + // media
              'seeked ended durationchange timeupdate play pause ratechange '  + // media
              'volumechange cuechange '                                        + // media
              'checking noupdate downloading cached updateready obsolete '       // appcache
      
            // convert to a hash for quick lookups
          , nativeEvents = (function (hash, events, i) {
              for (i = 0; i < events.length; i++) events[i] && (hash[events[i]] = 1)
              return hash
            }({}, str2arr(standardNativeEvents + (W3C_MODEL ? w3cNativeEvents : ''))))
      
            // custom events are events that we *fake*, they are not provided natively but
            // we can use native events to generate them
          , customEvents = (function () {
              var isAncestor = 'compareDocumentPosition' in root
                    ? function (element, container) {
                        return container.compareDocumentPosition && (container.compareDocumentPosition(element) & 16) === 16
                      }
                    : 'contains' in root
                      ? function (element, container) {
                          container = container.nodeType === 9 || container === window ? root : container
                          return container !== element && container.contains(element)
                        }
                      : function (element, container) {
                          while (element = element.parentNode) if (element === container) return 1
                          return 0
                        }
                , check = function (event) {
                    var related = event.relatedTarget
                    return !related
                      ? related == null
                      : (related !== this && related.prefix !== 'xul' && !/document/.test(this.toString())
                          && !isAncestor(related, this))
                  }
      
              return {
                  mouseenter: { base: 'mouseover', condition: check }
                , mouseleave: { base: 'mouseout', condition: check }
                , mousewheel: { base: /Firefox/.test(navigator.userAgent) ? 'DOMMouseScroll' : 'mousewheel' }
              }
            }())
      
            // we provide a consistent Event object across browsers by taking the actual DOM
            // event object and generating a new one from its properties.
          , Event = (function () {
                  // a whitelist of properties (for different event types) tells us what to check for and copy
              var commonProps  = str2arr('altKey attrChange attrName bubbles cancelable ctrlKey currentTarget ' +
                    'detail eventPhase getModifierState isTrusted metaKey relatedNode relatedTarget shiftKey '  +
                    'srcElement target timeStamp type view which propertyName')
                , mouseProps   = commonProps.concat(str2arr('button buttons clientX clientY dataTransfer '      +
                    'fromElement offsetX offsetY pageX pageY screenX screenY toElement'))
                , mouseWheelProps = mouseProps.concat(str2arr('wheelDelta wheelDeltaX wheelDeltaY wheelDeltaZ ' +
                    'axis')) // 'axis' is FF specific
                , keyProps     = commonProps.concat(str2arr('char charCode key keyCode keyIdentifier '          +
                    'keyLocation location'))
                , textProps    = commonProps.concat(str2arr('data'))
                , touchProps   = commonProps.concat(str2arr('touches targetTouches changedTouches scale rotation'))
                , messageProps = commonProps.concat(str2arr('data origin source'))
                , stateProps   = commonProps.concat(str2arr('state'))
                , overOutRegex = /over|out/
                  // some event types need special handling and some need special properties, do that all here
                , typeFixers   = [
                      { // key events
                          reg: /key/i
                        , fix: function (event, newEvent) {
                            newEvent.keyCode = event.keyCode || event.which
                            return keyProps
                          }
                      }
                    , { // mouse events
                          reg: /click|mouse(?!(.*wheel|scroll))|menu|drag|drop/i
                        , fix: function (event, newEvent, type) {
                            newEvent.rightClick = event.which === 3 || event.button === 2
                            newEvent.pos = { x: 0, y: 0 }
                            if (event.pageX || event.pageY) {
                              newEvent.clientX = event.pageX
                              newEvent.clientY = event.pageY
                            } else if (event.clientX || event.clientY) {
                              newEvent.clientX = event.clientX + doc.body.scrollLeft + root.scrollLeft
                              newEvent.clientY = event.clientY + doc.body.scrollTop + root.scrollTop
                            }
                            if (overOutRegex.test(type)) {
                              newEvent.relatedTarget = event.relatedTarget
                                || event[(type == 'mouseover' ? 'from' : 'to') + 'Element']
                            }
                            return mouseProps
                          }
                      }
                    , { // mouse wheel events
                          reg: /mouse.*(wheel|scroll)/i
                        , fix: function () { return mouseWheelProps }
                      }
                    , { // TextEvent
                          reg: /^text/i
                        , fix: function () { return textProps }
                      }
                    , { // touch and gesture events
                          reg: /^touch|^gesture/i
                        , fix: function () { return touchProps }
                      }
                    , { // message events
                          reg: /^message$/i
                        , fix: function () { return messageProps }
                      }
                    , { // popstate events
                          reg: /^popstate$/i
                        , fix: function () { return stateProps }
                      }
                    , { // everything else
                          reg: /.*/
                        , fix: function () { return commonProps }
                      }
                  ]
                , typeFixerMap = {} // used to map event types to fixer functions (above), a basic cache mechanism
      
                , Event = function (event, element, isNative) {
                    if (!arguments.length) return
                    event = event || ((element.ownerDocument || element.document || element).parentWindow || win).event
                    this.originalEvent = event
                    this.isNative       = isNative
                    this.isBean         = true
      
                    if (!event) return
      
                    var type   = event.type
                      , target = event.target || event.srcElement
                      , i, l, p, props, fixer
      
                    this.target = target && target.nodeType === 3 ? target.parentNode : target
      
                    if (isNative) { // we only need basic augmentation on custom events, the rest expensive & pointless
                      fixer = typeFixerMap[type]
                      if (!fixer) { // haven't encountered this event type before, map a fixer function for it
                        for (i = 0, l = typeFixers.length; i < l; i++) {
                          if (typeFixers[i].reg.test(type)) { // guaranteed to match at least one, last is .*
                            typeFixerMap[type] = fixer = typeFixers[i].fix
                            break
                          }
                        }
                      }
      
                      props = fixer(event, this, type)
                      for (i = props.length; i--;) {
                        if (!((p = props[i]) in this) && p in event) this[p] = event[p]
                      }
                    }
                  }
      
              // preventDefault() and stopPropagation() are a consistent interface to those functions
              // on the DOM, stop() is an alias for both of them together
              Event.prototype.preventDefault = function () {
                if (this.originalEvent.preventDefault) this.originalEvent.preventDefault()
                else this.originalEvent.returnValue = false
              }
              Event.prototype.stopPropagation = function () {
                if (this.originalEvent.stopPropagation) this.originalEvent.stopPropagation()
                else this.originalEvent.cancelBubble = true
              }
              Event.prototype.stop = function () {
                this.preventDefault()
                this.stopPropagation()
                this.stopped = true
              }
              // stopImmediatePropagation() has to be handled internally because we manage the event list for
              // each element
              // note that originalElement may be a Bean#Event object in some situations
              Event.prototype.stopImmediatePropagation = function () {
                if (this.originalEvent.stopImmediatePropagation) this.originalEvent.stopImmediatePropagation()
                this.isImmediatePropagationStopped = function () { return true }
              }
              Event.prototype.isImmediatePropagationStopped = function () {
                return this.originalEvent.isImmediatePropagationStopped && this.originalEvent.isImmediatePropagationStopped()
              }
              Event.prototype.clone = function (currentTarget) {
                //TODO: this is ripe for optimisation, new events are *expensive*
                // improving this will speed up delegated events
                var ne = new Event(this, this.element, this.isNative)
                ne.currentTarget = currentTarget
                return ne
              }
      
              return Event
            }())
      
            // if we're in old IE we can't do onpropertychange on doc or win so we use doc.documentElement for both
          , targetElement = function (element, isNative) {
              return !W3C_MODEL && !isNative && (element === doc || element === win) ? root : element
            }
      
            /**
              * Bean maintains an internal registry for event listeners. We don't touch elements, objects
              * or functions to identify them, instead we store everything in the registry.
              * Each event listener has a RegEntry object, we have one 'registry' for the whole instance.
              */
          , RegEntry = (function () {
              // each handler is wrapped so we can handle delegation and custom events
              var wrappedHandler = function (element, fn, condition, args) {
                  var call = function (event, eargs) {
                        return fn.apply(element, args ? slice.call(eargs, event ? 0 : 1).concat(args) : eargs)
                      }
                    , findTarget = function (event, eventElement) {
                        return fn.__beanDel ? fn.__beanDel.ft(event.target, element) : eventElement
                      }
                    , handler = condition
                        ? function (event) {
                            var target = findTarget(event, this) // deleated event
                            if (condition.apply(target, arguments)) {
                              if (event) event.currentTarget = target
                              return call(event, arguments)
                            }
                          }
                        : function (event) {
                            if (fn.__beanDel) event = event.clone(findTarget(event)) // delegated event, fix the fix
                            return call(event, arguments)
                          }
                  handler.__beanDel = fn.__beanDel
                  return handler
                }
      
              , RegEntry = function (element, type, handler, original, namespaces, args, root) {
                  var customType     = customEvents[type]
                    , isNative
      
                  if (type == 'unload') {
                    // self clean-up
                    handler = once(removeListener, element, type, handler, original)
                  }
      
                  if (customType) {
                    if (customType.condition) {
                      handler = wrappedHandler(element, handler, customType.condition, args)
                    }
                    type = customType.base || type
                  }
      
                  this.isNative      = isNative = nativeEvents[type] && !!element[eventSupport]
                  this.customType    = !W3C_MODEL && !isNative && type
                  this.element       = element
                  this.type          = type
                  this.original      = original
                  this.namespaces    = namespaces
                  this.eventType     = W3C_MODEL || isNative ? type : 'propertychange'
                  this.target        = targetElement(element, isNative)
                  this[eventSupport] = !!this.target[eventSupport]
                  this.root          = root
                  this.handler       = wrappedHandler(element, handler, null, args)
                }
      
              // given a list of namespaces, is our entry in any of them?
              RegEntry.prototype.inNamespaces = function (checkNamespaces) {
                var i, j, c = 0
                if (!checkNamespaces) return true
                if (!this.namespaces) return false
                for (i = checkNamespaces.length; i--;) {
                  for (j = this.namespaces.length; j--;) {
                    if (checkNamespaces[i] == this.namespaces[j]) c++
                  }
                }
                return checkNamespaces.length === c
              }
      
              // match by element, original fn (opt), handler fn (opt)
              RegEntry.prototype.matches = function (checkElement, checkOriginal, checkHandler) {
                return this.element === checkElement &&
                  (!checkOriginal || this.original === checkOriginal) &&
                  (!checkHandler || this.handler === checkHandler)
              }
      
              return RegEntry
            }())
      
          , registry = (function () {
              // our map stores arrays by event type, just because it's better than storing
              // everything in a single array.
              // uses '$' as a prefix for the keys for safety and 'r' as a special prefix for
              // rootListeners so we can look them up fast
              var map = {}
      
                // generic functional search of our registry for matching listeners,
                // `fn` returns false to break out of the loop
                , forAll = function (element, type, original, handler, root, fn) {
                    var pfx = root ? 'r' : '$'
                    if (!type || type == '*') {
                      // search the whole registry
                      for (var t in map) {
                        if (t.charAt(0) == pfx) {
                          forAll(element, t.substr(1), original, handler, root, fn)
                        }
                      }
                    } else {
                      var i = 0, l, list = map[pfx + type], all = element == '*'
                      if (!list) return
                      for (l = list.length; i < l; i++) {
                        if ((all || list[i].matches(element, original, handler)) && !fn(list[i], list, i, type)) return
                      }
                    }
                  }
      
                , has = function (element, type, original, root) {
                    // we're not using forAll here simply because it's a bit slower and this
                    // needs to be fast
                    var i, list = map[(root ? 'r' : '$') + type]
                    if (list) {
                      for (i = list.length; i--;) {
                        if (!list[i].root && list[i].matches(element, original, null)) return true
                      }
                    }
                    return false
                  }
      
                , get = function (element, type, original, root) {
                    var entries = []
                    forAll(element, type, original, null, root, function (entry) {
                      return entries.push(entry)
                    })
                    return entries
                  }
      
                , put = function (entry) {
                    var has = !entry.root && !this.has(entry.element, entry.type, null, false)
                      , key = (entry.root ? 'r' : '$') + entry.type
                    ;(map[key] || (map[key] = [])).push(entry)
                    return has
                  }
      
                , del = function (entry) {
                    forAll(entry.element, entry.type, null, entry.handler, entry.root, function (entry, list, i) {
                      list.splice(i, 1)
                      entry.removed = true
                      if (list.length === 0) delete map[(entry.root ? 'r' : '$') + entry.type]
                      return false
                    })
                  }
      
                  // dump all entries, used for onunload
                , entries = function () {
                    var t, entries = []
                    for (t in map) {
                      if (t.charAt(0) == '$') entries = entries.concat(map[t])
                    }
                    return entries
                  }
      
              return { has: has, get: get, put: put, del: del, entries: entries }
            }())
      
            // we need a selector engine for delegated events, use querySelectorAll if it exists
            // but for older browsers we need Qwery, Sizzle or similar
          , selectorEngine
          , setSelectorEngine = function (e) {
              if (!arguments.length) {
                selectorEngine = doc.querySelectorAll
                  ? function (s, r) {
                      return r.querySelectorAll(s)
                    }
                  : function () {
                      throw new Error('Bean: No selector engine installed') // eeek
                    }
              } else {
                selectorEngine = e
              }
            }
      
            // we attach this listener to each DOM event that we need to listen to, only once
            // per event type per DOM element
          , rootListener = function (event, type) {
              if (!W3C_MODEL && type && event && event.propertyName != '_on' + type) return
      
              var listeners = registry.get(this, type || event.type, null, false)
                , l = listeners.length
                , i = 0
      
              event = new Event(event, this, true)
              if (type) event.type = type
      
              // iterate through all handlers registered for this type, calling them unless they have
              // been removed by a previous handler or stopImmediatePropagation() has been called
              for (; i < l && !event.isImmediatePropagationStopped(); i++) {
                if (!listeners[i].removed) listeners[i].handler.call(this, event)
              }
            }
      
            // add and remove listeners to DOM elements
          , listener = W3C_MODEL
              ? function (element, type, add) {
                  // new browsers
                  element[add ? addEvent : removeEvent](type, rootListener, false)
                }
              : function (element, type, add, custom) {
                  // IE8 and below, use attachEvent/detachEvent and we have to piggy-back propertychange events
                  // to simulate event bubbling etc.
                  var entry
                  if (add) {
                    registry.put(entry = new RegEntry(
                        element
                      , custom || type
                      , function (event) { // handler
                          rootListener.call(element, event, custom)
                        }
                      , rootListener
                      , null
                      , null
                      , true // is root
                    ))
                    if (custom && element['_on' + custom] == null) element['_on' + custom] = 0
                    entry.target.attachEvent('on' + entry.eventType, entry.handler)
                  } else {
                    entry = registry.get(element, custom || type, rootListener, true)[0]
                    if (entry) {
                      entry.target.detachEvent('on' + entry.eventType, entry.handler)
                      registry.del(entry)
                    }
                  }
                }
      
          , once = function (rm, element, type, fn, originalFn) {
              // wrap the handler in a handler that does a remove as well
              return function () {
                fn.apply(this, arguments)
                rm(element, type, originalFn)
              }
            }
      
          , removeListener = function (element, orgType, handler, namespaces) {
              var type     = orgType && orgType.replace(nameRegex, '')
                , handlers = registry.get(element, type, null, false)
                , removed  = {}
                , i, l
      
              for (i = 0, l = handlers.length; i < l; i++) {
                if ((!handler || handlers[i].original === handler) && handlers[i].inNamespaces(namespaces)) {
                  // TODO: this is problematic, we have a registry.get() and registry.del() that
                  // both do registry searches so we waste cycles doing this. Needs to be rolled into
                  // a single registry.forAll(fn) that removes while finding, but the catch is that
                  // we'll be splicing the arrays that we're iterating over. Needs extra tests to
                  // make sure we don't screw it up. @rvagg
                  registry.del(handlers[i])
                  if (!removed[handlers[i].eventType] && handlers[i][eventSupport])
                    removed[handlers[i].eventType] = { t: handlers[i].eventType, c: handlers[i].type }
                }
              }
              // check each type/element for removed listeners and remove the rootListener where it's no longer needed
              for (i in removed) {
                if (!registry.has(element, removed[i].t, null, false)) {
                  // last listener of this type, remove the rootListener
                  listener(element, removed[i].t, false, removed[i].c)
                }
              }
            }
      
            // set up a delegate helper using the given selector, wrap the handler function
          , delegate = function (selector, fn) {
              //TODO: findTarget (therefore $) is called twice, once for match and once for
              // setting e.currentTarget, fix this so it's only needed once
              var findTarget = function (target, root) {
                    var i, array = isString(selector) ? selectorEngine(selector, root) : selector
                    for (; target && target !== root; target = target.parentNode) {
                      for (i = array.length; i--;) {
                        if (array[i] === target) return target
                      }
                    }
                  }
                , handler = function (e) {
                    var match = findTarget(e.target, this)
                    if (match) fn.apply(match, arguments)
                  }
      
              // __beanDel isn't pleasant but it's a private function, not exposed outside of Bean
              handler.__beanDel = {
                  ft       : findTarget // attach it here for customEvents to use too
                , selector : selector
              }
              return handler
            }
      
          , fireListener = W3C_MODEL ? function (isNative, type, element) {
              // modern browsers, do a proper dispatchEvent()
              var evt = doc.createEvent(isNative ? 'HTMLEvents' : 'UIEvents')
              evt[isNative ? 'initEvent' : 'initUIEvent'](type, true, true, win, 1)
              element.dispatchEvent(evt)
            } : function (isNative, type, element) {
              // old browser use onpropertychange, just increment a custom property to trigger the event
              element = targetElement(element, isNative)
              isNative ? element.fireEvent('on' + type, doc.createEventObject()) : element['_on' + type]++
            }
      
            /**
              * Public API: off(), on(), add(), (remove()), one(), fire(), clone()
              */
      
            /**
              * off(element[, eventType(s)[, handler ]])
              */
          , off = function (element, typeSpec, fn) {
              var isTypeStr = isString(typeSpec)
                , k, type, namespaces, i
      
              if (isTypeStr && typeSpec.indexOf(' ') > 0) {
                // off(el, 't1 t2 t3', fn) or off(el, 't1 t2 t3')
                typeSpec = str2arr(typeSpec)
                for (i = typeSpec.length; i--;)
                  off(element, typeSpec[i], fn)
                return element
              }
      
              type = isTypeStr && typeSpec.replace(nameRegex, '')
              if (type && customEvents[type]) type = customEvents[type].base
      
              if (!typeSpec || isTypeStr) {
                // off(el) or off(el, t1.ns) or off(el, .ns) or off(el, .ns1.ns2.ns3)
                if (namespaces = isTypeStr && typeSpec.replace(namespaceRegex, '')) namespaces = str2arr(namespaces, '.')
                removeListener(element, type, fn, namespaces)
              } else if (isFunction(typeSpec)) {
                // off(el, fn)
                removeListener(element, null, typeSpec)
              } else {
                // off(el, { t1: fn1, t2, fn2 })
                for (k in typeSpec) {
                  if (typeSpec.hasOwnProperty(k)) off(element, k, typeSpec[k])
                }
              }
      
              return element
            }
      
            /**
              * on(element, eventType(s)[, selector], handler[, args ])
              */
          , on = function(element, events, selector, fn) {
              var originalFn, type, types, i, args, entry, first
      
              //TODO: the undefined check means you can't pass an 'args' argument, fix this perhaps?
              if (selector === undefined && typeof events == 'object') {
                //TODO: this can't handle delegated events
                for (type in events) {
                  if (events.hasOwnProperty(type)) {
                    on.call(this, element, type, events[type])
                  }
                }
                return
              }
      
              if (!isFunction(selector)) {
                // delegated event
                originalFn = fn
                args       = slice.call(arguments, 4)
                fn         = delegate(selector, originalFn, selectorEngine)
              } else {
                args       = slice.call(arguments, 3)
                fn         = originalFn = selector
              }
      
              types = str2arr(events)
      
              // special case for one(), wrap in a self-removing handler
              if (this === ONE) {
                fn = once(off, element, events, fn, originalFn)
              }
      
              for (i = types.length; i--;) {
                // add new handler to the registry and check if it's the first for this element/type
                first = registry.put(entry = new RegEntry(
                    element
                  , types[i].replace(nameRegex, '') // event type
                  , fn
                  , originalFn
                  , str2arr(types[i].replace(namespaceRegex, ''), '.') // namespaces
                  , args
                  , false // not root
                ))
                if (entry[eventSupport] && first) {
                  // first event of this type on this element, add root listener
                  listener(element, entry.eventType, true, entry.customType)
                }
              }
      
              return element
            }
      
            /**
              * add(element[, selector], eventType(s), handler[, args ])
              *
              * Deprecated: kept (for now) for backward-compatibility
              */
          , add = function (element, events, fn, delfn) {
              return on.apply(
                  null
                , !isString(fn)
                    ? slice.call(arguments)
                    : [ element, fn, events, delfn ].concat(arguments.length > 3 ? slice.call(arguments, 5) : [])
              )
            }
      
            /**
              * one(element, eventType(s)[, selector], handler[, args ])
              */
          , one = function () {
              return on.apply(ONE, arguments)
            }
      
            /**
              * fire(element, eventType(s)[, args ])
              *
              * The optional 'args' argument must be an array, if no 'args' argument is provided
              * then we can use the browser's DOM event system, otherwise we trigger handlers manually
              */
          , fire = function (element, type, args) {
              var types = str2arr(type)
                , i, j, l, names, handlers
      
              for (i = types.length; i--;) {
                type = types[i].replace(nameRegex, '')
                if (names = types[i].replace(namespaceRegex, '')) names = str2arr(names, '.')
                if (!names && !args && element[eventSupport]) {
                  fireListener(nativeEvents[type], type, element)
                } else {
                  // non-native event, either because of a namespace, arguments or a non DOM element
                  // iterate over all listeners and manually 'fire'
                  handlers = registry.get(element, type, null, false)
                  args = [false].concat(args)
                  for (j = 0, l = handlers.length; j < l; j++) {
                    if (handlers[j].inNamespaces(names)) {
                      handlers[j].handler.apply(element, args)
                    }
                  }
                }
              }
              return element
            }
      
            /**
              * clone(dstElement, srcElement[, eventType ])
              *
              * TODO: perhaps for consistency we should allow the same flexibility in type specifiers?
              */
          , clone = function (element, from, type) {
              var handlers = registry.get(from, type, null, false)
                , l = handlers.length
                , i = 0
                , args, beanDel
      
              for (; i < l; i++) {
                if (handlers[i].original) {
                  args = [ element, handlers[i].type ]
                  if (beanDel = handlers[i].handler.__beanDel) args.push(beanDel.selector)
                  args.push(handlers[i].original)
                  on.apply(null, args)
                }
              }
              return element
            }
      
          , bean = {
                'on'                : on
              , 'add'               : add
              , 'one'               : one
              , 'off'               : off
              , 'remove'            : off
              , 'clone'             : clone
              , 'fire'              : fire
              , 'Event'             : Event
              , 'setSelectorEngine' : setSelectorEngine
              , 'noConflict'        : function () {
                  context[name] = old
                  return this
                }
            }
      
        // for IE, clean up on unload to avoid leaks
        if (win.attachEvent) {
          var cleanup = function () {
            var i, entries = registry.entries()
            for (i in entries) {
              if (entries[i].type && entries[i].type !== 'unload') off(entries[i].element, entries[i].type)
            }
            win.detachEvent('onunload', cleanup)
            win.CollectGarbage && win.CollectGarbage()
          }
          win.attachEvent('onunload', cleanup)
        }
      
        // initialize selector engine to internal default (qSA or throw Error)
        setSelectorEngine()
      
        return bean
      });
      
    },
    'src/ender': function (module, exports, require, global) {
      !function ($) {
        var b = require('bean')
      
          , integrate = function (method, type, method2) {
              var _args = type ? [type] : []
              return function () {
                for (var i = 0, l = this.length; i < l; i++) {
                  if (!arguments.length && method == 'on' && type) method = 'fire'
                  b[method].apply(this, [this[i]].concat(_args, Array.prototype.slice.call(arguments, 0)))
                }
                return this
              }
            }
      
          , add   = integrate('add')
          , on    = integrate('on')
          , one   = integrate('one')
          , off   = integrate('off')
          , fire  = integrate('fire')
          , clone = integrate('clone')
      
          , hover = function (enter, leave, i) { // i for internal
              for (i = this.length; i--;) {
                b['on'].call(this, this[i], 'mouseenter', enter)
                b['on'].call(this, this[i], 'mouseleave', leave)
              }
              return this
            }
      
          , methods = {
                'on'             : on
              , 'addListener'    : on
              , 'bind'           : on
              , 'listen'         : on
              , 'delegate'       : add // jQuery compat, same arg order as add()
      
              , 'one'            : one
      
              , 'off'            : off
              , 'unbind'         : off
              , 'unlisten'       : off
              , 'removeListener' : off
              , 'undelegate'     : off
      
              , 'emit'           : fire
              , 'trigger'        : fire
      
              , 'cloneEvents'    : clone
      
              , 'hover'          : hover
            }
      
          , shortcuts =
               ('blur change click dblclick error focus focusin focusout keydown keypress '
              + 'keyup load mousedown mouseenter mouseleave mouseout mouseover mouseup '
              + 'mousemove resize scroll select submit unload').split(' ')
      
        for (var i = shortcuts.length; i--;) {
          methods[shortcuts[i]] = integrate('on', shortcuts[i])
        }
      
        b['setSelectorEngine']($)
      
        $.ender(methods, true)
      }(ender);
    }
  }, 'bean');

  Module.createPackage('moment', {
    'moment': function (module, exports, require, global) {
      //! moment.js
      //! version : 2.8.3
      //! authors : Tim Wood, Iskren Chernev, Moment.js contributors
      //! license : MIT
      //! momentjs.com
      
      (function (undefined) {
          /************************************
              Constants
          ************************************/
      
          var moment,
              VERSION = '2.8.3',
              // the global-scope this is NOT the global object in Node.js
              globalScope = typeof global !== 'undefined' ? global : this,
              oldGlobalMoment,
              round = Math.round,
              hasOwnProperty = Object.prototype.hasOwnProperty,
              i,
      
              YEAR = 0,
              MONTH = 1,
              DATE = 2,
              HOUR = 3,
              MINUTE = 4,
              SECOND = 5,
              MILLISECOND = 6,
      
              // internal storage for locale config files
              locales = {},
      
              // extra moment internal properties (plugins register props here)
              momentProperties = [],
      
              // check for nodeJS
              hasModule = (typeof module !== 'undefined' && module.exports),
      
              // ASP.NET json date format regex
              aspNetJsonRegex = /^\/?Date\((\-?\d+)/i,
              aspNetTimeSpanJsonRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,
      
              // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
              // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
              isoDurationRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,
      
              // format tokens
              formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|X|zz?|ZZ?|.)/g,
              localFormattingTokens = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,
      
              // parsing token regexes
              parseTokenOneOrTwoDigits = /\d\d?/, // 0 - 99
              parseTokenOneToThreeDigits = /\d{1,3}/, // 0 - 999
              parseTokenOneToFourDigits = /\d{1,4}/, // 0 - 9999
              parseTokenOneToSixDigits = /[+\-]?\d{1,6}/, // -999,999 - 999,999
              parseTokenDigits = /\d+/, // nonzero number of digits
              parseTokenWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, // any word (or two) characters or numbers including two/three word month in arabic.
              parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
              parseTokenT = /T/i, // T (ISO separator)
              parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123
              parseTokenOrdinal = /\d{1,2}/,
      
              //strict parsing regexes
              parseTokenOneDigit = /\d/, // 0 - 9
              parseTokenTwoDigits = /\d\d/, // 00 - 99
              parseTokenThreeDigits = /\d{3}/, // 000 - 999
              parseTokenFourDigits = /\d{4}/, // 0000 - 9999
              parseTokenSixDigits = /[+-]?\d{6}/, // -999,999 - 999,999
              parseTokenSignedNumber = /[+-]?\d+/, // -inf - inf
      
              // iso 8601 regex
              // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
              isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
      
              isoFormat = 'YYYY-MM-DDTHH:mm:ssZ',
      
              isoDates = [
                  ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
                  ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
                  ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
                  ['GGGG-[W]WW', /\d{4}-W\d{2}/],
                  ['YYYY-DDD', /\d{4}-\d{3}/]
              ],
      
              // iso time formats and regexes
              isoTimes = [
                  ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/],
                  ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
                  ['HH:mm', /(T| )\d\d:\d\d/],
                  ['HH', /(T| )\d\d/]
              ],
      
              // timezone chunker '+10:00' > ['10', '00'] or '-1530' > ['-15', '30']
              parseTimezoneChunker = /([\+\-]|\d\d)/gi,
      
              // getter and setter names
              proxyGettersAndSetters = 'Date|Hours|Minutes|Seconds|Milliseconds'.split('|'),
              unitMillisecondFactors = {
                  'Milliseconds' : 1,
                  'Seconds' : 1e3,
                  'Minutes' : 6e4,
                  'Hours' : 36e5,
                  'Days' : 864e5,
                  'Months' : 2592e6,
                  'Years' : 31536e6
              },
      
              unitAliases = {
                  ms : 'millisecond',
                  s : 'second',
                  m : 'minute',
                  h : 'hour',
                  d : 'day',
                  D : 'date',
                  w : 'week',
                  W : 'isoWeek',
                  M : 'month',
                  Q : 'quarter',
                  y : 'year',
                  DDD : 'dayOfYear',
                  e : 'weekday',
                  E : 'isoWeekday',
                  gg: 'weekYear',
                  GG: 'isoWeekYear'
              },
      
              camelFunctions = {
                  dayofyear : 'dayOfYear',
                  isoweekday : 'isoWeekday',
                  isoweek : 'isoWeek',
                  weekyear : 'weekYear',
                  isoweekyear : 'isoWeekYear'
              },
      
              // format function strings
              formatFunctions = {},
      
              // default relative time thresholds
              relativeTimeThresholds = {
                  s: 45,  // seconds to minute
                  m: 45,  // minutes to hour
                  h: 22,  // hours to day
                  d: 26,  // days to month
                  M: 11   // months to year
              },
      
              // tokens to ordinalize and pad
              ordinalizeTokens = 'DDD w W M D d'.split(' '),
              paddedTokens = 'M D H h m s w W'.split(' '),
      
              formatTokenFunctions = {
                  M    : function () {
                      return this.month() + 1;
                  },
                  MMM  : function (format) {
                      return this.localeData().monthsShort(this, format);
                  },
                  MMMM : function (format) {
                      return this.localeData().months(this, format);
                  },
                  D    : function () {
                      return this.date();
                  },
                  DDD  : function () {
                      return this.dayOfYear();
                  },
                  d    : function () {
                      return this.day();
                  },
                  dd   : function (format) {
                      return this.localeData().weekdaysMin(this, format);
                  },
                  ddd  : function (format) {
                      return this.localeData().weekdaysShort(this, format);
                  },
                  dddd : function (format) {
                      return this.localeData().weekdays(this, format);
                  },
                  w    : function () {
                      return this.week();
                  },
                  W    : function () {
                      return this.isoWeek();
                  },
                  YY   : function () {
                      return leftZeroFill(this.year() % 100, 2);
                  },
                  YYYY : function () {
                      return leftZeroFill(this.year(), 4);
                  },
                  YYYYY : function () {
                      return leftZeroFill(this.year(), 5);
                  },
                  YYYYYY : function () {
                      var y = this.year(), sign = y >= 0 ? '+' : '-';
                      return sign + leftZeroFill(Math.abs(y), 6);
                  },
                  gg   : function () {
                      return leftZeroFill(this.weekYear() % 100, 2);
                  },
                  gggg : function () {
                      return leftZeroFill(this.weekYear(), 4);
                  },
                  ggggg : function () {
                      return leftZeroFill(this.weekYear(), 5);
                  },
                  GG   : function () {
                      return leftZeroFill(this.isoWeekYear() % 100, 2);
                  },
                  GGGG : function () {
                      return leftZeroFill(this.isoWeekYear(), 4);
                  },
                  GGGGG : function () {
                      return leftZeroFill(this.isoWeekYear(), 5);
                  },
                  e : function () {
                      return this.weekday();
                  },
                  E : function () {
                      return this.isoWeekday();
                  },
                  a    : function () {
                      return this.localeData().meridiem(this.hours(), this.minutes(), true);
                  },
                  A    : function () {
                      return this.localeData().meridiem(this.hours(), this.minutes(), false);
                  },
                  H    : function () {
                      return this.hours();
                  },
                  h    : function () {
                      return this.hours() % 12 || 12;
                  },
                  m    : function () {
                      return this.minutes();
                  },
                  s    : function () {
                      return this.seconds();
                  },
                  S    : function () {
                      return toInt(this.milliseconds() / 100);
                  },
                  SS   : function () {
                      return leftZeroFill(toInt(this.milliseconds() / 10), 2);
                  },
                  SSS  : function () {
                      return leftZeroFill(this.milliseconds(), 3);
                  },
                  SSSS : function () {
                      return leftZeroFill(this.milliseconds(), 3);
                  },
                  Z    : function () {
                      var a = -this.zone(),
                          b = '+';
                      if (a < 0) {
                          a = -a;
                          b = '-';
                      }
                      return b + leftZeroFill(toInt(a / 60), 2) + ':' + leftZeroFill(toInt(a) % 60, 2);
                  },
                  ZZ   : function () {
                      var a = -this.zone(),
                          b = '+';
                      if (a < 0) {
                          a = -a;
                          b = '-';
                      }
                      return b + leftZeroFill(toInt(a / 60), 2) + leftZeroFill(toInt(a) % 60, 2);
                  },
                  z : function () {
                      return this.zoneAbbr();
                  },
                  zz : function () {
                      return this.zoneName();
                  },
                  X    : function () {
                      return this.unix();
                  },
                  Q : function () {
                      return this.quarter();
                  }
              },
      
              deprecations = {},
      
              lists = ['months', 'monthsShort', 'weekdays', 'weekdaysShort', 'weekdaysMin'];
      
          // Pick the first defined of two or three arguments. dfl comes from
          // default.
          function dfl(a, b, c) {
              switch (arguments.length) {
                  case 2: return a != null ? a : b;
                  case 3: return a != null ? a : b != null ? b : c;
                  default: throw new Error('Implement me');
              }
          }
      
          function hasOwnProp(a, b) {
              return hasOwnProperty.call(a, b);
          }
      
          function defaultParsingFlags() {
              // We need to deep clone this object, and es5 standard is not very
              // helpful.
              return {
                  empty : false,
                  unusedTokens : [],
                  unusedInput : [],
                  overflow : -2,
                  charsLeftOver : 0,
                  nullInput : false,
                  invalidMonth : null,
                  invalidFormat : false,
                  userInvalidated : false,
                  iso: false
              };
          }
      
          function printMsg(msg) {
              if (moment.suppressDeprecationWarnings === false &&
                      typeof console !== 'undefined' && console.warn) {
                  console.warn('Deprecation warning: ' + msg);
              }
          }
      
          function deprecate(msg, fn) {
              var firstTime = true;
              return extend(function () {
                  if (firstTime) {
                      printMsg(msg);
                      firstTime = false;
                  }
                  return fn.apply(this, arguments);
              }, fn);
          }
      
          function deprecateSimple(name, msg) {
              if (!deprecations[name]) {
                  printMsg(msg);
                  deprecations[name] = true;
              }
          }
      
          function padToken(func, count) {
              return function (a) {
                  return leftZeroFill(func.call(this, a), count);
              };
          }
          function ordinalizeToken(func, period) {
              return function (a) {
                  return this.localeData().ordinal(func.call(this, a), period);
              };
          }
      
          while (ordinalizeTokens.length) {
              i = ordinalizeTokens.pop();
              formatTokenFunctions[i + 'o'] = ordinalizeToken(formatTokenFunctions[i], i);
          }
          while (paddedTokens.length) {
              i = paddedTokens.pop();
              formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);
          }
          formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3);
      
      
          /************************************
              Constructors
          ************************************/
      
          function Locale() {
          }
      
          // Moment prototype object
          function Moment(config, skipOverflow) {
              if (skipOverflow !== false) {
                  checkOverflow(config);
              }
              copyConfig(this, config);
              this._d = new Date(+config._d);
          }
      
          // Duration Constructor
          function Duration(duration) {
              var normalizedInput = normalizeObjectUnits(duration),
                  years = normalizedInput.year || 0,
                  quarters = normalizedInput.quarter || 0,
                  months = normalizedInput.month || 0,
                  weeks = normalizedInput.week || 0,
                  days = normalizedInput.day || 0,
                  hours = normalizedInput.hour || 0,
                  minutes = normalizedInput.minute || 0,
                  seconds = normalizedInput.second || 0,
                  milliseconds = normalizedInput.millisecond || 0;
      
              // representation for dateAddRemove
              this._milliseconds = +milliseconds +
                  seconds * 1e3 + // 1000
                  minutes * 6e4 + // 1000 * 60
                  hours * 36e5; // 1000 * 60 * 60
              // Because of dateAddRemove treats 24 hours as different from a
              // day when working around DST, we need to store them separately
              this._days = +days +
                  weeks * 7;
              // It is impossible translate months into days without knowing
              // which months you are are talking about, so we have to store
              // it separately.
              this._months = +months +
                  quarters * 3 +
                  years * 12;
      
              this._data = {};
      
              this._locale = moment.localeData();
      
              this._bubble();
          }
      
          /************************************
              Helpers
          ************************************/
      
      
          function extend(a, b) {
              for (var i in b) {
                  if (hasOwnProp(b, i)) {
                      a[i] = b[i];
                  }
              }
      
              if (hasOwnProp(b, 'toString')) {
                  a.toString = b.toString;
              }
      
              if (hasOwnProp(b, 'valueOf')) {
                  a.valueOf = b.valueOf;
              }
      
              return a;
          }
      
          function copyConfig(to, from) {
              var i, prop, val;
      
              if (typeof from._isAMomentObject !== 'undefined') {
                  to._isAMomentObject = from._isAMomentObject;
              }
              if (typeof from._i !== 'undefined') {
                  to._i = from._i;
              }
              if (typeof from._f !== 'undefined') {
                  to._f = from._f;
              }
              if (typeof from._l !== 'undefined') {
                  to._l = from._l;
              }
              if (typeof from._strict !== 'undefined') {
                  to._strict = from._strict;
              }
              if (typeof from._tzm !== 'undefined') {
                  to._tzm = from._tzm;
              }
              if (typeof from._isUTC !== 'undefined') {
                  to._isUTC = from._isUTC;
              }
              if (typeof from._offset !== 'undefined') {
                  to._offset = from._offset;
              }
              if (typeof from._pf !== 'undefined') {
                  to._pf = from._pf;
              }
              if (typeof from._locale !== 'undefined') {
                  to._locale = from._locale;
              }
      
              if (momentProperties.length > 0) {
                  for (i in momentProperties) {
                      prop = momentProperties[i];
                      val = from[prop];
                      if (typeof val !== 'undefined') {
                          to[prop] = val;
                      }
                  }
              }
      
              return to;
          }
      
          function absRound(number) {
              if (number < 0) {
                  return Math.ceil(number);
              } else {
                  return Math.floor(number);
              }
          }
      
          // left zero fill a number
          // see http://jsperf.com/left-zero-filling for performance comparison
          function leftZeroFill(number, targetLength, forceSign) {
              var output = '' + Math.abs(number),
                  sign = number >= 0;
      
              while (output.length < targetLength) {
                  output = '0' + output;
              }
              return (sign ? (forceSign ? '+' : '') : '-') + output;
          }
      
          function positiveMomentsDifference(base, other) {
              var res = {milliseconds: 0, months: 0};
      
              res.months = other.month() - base.month() +
                  (other.year() - base.year()) * 12;
              if (base.clone().add(res.months, 'M').isAfter(other)) {
                  --res.months;
              }
      
              res.milliseconds = +other - +(base.clone().add(res.months, 'M'));
      
              return res;
          }
      
          function momentsDifference(base, other) {
              var res;
              other = makeAs(other, base);
              if (base.isBefore(other)) {
                  res = positiveMomentsDifference(base, other);
              } else {
                  res = positiveMomentsDifference(other, base);
                  res.milliseconds = -res.milliseconds;
                  res.months = -res.months;
              }
      
              return res;
          }
      
          // TODO: remove 'name' arg after deprecation is removed
          function createAdder(direction, name) {
              return function (val, period) {
                  var dur, tmp;
                  //invert the arguments, but complain about it
                  if (period !== null && !isNaN(+period)) {
                      deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                      tmp = val; val = period; period = tmp;
                  }
      
                  val = typeof val === 'string' ? +val : val;
                  dur = moment.duration(val, period);
                  addOrSubtractDurationFromMoment(this, dur, direction);
                  return this;
              };
          }
      
          function addOrSubtractDurationFromMoment(mom, duration, isAdding, updateOffset) {
              var milliseconds = duration._milliseconds,
                  days = duration._days,
                  months = duration._months;
              updateOffset = updateOffset == null ? true : updateOffset;
      
              if (milliseconds) {
                  mom._d.setTime(+mom._d + milliseconds * isAdding);
              }
              if (days) {
                  rawSetter(mom, 'Date', rawGetter(mom, 'Date') + days * isAdding);
              }
              if (months) {
                  rawMonthSetter(mom, rawGetter(mom, 'Month') + months * isAdding);
              }
              if (updateOffset) {
                  moment.updateOffset(mom, days || months);
              }
          }
      
          // check if is an array
          function isArray(input) {
              return Object.prototype.toString.call(input) === '[object Array]';
          }
      
          function isDate(input) {
              return Object.prototype.toString.call(input) === '[object Date]' ||
                  input instanceof Date;
          }
      
          // compare two arrays, return the number of differences
          function compareArrays(array1, array2, dontConvert) {
              var len = Math.min(array1.length, array2.length),
                  lengthDiff = Math.abs(array1.length - array2.length),
                  diffs = 0,
                  i;
              for (i = 0; i < len; i++) {
                  if ((dontConvert && array1[i] !== array2[i]) ||
                      (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                      diffs++;
                  }
              }
              return diffs + lengthDiff;
          }
      
          function normalizeUnits(units) {
              if (units) {
                  var lowered = units.toLowerCase().replace(/(.)s$/, '$1');
                  units = unitAliases[units] || camelFunctions[lowered] || lowered;
              }
              return units;
          }
      
          function normalizeObjectUnits(inputObject) {
              var normalizedInput = {},
                  normalizedProp,
                  prop;
      
              for (prop in inputObject) {
                  if (hasOwnProp(inputObject, prop)) {
                      normalizedProp = normalizeUnits(prop);
                      if (normalizedProp) {
                          normalizedInput[normalizedProp] = inputObject[prop];
                      }
                  }
              }
      
              return normalizedInput;
          }
      
          function makeList(field) {
              var count, setter;
      
              if (field.indexOf('week') === 0) {
                  count = 7;
                  setter = 'day';
              }
              else if (field.indexOf('month') === 0) {
                  count = 12;
                  setter = 'month';
              }
              else {
                  return;
              }
      
              moment[field] = function (format, index) {
                  var i, getter,
                      method = moment._locale[field],
                      results = [];
      
                  if (typeof format === 'number') {
                      index = format;
                      format = undefined;
                  }
      
                  getter = function (i) {
                      var m = moment().utc().set(setter, i);
                      return method.call(moment._locale, m, format || '');
                  };
      
                  if (index != null) {
                      return getter(index);
                  }
                  else {
                      for (i = 0; i < count; i++) {
                          results.push(getter(i));
                      }
                      return results;
                  }
              };
          }
      
          function toInt(argumentForCoercion) {
              var coercedNumber = +argumentForCoercion,
                  value = 0;
      
              if (coercedNumber !== 0 && isFinite(coercedNumber)) {
                  if (coercedNumber >= 0) {
                      value = Math.floor(coercedNumber);
                  } else {
                      value = Math.ceil(coercedNumber);
                  }
              }
      
              return value;
          }
      
          function daysInMonth(year, month) {
              return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
          }
      
          function weeksInYear(year, dow, doy) {
              return weekOfYear(moment([year, 11, 31 + dow - doy]), dow, doy).week;
          }
      
          function daysInYear(year) {
              return isLeapYear(year) ? 366 : 365;
          }
      
          function isLeapYear(year) {
              return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
          }
      
          function checkOverflow(m) {
              var overflow;
              if (m._a && m._pf.overflow === -2) {
                  overflow =
                      m._a[MONTH] < 0 || m._a[MONTH] > 11 ? MONTH :
                      m._a[DATE] < 1 || m._a[DATE] > daysInMonth(m._a[YEAR], m._a[MONTH]) ? DATE :
                      m._a[HOUR] < 0 || m._a[HOUR] > 23 ? HOUR :
                      m._a[MINUTE] < 0 || m._a[MINUTE] > 59 ? MINUTE :
                      m._a[SECOND] < 0 || m._a[SECOND] > 59 ? SECOND :
                      m._a[MILLISECOND] < 0 || m._a[MILLISECOND] > 999 ? MILLISECOND :
                      -1;
      
                  if (m._pf._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                      overflow = DATE;
                  }
      
                  m._pf.overflow = overflow;
              }
          }
      
          function isValid(m) {
              if (m._isValid == null) {
                  m._isValid = !isNaN(m._d.getTime()) &&
                      m._pf.overflow < 0 &&
                      !m._pf.empty &&
                      !m._pf.invalidMonth &&
                      !m._pf.nullInput &&
                      !m._pf.invalidFormat &&
                      !m._pf.userInvalidated;
      
                  if (m._strict) {
                      m._isValid = m._isValid &&
                          m._pf.charsLeftOver === 0 &&
                          m._pf.unusedTokens.length === 0;
                  }
              }
              return m._isValid;
          }
      
          function normalizeLocale(key) {
              return key ? key.toLowerCase().replace('_', '-') : key;
          }
      
          // pick the locale from the array
          // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
          // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
          function chooseLocale(names) {
              var i = 0, j, next, locale, split;
      
              while (i < names.length) {
                  split = normalizeLocale(names[i]).split('-');
                  j = split.length;
                  next = normalizeLocale(names[i + 1]);
                  next = next ? next.split('-') : null;
                  while (j > 0) {
                      locale = loadLocale(split.slice(0, j).join('-'));
                      if (locale) {
                          return locale;
                      }
                      if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                          //the next array item is better than a shallower substring of this one
                          break;
                      }
                      j--;
                  }
                  i++;
              }
              return null;
          }
      
          function loadLocale(name) {
              var oldLocale = null;
              if (!locales[name] && hasModule) {
                  try {
                      oldLocale = moment.locale();
                      require('./locale/' + name);
                      // because defineLocale currently also sets the global locale, we want to undo that for lazy loaded locales
                      moment.locale(oldLocale);
                  } catch (e) { }
              }
              return locales[name];
          }
      
          // Return a moment from input, that is local/utc/zone equivalent to model.
          function makeAs(input, model) {
              return model._isUTC ? moment(input).zone(model._offset || 0) :
                  moment(input).local();
          }
      
          /************************************
              Locale
          ************************************/
      
      
          extend(Locale.prototype, {
      
              set : function (config) {
                  var prop, i;
                  for (i in config) {
                      prop = config[i];
                      if (typeof prop === 'function') {
                          this[i] = prop;
                      } else {
                          this['_' + i] = prop;
                      }
                  }
              },
      
              _months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
              months : function (m) {
                  return this._months[m.month()];
              },
      
              _monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
              monthsShort : function (m) {
                  return this._monthsShort[m.month()];
              },
      
              monthsParse : function (monthName) {
                  var i, mom, regex;
      
                  if (!this._monthsParse) {
                      this._monthsParse = [];
                  }
      
                  for (i = 0; i < 12; i++) {
                      // make the regex if we don't have it already
                      if (!this._monthsParse[i]) {
                          mom = moment.utc([2000, i]);
                          regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                          this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
                      }
                      // test the regex
                      if (this._monthsParse[i].test(monthName)) {
                          return i;
                      }
                  }
              },
      
              _weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
              weekdays : function (m) {
                  return this._weekdays[m.day()];
              },
      
              _weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
              weekdaysShort : function (m) {
                  return this._weekdaysShort[m.day()];
              },
      
              _weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
              weekdaysMin : function (m) {
                  return this._weekdaysMin[m.day()];
              },
      
              weekdaysParse : function (weekdayName) {
                  var i, mom, regex;
      
                  if (!this._weekdaysParse) {
                      this._weekdaysParse = [];
                  }
      
                  for (i = 0; i < 7; i++) {
                      // make the regex if we don't have it already
                      if (!this._weekdaysParse[i]) {
                          mom = moment([2000, 1]).day(i);
                          regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                          this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
                      }
                      // test the regex
                      if (this._weekdaysParse[i].test(weekdayName)) {
                          return i;
                      }
                  }
              },
      
              _longDateFormat : {
                  LT : 'h:mm A',
                  L : 'MM/DD/YYYY',
                  LL : 'MMMM D, YYYY',
                  LLL : 'MMMM D, YYYY LT',
                  LLLL : 'dddd, MMMM D, YYYY LT'
              },
              longDateFormat : function (key) {
                  var output = this._longDateFormat[key];
                  if (!output && this._longDateFormat[key.toUpperCase()]) {
                      output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (val) {
                          return val.slice(1);
                      });
                      this._longDateFormat[key] = output;
                  }
                  return output;
              },
      
              isPM : function (input) {
                  // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
                  // Using charAt should be more compatible.
                  return ((input + '').toLowerCase().charAt(0) === 'p');
              },
      
              _meridiemParse : /[ap]\.?m?\.?/i,
              meridiem : function (hours, minutes, isLower) {
                  if (hours > 11) {
                      return isLower ? 'pm' : 'PM';
                  } else {
                      return isLower ? 'am' : 'AM';
                  }
              },
      
              _calendar : {
                  sameDay : '[Today at] LT',
                  nextDay : '[Tomorrow at] LT',
                  nextWeek : 'dddd [at] LT',
                  lastDay : '[Yesterday at] LT',
                  lastWeek : '[Last] dddd [at] LT',
                  sameElse : 'L'
              },
              calendar : function (key, mom) {
                  var output = this._calendar[key];
                  return typeof output === 'function' ? output.apply(mom) : output;
              },
      
              _relativeTime : {
                  future : 'in %s',
                  past : '%s ago',
                  s : 'a few seconds',
                  m : 'a minute',
                  mm : '%d minutes',
                  h : 'an hour',
                  hh : '%d hours',
                  d : 'a day',
                  dd : '%d days',
                  M : 'a month',
                  MM : '%d months',
                  y : 'a year',
                  yy : '%d years'
              },
      
              relativeTime : function (number, withoutSuffix, string, isFuture) {
                  var output = this._relativeTime[string];
                  return (typeof output === 'function') ?
                      output(number, withoutSuffix, string, isFuture) :
                      output.replace(/%d/i, number);
              },
      
              pastFuture : function (diff, output) {
                  var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
                  return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
              },
      
              ordinal : function (number) {
                  return this._ordinal.replace('%d', number);
              },
              _ordinal : '%d',
      
              preparse : function (string) {
                  return string;
              },
      
              postformat : function (string) {
                  return string;
              },
      
              week : function (mom) {
                  return weekOfYear(mom, this._week.dow, this._week.doy).week;
              },
      
              _week : {
                  dow : 0, // Sunday is the first day of the week.
                  doy : 6  // The week that contains Jan 1st is the first week of the year.
              },
      
              _invalidDate: 'Invalid date',
              invalidDate: function () {
                  return this._invalidDate;
              }
          });
      
          /************************************
              Formatting
          ************************************/
      
      
          function removeFormattingTokens(input) {
              if (input.match(/\[[\s\S]/)) {
                  return input.replace(/^\[|\]$/g, '');
              }
              return input.replace(/\\/g, '');
          }
      
          function makeFormatFunction(format) {
              var array = format.match(formattingTokens), i, length;
      
              for (i = 0, length = array.length; i < length; i++) {
                  if (formatTokenFunctions[array[i]]) {
                      array[i] = formatTokenFunctions[array[i]];
                  } else {
                      array[i] = removeFormattingTokens(array[i]);
                  }
              }
      
              return function (mom) {
                  var output = '';
                  for (i = 0; i < length; i++) {
                      output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
                  }
                  return output;
              };
          }
      
          // format date using native date object
          function formatMoment(m, format) {
              if (!m.isValid()) {
                  return m.localeData().invalidDate();
              }
      
              format = expandFormat(format, m.localeData());
      
              if (!formatFunctions[format]) {
                  formatFunctions[format] = makeFormatFunction(format);
              }
      
              return formatFunctions[format](m);
          }
      
          function expandFormat(format, locale) {
              var i = 5;
      
              function replaceLongDateFormatTokens(input) {
                  return locale.longDateFormat(input) || input;
              }
      
              localFormattingTokens.lastIndex = 0;
              while (i >= 0 && localFormattingTokens.test(format)) {
                  format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
                  localFormattingTokens.lastIndex = 0;
                  i -= 1;
              }
      
              return format;
          }
      
      
          /************************************
              Parsing
          ************************************/
      
      
          // get the regex to find the next token
          function getParseRegexForToken(token, config) {
              var a, strict = config._strict;
              switch (token) {
              case 'Q':
                  return parseTokenOneDigit;
              case 'DDDD':
                  return parseTokenThreeDigits;
              case 'YYYY':
              case 'GGGG':
              case 'gggg':
                  return strict ? parseTokenFourDigits : parseTokenOneToFourDigits;
              case 'Y':
              case 'G':
              case 'g':
                  return parseTokenSignedNumber;
              case 'YYYYYY':
              case 'YYYYY':
              case 'GGGGG':
              case 'ggggg':
                  return strict ? parseTokenSixDigits : parseTokenOneToSixDigits;
              case 'S':
                  if (strict) {
                      return parseTokenOneDigit;
                  }
                  /* falls through */
              case 'SS':
                  if (strict) {
                      return parseTokenTwoDigits;
                  }
                  /* falls through */
              case 'SSS':
                  if (strict) {
                      return parseTokenThreeDigits;
                  }
                  /* falls through */
              case 'DDD':
                  return parseTokenOneToThreeDigits;
              case 'MMM':
              case 'MMMM':
              case 'dd':
              case 'ddd':
              case 'dddd':
                  return parseTokenWord;
              case 'a':
              case 'A':
                  return config._locale._meridiemParse;
              case 'X':
                  return parseTokenTimestampMs;
              case 'Z':
              case 'ZZ':
                  return parseTokenTimezone;
              case 'T':
                  return parseTokenT;
              case 'SSSS':
                  return parseTokenDigits;
              case 'MM':
              case 'DD':
              case 'YY':
              case 'GG':
              case 'gg':
              case 'HH':
              case 'hh':
              case 'mm':
              case 'ss':
              case 'ww':
              case 'WW':
                  return strict ? parseTokenTwoDigits : parseTokenOneOrTwoDigits;
              case 'M':
              case 'D':
              case 'd':
              case 'H':
              case 'h':
              case 'm':
              case 's':
              case 'w':
              case 'W':
              case 'e':
              case 'E':
                  return parseTokenOneOrTwoDigits;
              case 'Do':
                  return parseTokenOrdinal;
              default :
                  a = new RegExp(regexpEscape(unescapeFormat(token.replace('\\', '')), 'i'));
                  return a;
              }
          }
      
          function timezoneMinutesFromString(string) {
              string = string || '';
              var possibleTzMatches = (string.match(parseTokenTimezone) || []),
                  tzChunk = possibleTzMatches[possibleTzMatches.length - 1] || [],
                  parts = (tzChunk + '').match(parseTimezoneChunker) || ['-', 0, 0],
                  minutes = +(parts[1] * 60) + toInt(parts[2]);
      
              return parts[0] === '+' ? -minutes : minutes;
          }
      
          // function to convert string input to date
          function addTimeToArrayFromToken(token, input, config) {
              var a, datePartArray = config._a;
      
              switch (token) {
              // QUARTER
              case 'Q':
                  if (input != null) {
                      datePartArray[MONTH] = (toInt(input) - 1) * 3;
                  }
                  break;
              // MONTH
              case 'M' : // fall through to MM
              case 'MM' :
                  if (input != null) {
                      datePartArray[MONTH] = toInt(input) - 1;
                  }
                  break;
              case 'MMM' : // fall through to MMMM
              case 'MMMM' :
                  a = config._locale.monthsParse(input);
                  // if we didn't find a month name, mark the date as invalid.
                  if (a != null) {
                      datePartArray[MONTH] = a;
                  } else {
                      config._pf.invalidMonth = input;
                  }
                  break;
              // DAY OF MONTH
              case 'D' : // fall through to DD
              case 'DD' :
                  if (input != null) {
                      datePartArray[DATE] = toInt(input);
                  }
                  break;
              case 'Do' :
                  if (input != null) {
                      datePartArray[DATE] = toInt(parseInt(input, 10));
                  }
                  break;
              // DAY OF YEAR
              case 'DDD' : // fall through to DDDD
              case 'DDDD' :
                  if (input != null) {
                      config._dayOfYear = toInt(input);
                  }
      
                  break;
              // YEAR
              case 'YY' :
                  datePartArray[YEAR] = moment.parseTwoDigitYear(input);
                  break;
              case 'YYYY' :
              case 'YYYYY' :
              case 'YYYYYY' :
                  datePartArray[YEAR] = toInt(input);
                  break;
              // AM / PM
              case 'a' : // fall through to A
              case 'A' :
                  config._isPm = config._locale.isPM(input);
                  break;
              // 24 HOUR
              case 'H' : // fall through to hh
              case 'HH' : // fall through to hh
              case 'h' : // fall through to hh
              case 'hh' :
                  datePartArray[HOUR] = toInt(input);
                  break;
              // MINUTE
              case 'm' : // fall through to mm
              case 'mm' :
                  datePartArray[MINUTE] = toInt(input);
                  break;
              // SECOND
              case 's' : // fall through to ss
              case 'ss' :
                  datePartArray[SECOND] = toInt(input);
                  break;
              // MILLISECOND
              case 'S' :
              case 'SS' :
              case 'SSS' :
              case 'SSSS' :
                  datePartArray[MILLISECOND] = toInt(('0.' + input) * 1000);
                  break;
              // UNIX TIMESTAMP WITH MS
              case 'X':
                  config._d = new Date(parseFloat(input) * 1000);
                  break;
              // TIMEZONE
              case 'Z' : // fall through to ZZ
              case 'ZZ' :
                  config._useUTC = true;
                  config._tzm = timezoneMinutesFromString(input);
                  break;
              // WEEKDAY - human
              case 'dd':
              case 'ddd':
              case 'dddd':
                  a = config._locale.weekdaysParse(input);
                  // if we didn't get a weekday name, mark the date as invalid
                  if (a != null) {
                      config._w = config._w || {};
                      config._w['d'] = a;
                  } else {
                      config._pf.invalidWeekday = input;
                  }
                  break;
              // WEEK, WEEK DAY - numeric
              case 'w':
              case 'ww':
              case 'W':
              case 'WW':
              case 'd':
              case 'e':
              case 'E':
                  token = token.substr(0, 1);
                  /* falls through */
              case 'gggg':
              case 'GGGG':
              case 'GGGGG':
                  token = token.substr(0, 2);
                  if (input) {
                      config._w = config._w || {};
                      config._w[token] = toInt(input);
                  }
                  break;
              case 'gg':
              case 'GG':
                  config._w = config._w || {};
                  config._w[token] = moment.parseTwoDigitYear(input);
              }
          }
      
          function dayOfYearFromWeekInfo(config) {
              var w, weekYear, week, weekday, dow, doy, temp;
      
              w = config._w;
              if (w.GG != null || w.W != null || w.E != null) {
                  dow = 1;
                  doy = 4;
      
                  // TODO: We need to take the current isoWeekYear, but that depends on
                  // how we interpret now (local, utc, fixed offset). So create
                  // a now version of current config (take local/utc/offset flags, and
                  // create now).
                  weekYear = dfl(w.GG, config._a[YEAR], weekOfYear(moment(), 1, 4).year);
                  week = dfl(w.W, 1);
                  weekday = dfl(w.E, 1);
              } else {
                  dow = config._locale._week.dow;
                  doy = config._locale._week.doy;
      
                  weekYear = dfl(w.gg, config._a[YEAR], weekOfYear(moment(), dow, doy).year);
                  week = dfl(w.w, 1);
      
                  if (w.d != null) {
                      // weekday -- low day numbers are considered next week
                      weekday = w.d;
                      if (weekday < dow) {
                          ++week;
                      }
                  } else if (w.e != null) {
                      // local weekday -- counting starts from begining of week
                      weekday = w.e + dow;
                  } else {
                      // default to begining of week
                      weekday = dow;
                  }
              }
              temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);
      
              config._a[YEAR] = temp.year;
              config._dayOfYear = temp.dayOfYear;
          }
      
          // convert an array to a date.
          // the array should mirror the parameters below
          // note: all values past the year are optional and will default to the lowest possible value.
          // [year, month, day , hour, minute, second, millisecond]
          function dateFromConfig(config) {
              var i, date, input = [], currentDate, yearToUse;
      
              if (config._d) {
                  return;
              }
      
              currentDate = currentDateArray(config);
      
              //compute day of the year from weeks and weekdays
              if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
                  dayOfYearFromWeekInfo(config);
              }
      
              //if the day of the year is set, figure out what it is
              if (config._dayOfYear) {
                  yearToUse = dfl(config._a[YEAR], currentDate[YEAR]);
      
                  if (config._dayOfYear > daysInYear(yearToUse)) {
                      config._pf._overflowDayOfYear = true;
                  }
      
                  date = makeUTCDate(yearToUse, 0, config._dayOfYear);
                  config._a[MONTH] = date.getUTCMonth();
                  config._a[DATE] = date.getUTCDate();
              }
      
              // Default to current date.
              // * if no year, month, day of month are given, default to today
              // * if day of month is given, default month and year
              // * if month is given, default only year
              // * if year is given, don't default anything
              for (i = 0; i < 3 && config._a[i] == null; ++i) {
                  config._a[i] = input[i] = currentDate[i];
              }
      
              // Zero out whatever was not defaulted, including time
              for (; i < 7; i++) {
                  config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
              }
      
              config._d = (config._useUTC ? makeUTCDate : makeDate).apply(null, input);
              // Apply timezone offset from input. The actual zone can be changed
              // with parseZone.
              if (config._tzm != null) {
                  config._d.setUTCMinutes(config._d.getUTCMinutes() + config._tzm);
              }
          }
      
          function dateFromObject(config) {
              var normalizedInput;
      
              if (config._d) {
                  return;
              }
      
              normalizedInput = normalizeObjectUnits(config._i);
              config._a = [
                  normalizedInput.year,
                  normalizedInput.month,
                  normalizedInput.day,
                  normalizedInput.hour,
                  normalizedInput.minute,
                  normalizedInput.second,
                  normalizedInput.millisecond
              ];
      
              dateFromConfig(config);
          }
      
          function currentDateArray(config) {
              var now = new Date();
              if (config._useUTC) {
                  return [
                      now.getUTCFullYear(),
                      now.getUTCMonth(),
                      now.getUTCDate()
                  ];
              } else {
                  return [now.getFullYear(), now.getMonth(), now.getDate()];
              }
          }
      
          // date from string and format string
          function makeDateFromStringAndFormat(config) {
              if (config._f === moment.ISO_8601) {
                  parseISO(config);
                  return;
              }
      
              config._a = [];
              config._pf.empty = true;
      
              // This array is used to make a Date, either with `new Date` or `Date.UTC`
              var string = '' + config._i,
                  i, parsedInput, tokens, token, skipped,
                  stringLength = string.length,
                  totalParsedInputLength = 0;
      
              tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];
      
              for (i = 0; i < tokens.length; i++) {
                  token = tokens[i];
                  parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
                  if (parsedInput) {
                      skipped = string.substr(0, string.indexOf(parsedInput));
                      if (skipped.length > 0) {
                          config._pf.unusedInput.push(skipped);
                      }
                      string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                      totalParsedInputLength += parsedInput.length;
                  }
                  // don't parse if it's not a known token
                  if (formatTokenFunctions[token]) {
                      if (parsedInput) {
                          config._pf.empty = false;
                      }
                      else {
                          config._pf.unusedTokens.push(token);
                      }
                      addTimeToArrayFromToken(token, parsedInput, config);
                  }
                  else if (config._strict && !parsedInput) {
                      config._pf.unusedTokens.push(token);
                  }
              }
      
              // add remaining unparsed input length to the string
              config._pf.charsLeftOver = stringLength - totalParsedInputLength;
              if (string.length > 0) {
                  config._pf.unusedInput.push(string);
              }
      
              // handle am pm
              if (config._isPm && config._a[HOUR] < 12) {
                  config._a[HOUR] += 12;
              }
              // if is 12 am, change hours to 0
              if (config._isPm === false && config._a[HOUR] === 12) {
                  config._a[HOUR] = 0;
              }
      
              dateFromConfig(config);
              checkOverflow(config);
          }
      
          function unescapeFormat(s) {
              return s.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
                  return p1 || p2 || p3 || p4;
              });
          }
      
          // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
          function regexpEscape(s) {
              return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          }
      
          // date from string and array of format strings
          function makeDateFromStringAndArray(config) {
              var tempConfig,
                  bestMoment,
      
                  scoreToBeat,
                  i,
                  currentScore;
      
              if (config._f.length === 0) {
                  config._pf.invalidFormat = true;
                  config._d = new Date(NaN);
                  return;
              }
      
              for (i = 0; i < config._f.length; i++) {
                  currentScore = 0;
                  tempConfig = copyConfig({}, config);
                  if (config._useUTC != null) {
                      tempConfig._useUTC = config._useUTC;
                  }
                  tempConfig._pf = defaultParsingFlags();
                  tempConfig._f = config._f[i];
                  makeDateFromStringAndFormat(tempConfig);
      
                  if (!isValid(tempConfig)) {
                      continue;
                  }
      
                  // if there is any input that was not parsed add a penalty for that format
                  currentScore += tempConfig._pf.charsLeftOver;
      
                  //or tokens
                  currentScore += tempConfig._pf.unusedTokens.length * 10;
      
                  tempConfig._pf.score = currentScore;
      
                  if (scoreToBeat == null || currentScore < scoreToBeat) {
                      scoreToBeat = currentScore;
                      bestMoment = tempConfig;
                  }
              }
      
              extend(config, bestMoment || tempConfig);
          }
      
          // date from iso format
          function parseISO(config) {
              var i, l,
                  string = config._i,
                  match = isoRegex.exec(string);
      
              if (match) {
                  config._pf.iso = true;
                  for (i = 0, l = isoDates.length; i < l; i++) {
                      if (isoDates[i][1].exec(string)) {
                          // match[5] should be 'T' or undefined
                          config._f = isoDates[i][0] + (match[6] || ' ');
                          break;
                      }
                  }
                  for (i = 0, l = isoTimes.length; i < l; i++) {
                      if (isoTimes[i][1].exec(string)) {
                          config._f += isoTimes[i][0];
                          break;
                      }
                  }
                  if (string.match(parseTokenTimezone)) {
                      config._f += 'Z';
                  }
                  makeDateFromStringAndFormat(config);
              } else {
                  config._isValid = false;
              }
          }
      
          // date from iso format or fallback
          function makeDateFromString(config) {
              parseISO(config);
              if (config._isValid === false) {
                  delete config._isValid;
                  moment.createFromInputFallback(config);
              }
          }
      
          function map(arr, fn) {
              var res = [], i;
              for (i = 0; i < arr.length; ++i) {
                  res.push(fn(arr[i], i));
              }
              return res;
          }
      
          function makeDateFromInput(config) {
              var input = config._i, matched;
              if (input === undefined) {
                  config._d = new Date();
              } else if (isDate(input)) {
                  config._d = new Date(+input);
              } else if ((matched = aspNetJsonRegex.exec(input)) !== null) {
                  config._d = new Date(+matched[1]);
              } else if (typeof input === 'string') {
                  makeDateFromString(config);
              } else if (isArray(input)) {
                  config._a = map(input.slice(0), function (obj) {
                      return parseInt(obj, 10);
                  });
                  dateFromConfig(config);
              } else if (typeof(input) === 'object') {
                  dateFromObject(config);
              } else if (typeof(input) === 'number') {
                  // from milliseconds
                  config._d = new Date(input);
              } else {
                  moment.createFromInputFallback(config);
              }
          }
      
          function makeDate(y, m, d, h, M, s, ms) {
              //can't just apply() to create a date:
              //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
              var date = new Date(y, m, d, h, M, s, ms);
      
              //the date constructor doesn't accept years < 1970
              if (y < 1970) {
                  date.setFullYear(y);
              }
              return date;
          }
      
          function makeUTCDate(y) {
              var date = new Date(Date.UTC.apply(null, arguments));
              if (y < 1970) {
                  date.setUTCFullYear(y);
              }
              return date;
          }
      
          function parseWeekday(input, locale) {
              if (typeof input === 'string') {
                  if (!isNaN(input)) {
                      input = parseInt(input, 10);
                  }
                  else {
                      input = locale.weekdaysParse(input);
                      if (typeof input !== 'number') {
                          return null;
                      }
                  }
              }
              return input;
          }
      
          /************************************
              Relative Time
          ************************************/
      
      
          // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
          function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
              return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
          }
      
          function relativeTime(posNegDuration, withoutSuffix, locale) {
              var duration = moment.duration(posNegDuration).abs(),
                  seconds = round(duration.as('s')),
                  minutes = round(duration.as('m')),
                  hours = round(duration.as('h')),
                  days = round(duration.as('d')),
                  months = round(duration.as('M')),
                  years = round(duration.as('y')),
      
                  args = seconds < relativeTimeThresholds.s && ['s', seconds] ||
                      minutes === 1 && ['m'] ||
                      minutes < relativeTimeThresholds.m && ['mm', minutes] ||
                      hours === 1 && ['h'] ||
                      hours < relativeTimeThresholds.h && ['hh', hours] ||
                      days === 1 && ['d'] ||
                      days < relativeTimeThresholds.d && ['dd', days] ||
                      months === 1 && ['M'] ||
                      months < relativeTimeThresholds.M && ['MM', months] ||
                      years === 1 && ['y'] || ['yy', years];
      
              args[2] = withoutSuffix;
              args[3] = +posNegDuration > 0;
              args[4] = locale;
              return substituteTimeAgo.apply({}, args);
          }
      
      
          /************************************
              Week of Year
          ************************************/
      
      
          // firstDayOfWeek       0 = sun, 6 = sat
          //                      the day of the week that starts the week
          //                      (usually sunday or monday)
          // firstDayOfWeekOfYear 0 = sun, 6 = sat
          //                      the first week is the week that contains the first
          //                      of this day of the week
          //                      (eg. ISO weeks use thursday (4))
          function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
              var end = firstDayOfWeekOfYear - firstDayOfWeek,
                  daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
                  adjustedMoment;
      
      
              if (daysToDayOfWeek > end) {
                  daysToDayOfWeek -= 7;
              }
      
              if (daysToDayOfWeek < end - 7) {
                  daysToDayOfWeek += 7;
              }
      
              adjustedMoment = moment(mom).add(daysToDayOfWeek, 'd');
              return {
                  week: Math.ceil(adjustedMoment.dayOfYear() / 7),
                  year: adjustedMoment.year()
              };
          }
      
          //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
          function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
              var d = makeUTCDate(year, 0, 1).getUTCDay(), daysToAdd, dayOfYear;
      
              d = d === 0 ? 7 : d;
              weekday = weekday != null ? weekday : firstDayOfWeek;
              daysToAdd = firstDayOfWeek - d + (d > firstDayOfWeekOfYear ? 7 : 0) - (d < firstDayOfWeek ? 7 : 0);
              dayOfYear = 7 * (week - 1) + (weekday - firstDayOfWeek) + daysToAdd + 1;
      
              return {
                  year: dayOfYear > 0 ? year : year - 1,
                  dayOfYear: dayOfYear > 0 ?  dayOfYear : daysInYear(year - 1) + dayOfYear
              };
          }
      
          /************************************
              Top Level Functions
          ************************************/
      
          function makeMoment(config) {
              var input = config._i,
                  format = config._f;
      
              config._locale = config._locale || moment.localeData(config._l);
      
              if (input === null || (format === undefined && input === '')) {
                  return moment.invalid({nullInput: true});
              }
      
              if (typeof input === 'string') {
                  config._i = input = config._locale.preparse(input);
              }
      
              if (moment.isMoment(input)) {
                  return new Moment(input, true);
              } else if (format) {
                  if (isArray(format)) {
                      makeDateFromStringAndArray(config);
                  } else {
                      makeDateFromStringAndFormat(config);
                  }
              } else {
                  makeDateFromInput(config);
              }
      
              return new Moment(config);
          }
      
          moment = function (input, format, locale, strict) {
              var c;
      
              if (typeof(locale) === 'boolean') {
                  strict = locale;
                  locale = undefined;
              }
              // object construction must be done this way.
              // https://github.com/moment/moment/issues/1423
              c = {};
              c._isAMomentObject = true;
              c._i = input;
              c._f = format;
              c._l = locale;
              c._strict = strict;
              c._isUTC = false;
              c._pf = defaultParsingFlags();
      
              return makeMoment(c);
          };
      
          moment.suppressDeprecationWarnings = false;
      
          moment.createFromInputFallback = deprecate(
              'moment construction falls back to js Date. This is ' +
              'discouraged and will be removed in upcoming major ' +
              'release. Please refer to ' +
              'https://github.com/moment/moment/issues/1407 for more info.',
              function (config) {
                  config._d = new Date(config._i);
              }
          );
      
          // Pick a moment m from moments so that m[fn](other) is true for all
          // other. This relies on the function fn to be transitive.
          //
          // moments should either be an array of moment objects or an array, whose
          // first element is an array of moment objects.
          function pickBy(fn, moments) {
              var res, i;
              if (moments.length === 1 && isArray(moments[0])) {
                  moments = moments[0];
              }
              if (!moments.length) {
                  return moment();
              }
              res = moments[0];
              for (i = 1; i < moments.length; ++i) {
                  if (moments[i][fn](res)) {
                      res = moments[i];
                  }
              }
              return res;
          }
      
          moment.min = function () {
              var args = [].slice.call(arguments, 0);
      
              return pickBy('isBefore', args);
          };
      
          moment.max = function () {
              var args = [].slice.call(arguments, 0);
      
              return pickBy('isAfter', args);
          };
      
          // creating with utc
          moment.utc = function (input, format, locale, strict) {
              var c;
      
              if (typeof(locale) === 'boolean') {
                  strict = locale;
                  locale = undefined;
              }
              // object construction must be done this way.
              // https://github.com/moment/moment/issues/1423
              c = {};
              c._isAMomentObject = true;
              c._useUTC = true;
              c._isUTC = true;
              c._l = locale;
              c._i = input;
              c._f = format;
              c._strict = strict;
              c._pf = defaultParsingFlags();
      
              return makeMoment(c).utc();
          };
      
          // creating with unix timestamp (in seconds)
          moment.unix = function (input) {
              return moment(input * 1000);
          };
      
          // duration
          moment.duration = function (input, key) {
              var duration = input,
                  // matching against regexp is expensive, do it on demand
                  match = null,
                  sign,
                  ret,
                  parseIso,
                  diffRes;
      
              if (moment.isDuration(input)) {
                  duration = {
                      ms: input._milliseconds,
                      d: input._days,
                      M: input._months
                  };
              } else if (typeof input === 'number') {
                  duration = {};
                  if (key) {
                      duration[key] = input;
                  } else {
                      duration.milliseconds = input;
                  }
              } else if (!!(match = aspNetTimeSpanJsonRegex.exec(input))) {
                  sign = (match[1] === '-') ? -1 : 1;
                  duration = {
                      y: 0,
                      d: toInt(match[DATE]) * sign,
                      h: toInt(match[HOUR]) * sign,
                      m: toInt(match[MINUTE]) * sign,
                      s: toInt(match[SECOND]) * sign,
                      ms: toInt(match[MILLISECOND]) * sign
                  };
              } else if (!!(match = isoDurationRegex.exec(input))) {
                  sign = (match[1] === '-') ? -1 : 1;
                  parseIso = function (inp) {
                      // We'd normally use ~~inp for this, but unfortunately it also
                      // converts floats to ints.
                      // inp may be undefined, so careful calling replace on it.
                      var res = inp && parseFloat(inp.replace(',', '.'));
                      // apply sign while we're at it
                      return (isNaN(res) ? 0 : res) * sign;
                  };
                  duration = {
                      y: parseIso(match[2]),
                      M: parseIso(match[3]),
                      d: parseIso(match[4]),
                      h: parseIso(match[5]),
                      m: parseIso(match[6]),
                      s: parseIso(match[7]),
                      w: parseIso(match[8])
                  };
              } else if (typeof duration === 'object' &&
                      ('from' in duration || 'to' in duration)) {
                  diffRes = momentsDifference(moment(duration.from), moment(duration.to));
      
                  duration = {};
                  duration.ms = diffRes.milliseconds;
                  duration.M = diffRes.months;
              }
      
              ret = new Duration(duration);
      
              if (moment.isDuration(input) && hasOwnProp(input, '_locale')) {
                  ret._locale = input._locale;
              }
      
              return ret;
          };
      
          // version number
          moment.version = VERSION;
      
          // default format
          moment.defaultFormat = isoFormat;
      
          // constant that refers to the ISO standard
          moment.ISO_8601 = function () {};
      
          // Plugins that add properties should also add the key here (null value),
          // so we can properly clone ourselves.
          moment.momentProperties = momentProperties;
      
          // This function will be called whenever a moment is mutated.
          // It is intended to keep the offset in sync with the timezone.
          moment.updateOffset = function () {};
      
          // This function allows you to set a threshold for relative time strings
          moment.relativeTimeThreshold = function (threshold, limit) {
              if (relativeTimeThresholds[threshold] === undefined) {
                  return false;
              }
              if (limit === undefined) {
                  return relativeTimeThresholds[threshold];
              }
              relativeTimeThresholds[threshold] = limit;
              return true;
          };
      
          moment.lang = deprecate(
              'moment.lang is deprecated. Use moment.locale instead.',
              function (key, value) {
                  return moment.locale(key, value);
              }
          );
      
          // This function will load locale and then set the global locale.  If
          // no arguments are passed in, it will simply return the current global
          // locale key.
          moment.locale = function (key, values) {
              var data;
              if (key) {
                  if (typeof(values) !== 'undefined') {
                      data = moment.defineLocale(key, values);
                  }
                  else {
                      data = moment.localeData(key);
                  }
      
                  if (data) {
                      moment.duration._locale = moment._locale = data;
                  }
              }
      
              return moment._locale._abbr;
          };
      
          moment.defineLocale = function (name, values) {
              if (values !== null) {
                  values.abbr = name;
                  if (!locales[name]) {
                      locales[name] = new Locale();
                  }
                  locales[name].set(values);
      
                  // backwards compat for now: also set the locale
                  moment.locale(name);
      
                  return locales[name];
              } else {
                  // useful for testing
                  delete locales[name];
                  return null;
              }
          };
      
          moment.langData = deprecate(
              'moment.langData is deprecated. Use moment.localeData instead.',
              function (key) {
                  return moment.localeData(key);
              }
          );
      
          // returns locale data
          moment.localeData = function (key) {
              var locale;
      
              if (key && key._locale && key._locale._abbr) {
                  key = key._locale._abbr;
              }
      
              if (!key) {
                  return moment._locale;
              }
      
              if (!isArray(key)) {
                  //short-circuit everything else
                  locale = loadLocale(key);
                  if (locale) {
                      return locale;
                  }
                  key = [key];
              }
      
              return chooseLocale(key);
          };
      
          // compare moment object
          moment.isMoment = function (obj) {
              return obj instanceof Moment ||
                  (obj != null && hasOwnProp(obj, '_isAMomentObject'));
          };
      
          // for typechecking Duration objects
          moment.isDuration = function (obj) {
              return obj instanceof Duration;
          };
      
          for (i = lists.length - 1; i >= 0; --i) {
              makeList(lists[i]);
          }
      
          moment.normalizeUnits = function (units) {
              return normalizeUnits(units);
          };
      
          moment.invalid = function (flags) {
              var m = moment.utc(NaN);
              if (flags != null) {
                  extend(m._pf, flags);
              }
              else {
                  m._pf.userInvalidated = true;
              }
      
              return m;
          };
      
          moment.parseZone = function () {
              return moment.apply(null, arguments).parseZone();
          };
      
          moment.parseTwoDigitYear = function (input) {
              return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
          };
      
          /************************************
              Moment Prototype
          ************************************/
      
      
          extend(moment.fn = Moment.prototype, {
      
              clone : function () {
                  return moment(this);
              },
      
              valueOf : function () {
                  return +this._d + ((this._offset || 0) * 60000);
              },
      
              unix : function () {
                  return Math.floor(+this / 1000);
              },
      
              toString : function () {
                  return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
              },
      
              toDate : function () {
                  return this._offset ? new Date(+this) : this._d;
              },
      
              toISOString : function () {
                  var m = moment(this).utc();
                  if (0 < m.year() && m.year() <= 9999) {
                      return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
                  } else {
                      return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
                  }
              },
      
              toArray : function () {
                  var m = this;
                  return [
                      m.year(),
                      m.month(),
                      m.date(),
                      m.hours(),
                      m.minutes(),
                      m.seconds(),
                      m.milliseconds()
                  ];
              },
      
              isValid : function () {
                  return isValid(this);
              },
      
              isDSTShifted : function () {
                  if (this._a) {
                      return this.isValid() && compareArrays(this._a, (this._isUTC ? moment.utc(this._a) : moment(this._a)).toArray()) > 0;
                  }
      
                  return false;
              },
      
              parsingFlags : function () {
                  return extend({}, this._pf);
              },
      
              invalidAt: function () {
                  return this._pf.overflow;
              },
      
              utc : function (keepLocalTime) {
                  return this.zone(0, keepLocalTime);
              },
      
              local : function (keepLocalTime) {
                  if (this._isUTC) {
                      this.zone(0, keepLocalTime);
                      this._isUTC = false;
      
                      if (keepLocalTime) {
                          this.add(this._dateTzOffset(), 'm');
                      }
                  }
                  return this;
              },
      
              format : function (inputString) {
                  var output = formatMoment(this, inputString || moment.defaultFormat);
                  return this.localeData().postformat(output);
              },
      
              add : createAdder(1, 'add'),
      
              subtract : createAdder(-1, 'subtract'),
      
              diff : function (input, units, asFloat) {
                  var that = makeAs(input, this),
                      zoneDiff = (this.zone() - that.zone()) * 6e4,
                      diff, output, daysAdjust;
      
                  units = normalizeUnits(units);
      
                  if (units === 'year' || units === 'month') {
                      // average number of days in the months in the given dates
                      diff = (this.daysInMonth() + that.daysInMonth()) * 432e5; // 24 * 60 * 60 * 1000 / 2
                      // difference in months
                      output = ((this.year() - that.year()) * 12) + (this.month() - that.month());
                      // adjust by taking difference in days, average number of days
                      // and dst in the given months.
                      daysAdjust = (this - moment(this).startOf('month')) -
                          (that - moment(that).startOf('month'));
                      // same as above but with zones, to negate all dst
                      daysAdjust -= ((this.zone() - moment(this).startOf('month').zone()) -
                              (that.zone() - moment(that).startOf('month').zone())) * 6e4;
                      output += daysAdjust / diff;
                      if (units === 'year') {
                          output = output / 12;
                      }
                  } else {
                      diff = (this - that);
                      output = units === 'second' ? diff / 1e3 : // 1000
                          units === 'minute' ? diff / 6e4 : // 1000 * 60
                          units === 'hour' ? diff / 36e5 : // 1000 * 60 * 60
                          units === 'day' ? (diff - zoneDiff) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                          units === 'week' ? (diff - zoneDiff) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                          diff;
                  }
                  return asFloat ? output : absRound(output);
              },
      
              from : function (time, withoutSuffix) {
                  return moment.duration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
              },
      
              fromNow : function (withoutSuffix) {
                  return this.from(moment(), withoutSuffix);
              },
      
              calendar : function (time) {
                  // We want to compare the start of today, vs this.
                  // Getting start-of-today depends on whether we're zone'd or not.
                  var now = time || moment(),
                      sod = makeAs(now, this).startOf('day'),
                      diff = this.diff(sod, 'days', true),
                      format = diff < -6 ? 'sameElse' :
                          diff < -1 ? 'lastWeek' :
                          diff < 0 ? 'lastDay' :
                          diff < 1 ? 'sameDay' :
                          diff < 2 ? 'nextDay' :
                          diff < 7 ? 'nextWeek' : 'sameElse';
                  return this.format(this.localeData().calendar(format, this));
              },
      
              isLeapYear : function () {
                  return isLeapYear(this.year());
              },
      
              isDST : function () {
                  return (this.zone() < this.clone().month(0).zone() ||
                      this.zone() < this.clone().month(5).zone());
              },
      
              day : function (input) {
                  var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
                  if (input != null) {
                      input = parseWeekday(input, this.localeData());
                      return this.add(input - day, 'd');
                  } else {
                      return day;
                  }
              },
      
              month : makeAccessor('Month', true),
      
              startOf : function (units) {
                  units = normalizeUnits(units);
                  // the following switch intentionally omits break keywords
                  // to utilize falling through the cases.
                  switch (units) {
                  case 'year':
                      this.month(0);
                      /* falls through */
                  case 'quarter':
                  case 'month':
                      this.date(1);
                      /* falls through */
                  case 'week':
                  case 'isoWeek':
                  case 'day':
                      this.hours(0);
                      /* falls through */
                  case 'hour':
                      this.minutes(0);
                      /* falls through */
                  case 'minute':
                      this.seconds(0);
                      /* falls through */
                  case 'second':
                      this.milliseconds(0);
                      /* falls through */
                  }
      
                  // weeks are a special case
                  if (units === 'week') {
                      this.weekday(0);
                  } else if (units === 'isoWeek') {
                      this.isoWeekday(1);
                  }
      
                  // quarters are also special
                  if (units === 'quarter') {
                      this.month(Math.floor(this.month() / 3) * 3);
                  }
      
                  return this;
              },
      
              endOf: function (units) {
                  units = normalizeUnits(units);
                  return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
              },
      
              isAfter: function (input, units) {
                  units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
                  if (units === 'millisecond') {
                      input = moment.isMoment(input) ? input : moment(input);
                      return +this > +input;
                  } else {
                      return +this.clone().startOf(units) > +moment(input).startOf(units);
                  }
              },
      
              isBefore: function (input, units) {
                  units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
                  if (units === 'millisecond') {
                      input = moment.isMoment(input) ? input : moment(input);
                      return +this < +input;
                  } else {
                      return +this.clone().startOf(units) < +moment(input).startOf(units);
                  }
              },
      
              isSame: function (input, units) {
                  units = normalizeUnits(units || 'millisecond');
                  if (units === 'millisecond') {
                      input = moment.isMoment(input) ? input : moment(input);
                      return +this === +input;
                  } else {
                      return +this.clone().startOf(units) === +makeAs(input, this).startOf(units);
                  }
              },
      
              min: deprecate(
                       'moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
                       function (other) {
                           other = moment.apply(null, arguments);
                           return other < this ? this : other;
                       }
               ),
      
              max: deprecate(
                      'moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
                      function (other) {
                          other = moment.apply(null, arguments);
                          return other > this ? this : other;
                      }
              ),
      
              // keepLocalTime = true means only change the timezone, without
              // affecting the local hour. So 5:31:26 +0300 --[zone(2, true)]-->
              // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist int zone
              // +0200, so we adjust the time as needed, to be valid.
              //
              // Keeping the time actually adds/subtracts (one hour)
              // from the actual represented time. That is why we call updateOffset
              // a second time. In case it wants us to change the offset again
              // _changeInProgress == true case, then we have to adjust, because
              // there is no such time in the given timezone.
              zone : function (input, keepLocalTime) {
                  var offset = this._offset || 0,
                      localAdjust;
                  if (input != null) {
                      if (typeof input === 'string') {
                          input = timezoneMinutesFromString(input);
                      }
                      if (Math.abs(input) < 16) {
                          input = input * 60;
                      }
                      if (!this._isUTC && keepLocalTime) {
                          localAdjust = this._dateTzOffset();
                      }
                      this._offset = input;
                      this._isUTC = true;
                      if (localAdjust != null) {
                          this.subtract(localAdjust, 'm');
                      }
                      if (offset !== input) {
                          if (!keepLocalTime || this._changeInProgress) {
                              addOrSubtractDurationFromMoment(this,
                                      moment.duration(offset - input, 'm'), 1, false);
                          } else if (!this._changeInProgress) {
                              this._changeInProgress = true;
                              moment.updateOffset(this, true);
                              this._changeInProgress = null;
                          }
                      }
                  } else {
                      return this._isUTC ? offset : this._dateTzOffset();
                  }
                  return this;
              },
      
              zoneAbbr : function () {
                  return this._isUTC ? 'UTC' : '';
              },
      
              zoneName : function () {
                  return this._isUTC ? 'Coordinated Universal Time' : '';
              },
      
              parseZone : function () {
                  if (this._tzm) {
                      this.zone(this._tzm);
                  } else if (typeof this._i === 'string') {
                      this.zone(this._i);
                  }
                  return this;
              },
      
              hasAlignedHourOffset : function (input) {
                  if (!input) {
                      input = 0;
                  }
                  else {
                      input = moment(input).zone();
                  }
      
                  return (this.zone() - input) % 60 === 0;
              },
      
              daysInMonth : function () {
                  return daysInMonth(this.year(), this.month());
              },
      
              dayOfYear : function (input) {
                  var dayOfYear = round((moment(this).startOf('day') - moment(this).startOf('year')) / 864e5) + 1;
                  return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
              },
      
              quarter : function (input) {
                  return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
              },
      
              weekYear : function (input) {
                  var year = weekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
                  return input == null ? year : this.add((input - year), 'y');
              },
      
              isoWeekYear : function (input) {
                  var year = weekOfYear(this, 1, 4).year;
                  return input == null ? year : this.add((input - year), 'y');
              },
      
              week : function (input) {
                  var week = this.localeData().week(this);
                  return input == null ? week : this.add((input - week) * 7, 'd');
              },
      
              isoWeek : function (input) {
                  var week = weekOfYear(this, 1, 4).week;
                  return input == null ? week : this.add((input - week) * 7, 'd');
              },
      
              weekday : function (input) {
                  var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
                  return input == null ? weekday : this.add(input - weekday, 'd');
              },
      
              isoWeekday : function (input) {
                  // behaves the same as moment#day except
                  // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
                  // as a setter, sunday should belong to the previous week.
                  return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
              },
      
              isoWeeksInYear : function () {
                  return weeksInYear(this.year(), 1, 4);
              },
      
              weeksInYear : function () {
                  var weekInfo = this.localeData()._week;
                  return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
              },
      
              get : function (units) {
                  units = normalizeUnits(units);
                  return this[units]();
              },
      
              set : function (units, value) {
                  units = normalizeUnits(units);
                  if (typeof this[units] === 'function') {
                      this[units](value);
                  }
                  return this;
              },
      
              // If passed a locale key, it will set the locale for this
              // instance.  Otherwise, it will return the locale configuration
              // variables for this instance.
              locale : function (key) {
                  var newLocaleData;
      
                  if (key === undefined) {
                      return this._locale._abbr;
                  } else {
                      newLocaleData = moment.localeData(key);
                      if (newLocaleData != null) {
                          this._locale = newLocaleData;
                      }
                      return this;
                  }
              },
      
              lang : deprecate(
                  'moment().lang() is deprecated. Use moment().localeData() instead.',
                  function (key) {
                      if (key === undefined) {
                          return this.localeData();
                      } else {
                          return this.locale(key);
                      }
                  }
              ),
      
              localeData : function () {
                  return this._locale;
              },
      
              _dateTzOffset : function () {
                  // On Firefox.24 Date#getTimezoneOffset returns a floating point.
                  // https://github.com/moment/moment/pull/1871
                  return Math.round(this._d.getTimezoneOffset() / 15) * 15;
              }
          });
      
          function rawMonthSetter(mom, value) {
              var dayOfMonth;
      
              // TODO: Move this out of here!
              if (typeof value === 'string') {
                  value = mom.localeData().monthsParse(value);
                  // TODO: Another silent failure?
                  if (typeof value !== 'number') {
                      return mom;
                  }
              }
      
              dayOfMonth = Math.min(mom.date(),
                      daysInMonth(mom.year(), value));
              mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
              return mom;
          }
      
          function rawGetter(mom, unit) {
              return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
          }
      
          function rawSetter(mom, unit, value) {
              if (unit === 'Month') {
                  return rawMonthSetter(mom, value);
              } else {
                  return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
              }
          }
      
          function makeAccessor(unit, keepTime) {
              return function (value) {
                  if (value != null) {
                      rawSetter(this, unit, value);
                      moment.updateOffset(this, keepTime);
                      return this;
                  } else {
                      return rawGetter(this, unit);
                  }
              };
          }
      
          moment.fn.millisecond = moment.fn.milliseconds = makeAccessor('Milliseconds', false);
          moment.fn.second = moment.fn.seconds = makeAccessor('Seconds', false);
          moment.fn.minute = moment.fn.minutes = makeAccessor('Minutes', false);
          // Setting the hour should keep the time, because the user explicitly
          // specified which hour he wants. So trying to maintain the same hour (in
          // a new timezone) makes sense. Adding/subtracting hours does not follow
          // this rule.
          moment.fn.hour = moment.fn.hours = makeAccessor('Hours', true);
          // moment.fn.month is defined separately
          moment.fn.date = makeAccessor('Date', true);
          moment.fn.dates = deprecate('dates accessor is deprecated. Use date instead.', makeAccessor('Date', true));
          moment.fn.year = makeAccessor('FullYear', true);
          moment.fn.years = deprecate('years accessor is deprecated. Use year instead.', makeAccessor('FullYear', true));
      
          // add plural methods
          moment.fn.days = moment.fn.day;
          moment.fn.months = moment.fn.month;
          moment.fn.weeks = moment.fn.week;
          moment.fn.isoWeeks = moment.fn.isoWeek;
          moment.fn.quarters = moment.fn.quarter;
      
          // add aliased format methods
          moment.fn.toJSON = moment.fn.toISOString;
      
          /************************************
              Duration Prototype
          ************************************/
      
      
          function daysToYears (days) {
              // 400 years have 146097 days (taking into account leap year rules)
              return days * 400 / 146097;
          }
      
          function yearsToDays (years) {
              // years * 365 + absRound(years / 4) -
              //     absRound(years / 100) + absRound(years / 400);
              return years * 146097 / 400;
          }
      
          extend(moment.duration.fn = Duration.prototype, {
      
              _bubble : function () {
                  var milliseconds = this._milliseconds,
                      days = this._days,
                      months = this._months,
                      data = this._data,
                      seconds, minutes, hours, years = 0;
      
                  // The following code bubbles up values, see the tests for
                  // examples of what that means.
                  data.milliseconds = milliseconds % 1000;
      
                  seconds = absRound(milliseconds / 1000);
                  data.seconds = seconds % 60;
      
                  minutes = absRound(seconds / 60);
                  data.minutes = minutes % 60;
      
                  hours = absRound(minutes / 60);
                  data.hours = hours % 24;
      
                  days += absRound(hours / 24);
      
                  // Accurately convert days to years, assume start from year 0.
                  years = absRound(daysToYears(days));
                  days -= absRound(yearsToDays(years));
      
                  // 30 days to a month
                  // TODO (iskren): Use anchor date (like 1st Jan) to compute this.
                  months += absRound(days / 30);
                  days %= 30;
      
                  // 12 months -> 1 year
                  years += absRound(months / 12);
                  months %= 12;
      
                  data.days = days;
                  data.months = months;
                  data.years = years;
              },
      
              abs : function () {
                  this._milliseconds = Math.abs(this._milliseconds);
                  this._days = Math.abs(this._days);
                  this._months = Math.abs(this._months);
      
                  this._data.milliseconds = Math.abs(this._data.milliseconds);
                  this._data.seconds = Math.abs(this._data.seconds);
                  this._data.minutes = Math.abs(this._data.minutes);
                  this._data.hours = Math.abs(this._data.hours);
                  this._data.months = Math.abs(this._data.months);
                  this._data.years = Math.abs(this._data.years);
      
                  return this;
              },
      
              weeks : function () {
                  return absRound(this.days() / 7);
              },
      
              valueOf : function () {
                  return this._milliseconds +
                    this._days * 864e5 +
                    (this._months % 12) * 2592e6 +
                    toInt(this._months / 12) * 31536e6;
              },
      
              humanize : function (withSuffix) {
                  var output = relativeTime(this, !withSuffix, this.localeData());
      
                  if (withSuffix) {
                      output = this.localeData().pastFuture(+this, output);
                  }
      
                  return this.localeData().postformat(output);
              },
      
              add : function (input, val) {
                  // supports only 2.0-style add(1, 's') or add(moment)
                  var dur = moment.duration(input, val);
      
                  this._milliseconds += dur._milliseconds;
                  this._days += dur._days;
                  this._months += dur._months;
      
                  this._bubble();
      
                  return this;
              },
      
              subtract : function (input, val) {
                  var dur = moment.duration(input, val);
      
                  this._milliseconds -= dur._milliseconds;
                  this._days -= dur._days;
                  this._months -= dur._months;
      
                  this._bubble();
      
                  return this;
              },
      
              get : function (units) {
                  units = normalizeUnits(units);
                  return this[units.toLowerCase() + 's']();
              },
      
              as : function (units) {
                  var days, months;
                  units = normalizeUnits(units);
      
                  if (units === 'month' || units === 'year') {
                      days = this._days + this._milliseconds / 864e5;
                      months = this._months + daysToYears(days) * 12;
                      return units === 'month' ? months : months / 12;
                  } else {
                      // handle milliseconds separately because of floating point math errors (issue #1867)
                      days = this._days + yearsToDays(this._months / 12);
                      switch (units) {
                          case 'week': return days / 7 + this._milliseconds / 6048e5;
                          case 'day': return days + this._milliseconds / 864e5;
                          case 'hour': return days * 24 + this._milliseconds / 36e5;
                          case 'minute': return days * 24 * 60 + this._milliseconds / 6e4;
                          case 'second': return days * 24 * 60 * 60 + this._milliseconds / 1000;
                          // Math.floor prevents floating point math errors here
                          case 'millisecond': return Math.floor(days * 24 * 60 * 60 * 1000) + this._milliseconds;
                          default: throw new Error('Unknown unit ' + units);
                      }
                  }
              },
      
              lang : moment.fn.lang,
              locale : moment.fn.locale,
      
              toIsoString : deprecate(
                  'toIsoString() is deprecated. Please use toISOString() instead ' +
                  '(notice the capitals)',
                  function () {
                      return this.toISOString();
                  }
              ),
      
              toISOString : function () {
                  // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
                  var years = Math.abs(this.years()),
                      months = Math.abs(this.months()),
                      days = Math.abs(this.days()),
                      hours = Math.abs(this.hours()),
                      minutes = Math.abs(this.minutes()),
                      seconds = Math.abs(this.seconds() + this.milliseconds() / 1000);
      
                  if (!this.asSeconds()) {
                      // this is the same as C#'s (Noda) and python (isodate)...
                      // but not other JS (goog.date)
                      return 'P0D';
                  }
      
                  return (this.asSeconds() < 0 ? '-' : '') +
                      'P' +
                      (years ? years + 'Y' : '') +
                      (months ? months + 'M' : '') +
                      (days ? days + 'D' : '') +
                      ((hours || minutes || seconds) ? 'T' : '') +
                      (hours ? hours + 'H' : '') +
                      (minutes ? minutes + 'M' : '') +
                      (seconds ? seconds + 'S' : '');
              },
      
              localeData : function () {
                  return this._locale;
              }
          });
      
          moment.duration.fn.toString = moment.duration.fn.toISOString;
      
          function makeDurationGetter(name) {
              moment.duration.fn[name] = function () {
                  return this._data[name];
              };
          }
      
          for (i in unitMillisecondFactors) {
              if (hasOwnProp(unitMillisecondFactors, i)) {
                  makeDurationGetter(i.toLowerCase());
              }
          }
      
          moment.duration.fn.asMilliseconds = function () {
              return this.as('ms');
          };
          moment.duration.fn.asSeconds = function () {
              return this.as('s');
          };
          moment.duration.fn.asMinutes = function () {
              return this.as('m');
          };
          moment.duration.fn.asHours = function () {
              return this.as('h');
          };
          moment.duration.fn.asDays = function () {
              return this.as('d');
          };
          moment.duration.fn.asWeeks = function () {
              return this.as('weeks');
          };
          moment.duration.fn.asMonths = function () {
              return this.as('M');
          };
          moment.duration.fn.asYears = function () {
              return this.as('y');
          };
      
          /************************************
              Default Locale
          ************************************/
      
      
          // Set default locale, other locale will inherit from English.
          moment.locale('en', {
              ordinal : function (number) {
                  var b = number % 10,
                      output = (toInt(number % 100 / 10) === 1) ? 'th' :
                      (b === 1) ? 'st' :
                      (b === 2) ? 'nd' :
                      (b === 3) ? 'rd' : 'th';
                  return number + output;
              }
          });
      
          /* EMBED_LOCALES */
      
          /************************************
              Exposing Moment
          ************************************/
      
          function makeGlobal(shouldDeprecate) {
              /*global ender:false */
              if (typeof ender !== 'undefined') {
                  return;
              }
              oldGlobalMoment = globalScope.moment;
              if (shouldDeprecate) {
                  globalScope.moment = deprecate(
                          'Accessing Moment through the global scope is ' +
                          'deprecated, and will be removed in an upcoming ' +
                          'release.',
                          moment);
              } else {
                  globalScope.moment = moment;
              }
          }
      
          // CommonJS module is defined
          if (hasModule) {
              module.exports = moment;
          } else if (typeof define === 'function' && define.amd) {
              define('moment', function (require, exports, module) {
                  if (module.config && module.config() && module.config().noGlobal === true) {
                      // release the global variable
                      globalScope.moment = oldGlobalMoment;
                  }
      
                  return moment;
              });
              makeGlobal(true);
          } else {
              makeGlobal();
          }
      }).call(this);
      
    },
    'ender': function (module, exports, require, global) {
      $.ender({ moment: require('moment') })
      
    }
  }, 'moment');

  Module.createPackage('kizzy', {
    'kizzy': function (module, exports, require, global) {
      /*!
        * Kizzy - a cross-browser LocalStorage API
        * Copyright: Dustin Diaz 2012
        * https://github.com/ded/kizzy
        * License: MIT
        */
      !function (name, definition) {
        if (typeof module != 'undefined') module.exports = definition()
        else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
        else this[name] = definition()
      }('kizzy', function () {
      
        function noop() {}
        var hasLocalStorage
          , doc = document
          , store = doc.domain
          , html5 = 0
          , writeThrough = function () {
              return 1
            }
      
      
        try {
          // HTML5 local storage
          hasLocalStorage = !!localStorage || !!globalStorage
          if (!localStorage) {
            localStorage = globalStorage[store]
          }
          html5 = 1
        } catch (ex1) {
          html5 = 0
          // IE local storage
          try {
            // this try / if is required. trust me
            if (doc.documentElement.addBehavior) {
              html5 = 0
              hasLocalStorage = 1
              var dataStore = doc.documentElement
              dataStore.addBehavior('#default#userData')
              dataStore.load(store)
              var xmlDoc = dataStore.xmlDocument
                , xmlDocEl = xmlDoc.documentElement
            }
          } catch (ex2) {
            hasLocalStorage = false
          }
        }
      
        var setLocalStorage = noop
          , getLocalStorage = noop
          , removeLocalStorage = noop
          , clearLocalStorage = noop
      
        if (hasLocalStorage) {
          setLocalStorage = html5 ? html5setLocalStorage : setUserData
          getLocalStorage = html5 ? html5getLocalStorage : getUserData
          removeLocalStorage = html5 ? html5removeLocalStorage : removeUserData
          clearLocalStorage = html5 ? html5clearLocalStorage : clearUserData
      
          writeThrough = function (inst) {
            try {
              var v = JSON.stringify(inst._)
              if( v == '{}' ) {
                removeLocalStorage(inst.ns)
              } else {
                setLocalStorage(inst.ns, v)
              }
              return 1
            } catch (x) {
              return 0
            }
          }
        }
      
      
        function time() {
          return +new Date()
        }
      
        function checkExpiry(inst, k) {
          if (inst._[k] && inst._[k].e && inst._[k].e < time()) {
            inst.remove(k)
          }
        }
      
        function isNumber(n) {
          return typeof n === 'number' && isFinite(n)
        }
      
        function html5getLocalStorage(k) {
          return localStorage[k]
        }
      
        function html5setLocalStorage(k, v) {
          localStorage[k] = v
          return v
        }
      
        function html5removeLocalStorage(k) {
          delete localStorage[k]
        }
      
        function html5clearLocalStorage() {
          localStorage.clear()
        }
      
        function getNodeByName(name) {
          var childNodes = xmlDocEl.childNodes
            , node
            , returnVal = null
      
          for (var i = 0, len = childNodes.length; i < len; i++) {
            node = childNodes.item(i)
            if (node.getAttribute("key") == name) {
              returnVal = node
              break
            }
          }
          return returnVal
        }
      
        function getUserData(name) {
          var node = getNodeByName(name)
          var returnVal = null
          if (node) {
            returnVal = node.getAttribute("value")
          }
          return returnVal
        }
      
        function setUserData(name, value) {
          var node = getNodeByName(name)
          if (!node) {
            node = xmlDoc.createNode(1, "item", "")
            node.setAttribute("key", name)
            node.setAttribute("value", value)
            xmlDocEl.appendChild(node)
          }
          else {
            node.setAttribute("value", value)
          }
          dataStore.save(store)
          return value
        }
      
        function removeUserData(name) {
          getNodeByName(name) && xmlDocEl.removeChild(node)
          dataStore.save(store)
        }
      
        function clearUserData() {
          while (xmlDocEl.firstChild) {
            xmlDocEl.removeChild(xmlDocEl.firstChild)
          }
          dataStore.save(store)
        }
      
        function _Kizzy() {
          this._ = {}
        }
      
        _Kizzy.prototype = {
      
          set: function (k, v, optTtl) {
            this._[k] = {
              value: v,
              e: isNumber(optTtl) ? time() + optTtl : 0
            }
            writeThrough(this) || this.remove(k)
            return v
          },
      
          get: function (k) {
            checkExpiry(this, k)
            return this._[k] ? this._[k].value : undefined
          },
      
          remove: function (k) {
            delete this._[k];
            writeThrough(this)
          },
      
          clear: function () {
            this._ = {}
            writeThrough(this)
          },
      
          clearExpireds: function() {
            for (var k in this._) {
              checkExpiry(this, k)
            }
            writeThrough(this)
          }
        }
      
        function Kizzy(ns) {
          this.ns = ns
          this._ = JSON.parse(getLocalStorage(ns) || '{}')
        }
      
        Kizzy.prototype = _Kizzy.prototype
      
        function kizzy(ns) {
          return new Kizzy(ns)
        }
      
        kizzy.remove = removeLocalStorage
        kizzy.clear = clearLocalStorage
      
        return kizzy
      })
      
    },
    'src/ender': function (module, exports, require, global) {
      !function ($) {
          var kizzy = require('kizzy');
          $.ender({cache: kizzy});
      }(ender);
    }
  }, 'kizzy');

  Module.createPackage('pnglib', {
    'lib/pnglib': function (module, exports, require, global) {
      /**      
       * A handy class to calculate color values.      
       *      
       * @version 1.0      
       * @author Robert Eisele <robert@xarg.org>      
       * @copyright Copyright (c) 2010, Robert Eisele      
       * @link http://www.xarg.org/2010/03/generate-client-side-png-files-using-javascript/      
       * @license http://www.opensource.org/licenses/bsd-license.php BSD License      
       *      
       */      
            
      // Modified by George Chan <gchan@21cn.com>      
            
      module.exports = function(width,height,depth) {      
            
            
          // helper functions for that ctx      
          function write(buffer, offs) {      
              for (var i = 2; i < arguments.length; i++) {      
                  for (var j = 0; j < arguments[i].length; j++) {      
                      buffer[offs++] = arguments[i].charAt(j);      
                  }      
              }      
          }      
            
          function byte2(w) {      
              return String.fromCharCode((w >> 8) & 255, w & 255);      
          }      
            
          function byte4(w) {      
              return String.fromCharCode((w >> 24) & 255, (w >> 16) & 255, (w >> 8) & 255, w & 255);      
          }      
            
          function byte2lsb(w) {      
              return String.fromCharCode(w & 255, (w >> 8) & 255);      
          }      
            
          this.width   = width;      
          this.height  = height;      
          this.depth   = depth;      
            
          // pixel data and row filter identifier size      
          this.pix_size = height * (width + 1);      
            
          // deflate header, pix_size, block headers, adler32 checksum      
          this.data_size = 2 + this.pix_size + 5 * Math.floor((0xfffe + this.pix_size) / 0xffff) + 4;      
            
          // offsets and sizes of Png chunks      
          this.ihdr_offs = 0;									// IHDR offset and size      
          this.ihdr_size = 4 + 4 + 13 + 4;      
          this.plte_offs = this.ihdr_offs + this.ihdr_size;	// PLTE offset and size      
          this.plte_size = 4 + 4 + 3 * depth + 4;      
          this.trns_offs = this.plte_offs + this.plte_size;	// tRNS offset and size      
          this.trns_size = 4 + 4 + depth + 4;      
          this.idat_offs = this.trns_offs + this.trns_size;	// IDAT offset and size      
          this.idat_size = 4 + 4 + this.data_size + 4;      
          this.iend_offs = this.idat_offs + this.idat_size;	// IEND offset and size      
          this.iend_size = 4 + 4 + 4;      
          this.buffer_size  = this.iend_offs + this.iend_size;	// total PNG size      
            
          this.buffer  = new Array();      
          this.palette = new Object();      
          this.pindex  = 0;      
            
          var _crc32 = new Array();      
            
          // initialize buffer with zero bytes      
          for (var i = 0; i < this.buffer_size; i++) {      
              this.buffer[i] = "\x00";      
          }      
            
          // initialize non-zero elements      
          write(this.buffer, this.ihdr_offs, byte4(this.ihdr_size - 12), 'IHDR', byte4(width), byte4(height), "\x08\x03");      
          write(this.buffer, this.plte_offs, byte4(this.plte_size - 12), 'PLTE');      
          write(this.buffer, this.trns_offs, byte4(this.trns_size - 12), 'tRNS');      
          write(this.buffer, this.idat_offs, byte4(this.idat_size - 12), 'IDAT');      
          write(this.buffer, this.iend_offs, byte4(this.iend_size - 12), 'IEND');      
            
          // initialize deflate header      
          var header = ((8 + (7 << 4)) << 8) | (3 << 6);      
          header+= 31 - (header % 31);      
            
          write(this.buffer, this.idat_offs + 8, byte2(header));      
            
          // initialize deflate block headers      
          for (var i = 0; (i << 16) - 1 < this.pix_size; i++) {      
              var size, bits;      
              if (i + 0xffff < this.pix_size) {      
                  size = 0xffff;      
                  bits = "\x00";      
              } else {      
                  size = this.pix_size - (i << 16) - i;      
                  bits = "\x01";      
              }      
              write(this.buffer, this.idat_offs + 8 + 2 + (i << 16) + (i << 2), bits, byte2lsb(size), byte2lsb(~size));      
          }      
            
          /* Create crc32 lookup table */      
          for (var i = 0; i < 256; i++) {      
              var c = i;      
              for (var j = 0; j < 8; j++) {      
                  if (c & 1) {      
                      c = -306674912 ^ ((c >> 1) & 0x7fffffff);      
                  } else {      
                      c = (c >> 1) & 0x7fffffff;      
                  }      
              }      
              _crc32[i] = c;      
          }      
            
          // compute the index into a png for a given pixel      
          this.index = function(x,y) {      
              var i = y * (this.width + 1) + x + 1;      
              var j = this.idat_offs + 8 + 2 + 5 * Math.floor((i / 0xffff) + 1) + i;      
              return j;      
          }      
            
          // convert a color and build up the palette      
          this.color = function(red, green, blue, alpha) {      
            
              alpha = alpha >= 0 ? alpha : 255;      
              var color = (((((alpha << 8) | red) << 8) | green) << 8) | blue;      
            
              if (typeof this.palette[color] == "undefined") {      
                  if (this.pindex == this.depth) return "\x00";      
            
                  var ndx = this.plte_offs + 8 + 3 * this.pindex;      
            
                  this.buffer[ndx + 0] = String.fromCharCode(red);      
                  this.buffer[ndx + 1] = String.fromCharCode(green);      
                  this.buffer[ndx + 2] = String.fromCharCode(blue);      
                  this.buffer[this.trns_offs+8+this.pindex] = String.fromCharCode(alpha);      
            
                  this.palette[color] = String.fromCharCode(this.pindex++);      
              }      
              return this.palette[color];      
          }      
            
          // output a PNG string, Base64 encoded      
          this.getBase64 = function() {      
            
              var s = this.getDump();      
            
              var ch = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";      
              var c1, c2, c3, e1, e2, e3, e4;      
              var l = s.length;      
              var i = 0;      
              var r = "";      
            
              do {      
                  c1 = s.charCodeAt(i);      
                  e1 = c1 >> 2;      
                  c2 = s.charCodeAt(i+1);      
                  e2 = ((c1 & 3) << 4) | (c2 >> 4);      
                  c3 = s.charCodeAt(i+2);      
                  if (l < i+2) { e3 = 64; } else { e3 = ((c2 & 0xf) << 2) | (c3 >> 6); }      
                  if (l < i+3) { e4 = 64; } else { e4 = c3 & 0x3f; }      
                  r+= ch.charAt(e1) + ch.charAt(e2) + ch.charAt(e3) + ch.charAt(e4);      
              } while ((i+= 3) < l);      
              return r;      
          }      
            
          // output a PNG string      
          this.getDump = function() {      
            
              // compute adler32 of output pixels + row filter bytes      
              var BASE = 65521; /* largest prime smaller than 65536 */      
              var NMAX = 5552;  /* NMAX is the largest n such that 255n(n+1)/2 + (n+1)(BASE-1) <= 2^32-1 */      
              var s1 = 1;      
              var s2 = 0;      
              var n = NMAX;      
            
              for (var y = 0; y < this.height; y++) {      
                  for (var x = -1; x < this.width; x++) {      
                      s1+= this.buffer[this.index(x, y)].charCodeAt(0);      
                      s2+= s1;      
                      if ((n-= 1) == 0) {      
                          s1%= BASE;      
                          s2%= BASE;      
                          n = NMAX;      
                      }      
                  }      
              }      
              s1%= BASE;      
              s2%= BASE;      
              write(this.buffer, this.idat_offs + this.idat_size - 8, byte4((s2 << 16) | s1));      
            
              // compute crc32 of the PNG chunks      
              function crc32(png, offs, size) {      
                  var crc = -1;      
                  for (var i = 4; i < size-4; i += 1) {      
                      crc = _crc32[(crc ^ png[offs+i].charCodeAt(0)) & 0xff] ^ ((crc >> 8) & 0x00ffffff);      
                  }      
                  write(png, offs+size-4, byte4(crc ^ -1));      
              }      
            
              crc32(this.buffer, this.ihdr_offs, this.ihdr_size);      
              crc32(this.buffer, this.plte_offs, this.plte_size);      
              crc32(this.buffer, this.trns_offs, this.trns_size);      
              crc32(this.buffer, this.idat_offs, this.idat_size);      
              crc32(this.buffer, this.iend_offs, this.iend_size);      
            
              // convert PNG to string      
              return "\211PNG\r\n\032\n"+this.buffer.join('');      
          }      
      };      
            
      
    }
  }, 'lib/pnglib');

  Module.createPackage('onecolor', {
    'one-color-all-debug': function (module, exports, require, global) {
      /*jshint evil:true, onevar:false*/
      /*global define*/
      var installedColorSpaces = [],
          namedColors = {},
          undef = function (obj) {
              return typeof obj === 'undefined';
          },
          channelRegExp = /\s*(\.\d+|\d+(?:\.\d+)?)(%)?\s*/,
          alphaChannelRegExp = /\s*(\.\d+|\d+(?:\.\d+)?)\s*/,
          cssColorRegExp = new RegExp(
                               "^(rgb|hsl|hsv)a?" +
                               "\\(" +
                                   channelRegExp.source + "," +
                                   channelRegExp.source + "," +
                                   channelRegExp.source +
                                   "(?:," + alphaChannelRegExp.source + ")?" +
                               "\\)$", "i");
      
      function ONECOLOR(obj) {
          if (Object.prototype.toString.apply(obj) === '[object Array]') {
              if (typeof obj[0] === 'string' && typeof ONECOLOR[obj[0]] === 'function') {
                  // Assumed array from .toJSON()
                  return new ONECOLOR[obj[0]](obj.slice(1, obj.length));
              } else if (obj.length === 4) {
                  // Assumed 4 element int RGB array from canvas with all channels [0;255]
                  return new ONECOLOR.RGB(obj[0] / 255, obj[1] / 255, obj[2] / 255, obj[3] / 255);
              }
          } else if (typeof obj === 'string') {
              var lowerCased = obj.toLowerCase();
              if (namedColors[lowerCased]) {
                  obj = '#' + namedColors[lowerCased];
              }
              if (lowerCased === 'transparent') {
                  obj = 'rgba(0,0,0,0)';
              }
              // Test for CSS rgb(....) string
              var matchCssSyntax = obj.match(cssColorRegExp);
              if (matchCssSyntax) {
                  var colorSpaceName = matchCssSyntax[1].toUpperCase(),
                      alpha = undef(matchCssSyntax[8]) ? matchCssSyntax[8] : parseFloat(matchCssSyntax[8]),
                      hasHue = colorSpaceName[0] === 'H',
                      firstChannelDivisor = matchCssSyntax[3] ? 100 : (hasHue ? 360 : 255),
                      secondChannelDivisor = (matchCssSyntax[5] || hasHue) ? 100 : 255,
                      thirdChannelDivisor = (matchCssSyntax[7] || hasHue) ? 100 : 255;
                  if (undef(ONECOLOR[colorSpaceName])) {
                      throw new Error("one.color." + colorSpaceName + " is not installed.");
                  }
                  return new ONECOLOR[colorSpaceName](
                      parseFloat(matchCssSyntax[2]) / firstChannelDivisor,
                      parseFloat(matchCssSyntax[4]) / secondChannelDivisor,
                      parseFloat(matchCssSyntax[6]) / thirdChannelDivisor,
                      alpha
                  );
              }
              // Assume hex syntax
              if (obj.length < 6) {
                  // Allow CSS shorthand
                  obj = obj.replace(/^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i, '$1$1$2$2$3$3');
              }
              // Split obj into red, green, and blue components
              var hexMatch = obj.match(/^#?([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])$/i);
              if (hexMatch) {
                  return new ONECOLOR.RGB(
                      parseInt(hexMatch[1], 16) / 255,
                      parseInt(hexMatch[2], 16) / 255,
                      parseInt(hexMatch[3], 16) / 255
                  );
              }
          } else if (typeof obj === 'object' && obj.isColor) {
              return obj;
          }
          return false;
      }
      
      function installColorSpace(colorSpaceName, propertyNames, config) {
          ONECOLOR[colorSpaceName] = new Function(propertyNames.join(","),
              // Allow passing an array to the constructor:
              "if (Object.prototype.toString.apply(" + propertyNames[0] + ") === '[object Array]') {" +
                  propertyNames.map(function (propertyName, i) {
                      return propertyName + "=" + propertyNames[0] + "[" + i + "];";
                  }).reverse().join("") +
              "}" +
              "if (" + propertyNames.filter(function (propertyName) {
                  return propertyName !== 'alpha';
              }).map(function (propertyName) {
                  return "isNaN(" + propertyName + ")";
              }).join("||") + "){" + "throw new Error(\"[" + colorSpaceName + "]: Invalid color: (\"+" + propertyNames.join("+\",\"+") + "+\")\");}" +
              propertyNames.map(function (propertyName) {
                  if (propertyName === 'hue') {
                      return "this._hue=hue<0?hue-Math.floor(hue):hue%1"; // Wrap
                  } else if (propertyName === 'alpha') {
                      return "this._alpha=(isNaN(alpha)||alpha>1)?1:(alpha<0?0:alpha);";
                  } else {
                      return "this._" + propertyName + "=" + propertyName + "<0?0:(" + propertyName + ">1?1:" + propertyName + ")";
                  }
              }).join(";") + ";"
          );
          ONECOLOR[colorSpaceName].propertyNames = propertyNames;
      
          var prototype = ONECOLOR[colorSpaceName].prototype;
      
          ['valueOf', 'hex', 'hexa', 'css', 'cssa'].forEach(function (methodName) {
              prototype[methodName] = prototype[methodName] || (colorSpaceName === 'RGB' ? prototype.hex : new Function("return this.rgb()." + methodName + "();"));
          });
      
          prototype.isColor = true;
      
          prototype.equals = function (otherColor, epsilon) {
              if (undef(epsilon)) {
                  epsilon = 1e-10;
              }
      
              otherColor = otherColor[colorSpaceName.toLowerCase()]();
      
              for (var i = 0; i < propertyNames.length; i = i + 1) {
                  if (Math.abs(this['_' + propertyNames[i]] - otherColor['_' + propertyNames[i]]) > epsilon) {
                      return false;
                  }
              }
      
              return true;
          };
      
          prototype.toJSON = new Function(
              "return ['" + colorSpaceName + "', " +
                  propertyNames.map(function (propertyName) {
                      return "this._" + propertyName;
                  }, this).join(", ") +
              "];"
          );
      
          for (var propertyName in config) {
              if (config.hasOwnProperty(propertyName)) {
                  var matchFromColorSpace = propertyName.match(/^from(.*)$/);
                  if (matchFromColorSpace) {
                      ONECOLOR[matchFromColorSpace[1].toUpperCase()].prototype[colorSpaceName.toLowerCase()] = config[propertyName];
                  } else {
                      prototype[propertyName] = config[propertyName];
                  }
              }
          }
      
          // It is pretty easy to implement the conversion to the same color space:
          prototype[colorSpaceName.toLowerCase()] = function () {
              return this;
          };
          prototype.toString = new Function("return \"[one.color." + colorSpaceName + ":\"+" + propertyNames.map(function (propertyName, i) {
              return "\" " + propertyNames[i] + "=\"+this._" + propertyName;
          }).join("+") + "+\"]\";");
      
          // Generate getters and setters
          propertyNames.forEach(function (propertyName, i) {
              prototype[propertyName] = prototype[propertyName === 'black' ? 'k' : propertyName[0]] = new Function("value", "isDelta",
                  // Simple getter mode: color.red()
                  "if (typeof value === 'undefined') {" +
                      "return this._" + propertyName + ";" +
                  "}" +
                  // Adjuster: color.red(+.2, true)
                  "if (isDelta) {" +
                      "return new this.constructor(" + propertyNames.map(function (otherPropertyName, i) {
                          return "this._" + otherPropertyName + (propertyName === otherPropertyName ? "+value" : "");
                      }).join(", ") + ");" +
                  "}" +
                  // Setter: color.red(.2);
                  "return new this.constructor(" + propertyNames.map(function (otherPropertyName, i) {
                      return propertyName === otherPropertyName ? "value" : "this._" + otherPropertyName;
                  }).join(", ") + ");");
          });
      
          function installForeignMethods(targetColorSpaceName, sourceColorSpaceName) {
              var obj = {};
              obj[sourceColorSpaceName.toLowerCase()] = new Function("return this.rgb()." + sourceColorSpaceName.toLowerCase() + "();"); // Fallback
              ONECOLOR[sourceColorSpaceName].propertyNames.forEach(function (propertyName, i) {
                  obj[propertyName] = obj[propertyName === 'black' ? 'k' : propertyName[0]] = new Function("value", "isDelta", "return this." + sourceColorSpaceName.toLowerCase() + "()." + propertyName + "(value, isDelta);");
              });
              for (var prop in obj) {
                  if (obj.hasOwnProperty(prop) && ONECOLOR[targetColorSpaceName].prototype[prop] === undefined) {
                      ONECOLOR[targetColorSpaceName].prototype[prop] = obj[prop];
                  }
              }
          }
      
          installedColorSpaces.forEach(function (otherColorSpaceName) {
              installForeignMethods(colorSpaceName, otherColorSpaceName);
              installForeignMethods(otherColorSpaceName, colorSpaceName);
          });
      
          installedColorSpaces.push(colorSpaceName);
      }
      
      ONECOLOR.installMethod = function (name, fn) {
          installedColorSpaces.forEach(function (colorSpace) {
              ONECOLOR[colorSpace].prototype[name] = fn;
          });
      };
      
      installColorSpace('RGB', ['red', 'green', 'blue', 'alpha'], {
          hex: function () {
              var hexString = (Math.round(255 * this._red) * 0x10000 + Math.round(255 * this._green) * 0x100 + Math.round(255 * this._blue)).toString(16);
              return '#' + ('00000'.substr(0, 6 - hexString.length)) + hexString;
          },
      
          hexa: function () {
              var alphaString = Math.round(this._alpha * 255).toString(16);
              return '#' + '00'.substr(0, 2 - alphaString.length) + alphaString + this.hex().substr(1, 6);
          },
      
          css: function () {
              return "rgb(" + Math.round(255 * this._red) + "," + Math.round(255 * this._green) + "," + Math.round(255 * this._blue) + ")";
          },
      
          cssa: function () {
              return "rgba(" + Math.round(255 * this._red) + "," + Math.round(255 * this._green) + "," + Math.round(255 * this._blue) + "," + this._alpha + ")";
          }
      });
      if (typeof define === 'function' && !undef(define.amd)) {
          define(function () {
              return ONECOLOR;
          });
      } else if (typeof exports === 'object') {
          // Node module export
          module.exports = ONECOLOR;
      } else {
          one = window.one || {};
          one.color = ONECOLOR;
      }
      
      if (typeof jQuery !== 'undefined' && undef(jQuery.color)) {
          jQuery.color = ONECOLOR;
      }
      
      /*global namedColors*/
      namedColors = {
          aliceblue: 'f0f8ff',
          antiquewhite: 'faebd7',
          aqua: '0ff',
          aquamarine: '7fffd4',
          azure: 'f0ffff',
          beige: 'f5f5dc',
          bisque: 'ffe4c4',
          black: '000',
          blanchedalmond: 'ffebcd',
          blue: '00f',
          blueviolet: '8a2be2',
          brown: 'a52a2a',
          burlywood: 'deb887',
          cadetblue: '5f9ea0',
          chartreuse: '7fff00',
          chocolate: 'd2691e',
          coral: 'ff7f50',
          cornflowerblue: '6495ed',
          cornsilk: 'fff8dc',
          crimson: 'dc143c',
          cyan: '0ff',
          darkblue: '00008b',
          darkcyan: '008b8b',
          darkgoldenrod: 'b8860b',
          darkgray: 'a9a9a9',
          darkgrey: 'a9a9a9',
          darkgreen: '006400',
          darkkhaki: 'bdb76b',
          darkmagenta: '8b008b',
          darkolivegreen: '556b2f',
          darkorange: 'ff8c00',
          darkorchid: '9932cc',
          darkred: '8b0000',
          darksalmon: 'e9967a',
          darkseagreen: '8fbc8f',
          darkslateblue: '483d8b',
          darkslategray: '2f4f4f',
          darkslategrey: '2f4f4f',
          darkturquoise: '00ced1',
          darkviolet: '9400d3',
          deeppink: 'ff1493',
          deepskyblue: '00bfff',
          dimgray: '696969',
          dimgrey: '696969',
          dodgerblue: '1e90ff',
          firebrick: 'b22222',
          floralwhite: 'fffaf0',
          forestgreen: '228b22',
          fuchsia: 'f0f',
          gainsboro: 'dcdcdc',
          ghostwhite: 'f8f8ff',
          gold: 'ffd700',
          goldenrod: 'daa520',
          gray: '808080',
          grey: '808080',
          green: '008000',
          greenyellow: 'adff2f',
          honeydew: 'f0fff0',
          hotpink: 'ff69b4',
          indianred: 'cd5c5c',
          indigo: '4b0082',
          ivory: 'fffff0',
          khaki: 'f0e68c',
          lavender: 'e6e6fa',
          lavenderblush: 'fff0f5',
          lawngreen: '7cfc00',
          lemonchiffon: 'fffacd',
          lightblue: 'add8e6',
          lightcoral: 'f08080',
          lightcyan: 'e0ffff',
          lightgoldenrodyellow: 'fafad2',
          lightgray: 'd3d3d3',
          lightgrey: 'd3d3d3',
          lightgreen: '90ee90',
          lightpink: 'ffb6c1',
          lightsalmon: 'ffa07a',
          lightseagreen: '20b2aa',
          lightskyblue: '87cefa',
          lightslategray: '789',
          lightslategrey: '789',
          lightsteelblue: 'b0c4de',
          lightyellow: 'ffffe0',
          lime: '0f0',
          limegreen: '32cd32',
          linen: 'faf0e6',
          magenta: 'f0f',
          maroon: '800000',
          mediumaquamarine: '66cdaa',
          mediumblue: '0000cd',
          mediumorchid: 'ba55d3',
          mediumpurple: '9370d8',
          mediumseagreen: '3cb371',
          mediumslateblue: '7b68ee',
          mediumspringgreen: '00fa9a',
          mediumturquoise: '48d1cc',
          mediumvioletred: 'c71585',
          midnightblue: '191970',
          mintcream: 'f5fffa',
          mistyrose: 'ffe4e1',
          moccasin: 'ffe4b5',
          navajowhite: 'ffdead',
          navy: '000080',
          oldlace: 'fdf5e6',
          olive: '808000',
          olivedrab: '6b8e23',
          orange: 'ffa500',
          orangered: 'ff4500',
          orchid: 'da70d6',
          palegoldenrod: 'eee8aa',
          palegreen: '98fb98',
          paleturquoise: 'afeeee',
          palevioletred: 'd87093',
          papayawhip: 'ffefd5',
          peachpuff: 'ffdab9',
          peru: 'cd853f',
          pink: 'ffc0cb',
          plum: 'dda0dd',
          powderblue: 'b0e0e6',
          purple: '800080',
          rebeccapurple: '639',
          red: 'f00',
          rosybrown: 'bc8f8f',
          royalblue: '4169e1',
          saddlebrown: '8b4513',
          salmon: 'fa8072',
          sandybrown: 'f4a460',
          seagreen: '2e8b57',
          seashell: 'fff5ee',
          sienna: 'a0522d',
          silver: 'c0c0c0',
          skyblue: '87ceeb',
          slateblue: '6a5acd',
          slategray: '708090',
          slategrey: '708090',
          snow: 'fffafa',
          springgreen: '00ff7f',
          steelblue: '4682b4',
          tan: 'd2b48c',
          teal: '008080',
          thistle: 'd8bfd8',
          tomato: 'ff6347',
          turquoise: '40e0d0',
          violet: 'ee82ee',
          wheat: 'f5deb3',
          white: 'fff',
          whitesmoke: 'f5f5f5',
          yellow: 'ff0',
          yellowgreen: '9acd32'
      };
      
      /*global INCLUDE, installColorSpace, ONECOLOR*/
      
      installColorSpace('XYZ', ['x', 'y', 'z', 'alpha'], {
          fromRgb: function () {
              // http://www.easyrgb.com/index.php?X=MATH&H=02#text2
              var convert = function (channel) {
                      return channel > 0.04045 ?
                          Math.pow((channel + 0.055) / 1.055, 2.4) :
                          channel / 12.92;
                  },
                  r = convert(this._red),
                  g = convert(this._green),
                  b = convert(this._blue);
      
              // Reference white point sRGB D65:
              // http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
              return new ONECOLOR.XYZ(
                  r * 0.4124564 + g * 0.3575761 + b * 0.1804375,
                  r * 0.2126729 + g * 0.7151522 + b * 0.0721750,
                  r * 0.0193339 + g * 0.1191920 + b * 0.9503041,
                  this._alpha
              );
          },
      
          rgb: function () {
              // http://www.easyrgb.com/index.php?X=MATH&H=01#text1
              var x = this._x,
                  y = this._y,
                  z = this._z,
                  convert = function (channel) {
                      return channel > 0.0031308 ?
                          1.055 * Math.pow(channel, 1 / 2.4) - 0.055 :
                          12.92 * channel;
                  };
      
              // Reference white point sRGB D65:
              // http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
              return new ONECOLOR.RGB(
                  convert(x *  3.2404542 + y * -1.5371385 + z * -0.4985314),
                  convert(x * -0.9692660 + y *  1.8760108 + z *  0.0415560),
                  convert(x *  0.0556434 + y * -0.2040259 + z *  1.0572252),
                  this._alpha
              );
          },
      
          lab: function () {
              // http://www.easyrgb.com/index.php?X=MATH&H=07#text7
              var convert = function (channel) {
                      return channel > 0.008856 ?
                          Math.pow(channel, 1 / 3) :
                          7.787037 * channel + 4 / 29;
                  },
                  x = convert(this._x /  95.047),
                  y = convert(this._y / 100.000),
                  z = convert(this._z / 108.883);
      
              return new ONECOLOR.LAB(
                  (116 * y) - 16,
                  500 * (x - y),
                  200 * (y - z),
                  this._alpha
              );
          }
      });
      
      /*global INCLUDE, installColorSpace, ONECOLOR*/
      
      installColorSpace('LAB', ['l', 'a', 'b', 'alpha'], {
          fromRgb: function () {
              return this.xyz().lab();
          },
      
          rgb: function () {
              return this.xyz().rgb();
          },
      
          xyz: function () {
              // http://www.easyrgb.com/index.php?X=MATH&H=08#text8
              var convert = function (channel) {
                      var pow = Math.pow(channel, 3);
                      return pow > 0.008856 ?
                          pow :
                          (channel - 16 / 116) / 7.87;
                  },
                  y = (this._l + 16) / 116,
                  x = this._a / 500 + y,
                  z = y - this._b / 200;
      
              return new ONECOLOR.XYZ(
                  convert(x) *  95.047,
                  convert(y) * 100.000,
                  convert(z) * 108.883,
                  this._alpha
              );
          }
      });
      
      /*global one*/
      
      installColorSpace('HSV', ['hue', 'saturation', 'value', 'alpha'], {
          rgb: function () {
              var hue = this._hue,
                  saturation = this._saturation,
                  value = this._value,
                  i = Math.min(5, Math.floor(hue * 6)),
                  f = hue * 6 - i,
                  p = value * (1 - saturation),
                  q = value * (1 - f * saturation),
                  t = value * (1 - (1 - f) * saturation),
                  red,
                  green,
                  blue;
              switch (i) {
              case 0:
                  red = value;
                  green = t;
                  blue = p;
                  break;
              case 1:
                  red = q;
                  green = value;
                  blue = p;
                  break;
              case 2:
                  red = p;
                  green = value;
                  blue = t;
                  break;
              case 3:
                  red = p;
                  green = q;
                  blue = value;
                  break;
              case 4:
                  red = t;
                  green = p;
                  blue = value;
                  break;
              case 5:
                  red = value;
                  green = p;
                  blue = q;
                  break;
              }
              return new ONECOLOR.RGB(red, green, blue, this._alpha);
          },
      
          hsl: function () {
              var l = (2 - this._saturation) * this._value,
                  sv = this._saturation * this._value,
                  svDivisor = l <= 1 ? l : (2 - l),
                  saturation;
      
              // Avoid division by zero when lightness approaches zero:
              if (svDivisor < 1e-9) {
                  saturation = 0;
              } else {
                  saturation = sv / svDivisor;
              }
              return new ONECOLOR.HSL(this._hue, saturation, l / 2, this._alpha);
          },
      
          fromRgb: function () { // Becomes one.color.RGB.prototype.hsv
              var red = this._red,
                  green = this._green,
                  blue = this._blue,
                  max = Math.max(red, green, blue),
                  min = Math.min(red, green, blue),
                  delta = max - min,
                  hue,
                  saturation = (max === 0) ? 0 : (delta / max),
                  value = max;
              if (delta === 0) {
                  hue = 0;
              } else {
                  switch (max) {
                  case red:
                      hue = (green - blue) / delta / 6 + (green < blue ? 1 : 0);
                      break;
                  case green:
                      hue = (blue - red) / delta / 6 + 1 / 3;
                      break;
                  case blue:
                      hue = (red - green) / delta / 6 + 2 / 3;
                      break;
                  }
              }
              return new ONECOLOR.HSV(hue, saturation, value, this._alpha);
          }
      });
      
      /*global one*/
      
      
      installColorSpace('HSL', ['hue', 'saturation', 'lightness', 'alpha'], {
          hsv: function () {
              // Algorithm adapted from http://wiki.secondlife.com/wiki/Color_conversion_scripts
              var l = this._lightness * 2,
                  s = this._saturation * ((l <= 1) ? l : 2 - l),
                  saturation;
      
              // Avoid division by zero when l + s is very small (approaching black):
              if (l + s < 1e-9) {
                  saturation = 0;
              } else {
                  saturation = (2 * s) / (l + s);
              }
      
              return new ONECOLOR.HSV(this._hue, saturation, (l + s) / 2, this._alpha);
          },
      
          rgb: function () {
              return this.hsv().rgb();
          },
      
          fromRgb: function () { // Becomes one.color.RGB.prototype.hsv
              return this.hsv().hsl();
          }
      });
      
      /*global one*/
      
      installColorSpace('CMYK', ['cyan', 'magenta', 'yellow', 'black', 'alpha'], {
          rgb: function () {
              return new ONECOLOR.RGB((1 - this._cyan * (1 - this._black) - this._black),
                                       (1 - this._magenta * (1 - this._black) - this._black),
                                       (1 - this._yellow * (1 - this._black) - this._black),
                                       this._alpha);
          },
      
          fromRgb: function () { // Becomes one.color.RGB.prototype.cmyk
              // Adapted from http://www.javascripter.net/faq/rgb2cmyk.htm
              var red = this._red,
                  green = this._green,
                  blue = this._blue,
                  cyan = 1 - red,
                  magenta = 1 - green,
                  yellow = 1 - blue,
                  black = 1;
              if (red || green || blue) {
                  black = Math.min(cyan, Math.min(magenta, yellow));
                  cyan = (cyan - black) / (1 - black);
                  magenta = (magenta - black) / (1 - black);
                  yellow = (yellow - black) / (1 - black);
              } else {
                  black = 1;
              }
              return new ONECOLOR.CMYK(cyan, magenta, yellow, black, this._alpha);
          }
      });
      
      ONECOLOR.installMethod('clearer', function (amount) {
          return this.alpha(isNaN(amount) ? -0.1 : -amount, true);
      });
      
      
      ONECOLOR.installMethod('darken', function (amount) {
          return this.lightness(isNaN(amount) ? -0.1 : -amount, true);
      });
      
      
      ONECOLOR.installMethod('desaturate', function (amount) {
          return this.saturation(isNaN(amount) ? -0.1 : -amount, true);
      });
      
      function gs () {
          var rgb = this.rgb(),
              val = rgb._red * 0.3 + rgb._green * 0.59 + rgb._blue * 0.11;
      
          return new ONECOLOR.RGB(val, val, val, this._alpha);
      };
      
      ONECOLOR.installMethod('greyscale', gs);
      ONECOLOR.installMethod('grayscale', gs);
      
      
      ONECOLOR.installMethod('lighten', function (amount) {
          return this.lightness(isNaN(amount) ? 0.1 : amount, true);
      });
      
      ONECOLOR.installMethod('mix', function (otherColor, weight) {
          otherColor = ONECOLOR(otherColor).rgb();
          weight = 1 - (isNaN(weight) ? 0.5 : weight);
      
          var w = weight * 2 - 1,
              a = this._alpha - otherColor._alpha,
              weight1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2,
              weight2 = 1 - weight1,
              rgb = this.rgb();
      
          return new ONECOLOR.RGB(
              rgb._red * weight1 + otherColor._red * weight2,
              rgb._green * weight1 + otherColor._green * weight2,
              rgb._blue * weight1 + otherColor._blue * weight2,
              rgb._alpha * weight + otherColor._alpha * (1 - weight)
          );
      });
      
      ONECOLOR.installMethod('negate', function () {
          var rgb = this.rgb();
          return new ONECOLOR.RGB(1 - rgb._red, 1 - rgb._green, 1 - rgb._blue, this._alpha);
      });
      
      ONECOLOR.installMethod('opaquer', function (amount) {
          return this.alpha(isNaN(amount) ? 0.1 : amount, true);
      });
      
      ONECOLOR.installMethod('rotate', function (degrees) {
          return this.hue((degrees || 0) / 360, true);
      });
      
      
      ONECOLOR.installMethod('saturate', function (amount) {
          return this.saturation(isNaN(amount) ? 0.1 : amount, true);
      });
      
      // Adapted from http://gimp.sourcearchive.com/documentation/2.6.6-1ubuntu1/color-to-alpha_8c-source.html
      /*
          toAlpha returns a color where the values of the argument have been converted to alpha
      */
      ONECOLOR.installMethod('toAlpha', function (color) {
          var me = this.rgb(),
              other = ONECOLOR(color).rgb(),
              epsilon = 1e-10,
              a = new ONECOLOR.RGB(0, 0, 0, me._alpha),
              channels = ['_red', '_green', '_blue'];
      
          channels.forEach(function (channel) {
              if (me[channel] < epsilon) {
                  a[channel] = me[channel];
              } else if (me[channel] > other[channel]) {
                  a[channel] = (me[channel] - other[channel]) / (1 - other[channel]);
              } else if (me[channel] > other[channel]) {
                  a[channel] = (other[channel] - me[channel]) / other[channel];
              } else {
                  a[channel] = 0;
              }
          });
      
          if (a._red > a._green) {
              if (a._red > a._blue) {
                  me._alpha = a._red;
              } else {
                  me._alpha = a._blue;
              }
          } else if (a._green > a._blue) {
              me._alpha = a._green;
          } else {
              me._alpha = a._blue;
          }
      
          if (me._alpha < epsilon) {
              return me;
          }
      
          channels.forEach(function (channel) {
              me[channel] = (me[channel] - other[channel]) / me._alpha + other[channel];
          });
          me._alpha *= a._alpha;
      
          return me;
      });
      
      /*global one*/
      
      // This file is purely for the build system
      
      // Order is important to prevent channel name clashes. Lab <-> hsL
      
      // Convenience functions
      
      
    },
    'one-color-all': function (module, exports, require, global) {
      (function(e,t,n,r,i,s,o,u){function d(e){if(Object.prototype.toString.apply(e)==="[object Array]"){if(typeof e[0]=="string"&&typeof d[e[0]]=="function")return new d[e[0]](e.slice(1,e.length));if(e.length===4)return new d.RGB(e[0]/255,e[1]/255,e[2]/255,e[3]/255)}else if(typeof e=="string"){var r=e.toLowerCase();f[r]&&(e="#"+f[r]),r==="transparent"&&(e="rgba(0,0,0,0)");var i=e.match(p);if(i){var s=i[1].toUpperCase(),o=l(i[8])?i[8]:t(i[8]),u=s[0]==="H",a=i[3]?100:u?360:255,c=i[5]||u?100:255,h=i[7]||u?100:255;if(l(d[s]))throw new Error("one.color."+s+" is not installed.");return new d[s](t(i[2])/a,t(i[4])/c,t(i[6])/h,o)}e.length<6&&(e=e.replace(/^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i,"$1$1$2$2$3$3"));var v=e.match(/^#?([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])$/i);if(v)return new d.RGB(n(v[1],16)/255,n(v[2],16)/255,n(v[3],16)/255)}else if(typeof e=="object"&&e.isColor)return e;return!1}function v(t,n,i){function f(e,t){var n={};n[t.toLowerCase()]=new r("return this.rgb()."+t.toLowerCase()+"();"),d[t].propertyNames.forEach(function(e,i){n[e]=n[e==="black"?"k":e[0]]=new r("value","isDelta","return this."+t.toLowerCase()+"()."+e+"(value, isDelta);")});for(var i in n)n.hasOwnProperty(i)&&d[e].prototype[i]===undefined&&(d[e].prototype[i]=n[i])}d[t]=new r(n.join(","),"if (Object.prototype.toString.apply("+n[0]+") === '[object Array]') {"+n.map(function(e,t){return e+"="+n[0]+"["+t+"];"}).reverse().join("")+"}"+"if ("+n.filter(function(e){return e!=="alpha"}).map(function(e){return"isNaN("+e+")"}).join("||")+"){"+'throw new Error("['+t+']: Invalid color: ("+'+n.join('+","+')+'+")");}'+n.map(function(e){return e==="hue"?"this._hue=hue<0?hue-Math.floor(hue):hue%1":e==="alpha"?"this._alpha=(isNaN(alpha)||alpha>1)?1:(alpha<0?0:alpha);":"this._"+e+"="+e+"<0?0:("+e+">1?1:"+e+")"}).join(";")+";"),d[t].propertyNames=n;var s=d[t].prototype;["valueOf","hex","hexa","css","cssa"].forEach(function(e){s[e]=s[e]||(t==="RGB"?s.hex:new r("return this.rgb()."+e+"();"))}),s.isColor=!0,s.equals=function(r,i){l(i)&&(i=1e-10),r=r[t.toLowerCase()]();for(var s=0;s<n.length;s+=1)if(e.abs(this["_"+n[s]]-r["_"+n[s]])>i)return!1;return!0},s.toJSON=new r("return ['"+t+"', "+n.map(function(e){return"this._"+e},this).join(", ")+"];");for(var o in i)if(i.hasOwnProperty(o)){var u=o.match(/^from(.*)$/);u?d[u[1].toUpperCase()].prototype[t.toLowerCase()]=i[o]:s[o]=i[o]}s[t.toLowerCase()]=function(){return this},s.toString=new r('return "[one.color.'+t+':"+'+n.map(function(e,t){return'" '+n[t]+'="+this._'+e}).join("+")+'+"]";'),n.forEach(function(e,t){s[e]=s[e==="black"?"k":e[0]]=new r("value","isDelta","if (typeof value === 'undefined') {return this._"+e+";"+"}"+"if (isDelta) {"+"return new this.constructor("+n.map(function(t,n){return"this._"+t+(e===t?"+value":"")}).join(", ")+");"+"}"+"return new this.constructor("+n.map(function(t,n){return e===t?"value":"this._"+t}).join(", ")+");")}),a.forEach(function(e){f(t,e),f(e,t)}),a.push(t)}function m(){var e=this.rgb(),t=e._red*.3+e._green*.59+e._blue*.11;return new d.RGB(t,t,t,this._alpha)}var a=[],f={},l=function(e){return typeof e=="undefined"},c=/\s*(\.\d+|\d+(?:\.\d+)?)(%)?\s*/,h=/\s*(\.\d+|\d+(?:\.\d+)?)\s*/,p=new RegExp("^(rgb|hsl|hsv)a?\\("+c.source+","+c.source+","+c.source+"(?:,"+h.source+")?"+"\\)$","i");d.installMethod=function(e,t){a.forEach(function(n){d[n].prototype[e]=t})},v("RGB",["red","green","blue","alpha"],{hex:function(){var e=(s(255*this._red)*65536+s(255*this._green)*256+s(255*this._blue)).toString(16);return"#"+"00000".substr(0,6-e.length)+e},hexa:function(){var e=s(this._alpha*255).toString(16);return"#"+"00".substr(0,2-e.length)+e+this.hex().substr(1,6)},css:function(){return"rgb("+s(255*this._red)+","+s(255*this._green)+","+s(255*this._blue)+")"},cssa:function(){return"rgba("+s(255*this._red)+","+s(255*this._green)+","+s(255*this._blue)+","+this._alpha+")"}}),typeof define=="function"&&!l(define.amd)?define(function(){return d}):typeof exports=="object"?module.exports=d:(one=window.one||{},one.color=d),typeof jQuery!="undefined"&&l(jQuery.color)&&(jQuery.color=d),f={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"0ff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000",blanchedalmond:"ffebcd",blue:"00f",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"0ff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgrey:"a9a9a9",darkgreen:"006400",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkslategrey:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dimgrey:"696969",dodgerblue:"1e90ff",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"f0f",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",grey:"808080",green:"008000",greenyellow:"adff2f",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgray:"d3d3d3",lightgrey:"d3d3d3",lightgreen:"90ee90",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslategray:"789",lightslategrey:"789",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"0f0",limegreen:"32cd32",linen:"faf0e6",magenta:"f0f",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370d8",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"d87093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",rebeccapurple:"639",red:"f00",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",slategrey:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",wheat:"f5deb3",white:"fff",whitesmoke:"f5f5f5",yellow:"ff0",yellowgreen:"9acd32"},v("XYZ",["x","y","z","alpha"],{fromRgb:function(){var e=function(e){return e>.04045?o((e+.055)/1.055,2.4):e/12.92},t=e(this._red),n=e(this._green),r=e(this._blue);return new d.XYZ(t*.4124564+n*.3575761+r*.1804375,t*.2126729+n*.7151522+r*.072175,t*.0193339+n*.119192+r*.9503041,this._alpha)},rgb:function(){var e=this._x,t=this._y,n=this._z,r=function(e){return e>.0031308?1.055*o(e,1/2.4)-.055:12.92*e};return new d.RGB(r(e*3.2404542+t*-1.5371385+n*-0.4985314),r(e*-0.969266+t*1.8760108+n*.041556),r(e*.0556434+t*-0.2040259+n*1.0572252),this._alpha)},lab:function(){var e=function(e){return e>.008856?o(e,1/3):7.787037*e+4/29},t=e(this._x/95.047),n=e(this._y/100),r=e(this._z/108.883);return new d.LAB(116*n-16,500*(t-n),200*(n-r),this._alpha)}}),v("LAB",["l","a","b","alpha"],{fromRgb:function(){return this.xyz().lab()},rgb:function(){return this.xyz().rgb()},xyz:function(){var e=function(e){var t=o(e,3);return t>.008856?t:(e-16/116)/7.87},t=(this._l+16)/116,n=this._a/500+t,r=t-this._b/200;return new d.XYZ(e(n)*95.047,e(t)*100,e(r)*108.883,this._alpha)}}),v("HSV",["hue","saturation","value","alpha"],{rgb:function(){var t=this._hue,n=this._saturation,r=this._value,i=u(5,e.floor(t*6)),s=t*6-i,o=r*(1-n),a=r*(1-s*n),f=r*(1-(1-s)*n),l,c,h;switch(i){case 0:l=r,c=f,h=o;break;case 1:l=a,c=r,h=o;break;case 2:l=o,c=r,h=f;break;case 3:l=o,c=a,h=r;break;case 4:l=f,c=o,h=r;break;case 5:l=r,c=o,h=a}return new d.RGB(l,c,h,this._alpha)},hsl:function(){var e=(2-this._saturation)*this._value,t=this._saturation*this._value,n=e<=1?e:2-e,r;return n<1e-9?r=0:r=t/n,new d.HSL(this._hue,r,e/2,this._alpha)},fromRgb:function(){var t=this._red,n=this._green,r=this._blue,i=e.max(t,n,r),s=u(t,n,r),o=i-s,a,f=i===0?0:o/i,l=i;if(o===0)a=0;else switch(i){case t:a=(n-r)/o/6+(n<r?1:0);break;case n:a=(r-t)/o/6+1/3;break;case r:a=(t-n)/o/6+2/3}return new d.HSV(a,f,l,this._alpha)}}),v("HSL",["hue","saturation","lightness","alpha"],{hsv:function(){var e=this._lightness*2,t=this._saturation*(e<=1?e:2-e),n;return e+t<1e-9?n=0:n=2*t/(e+t),new d.HSV(this._hue,n,(e+t)/2,this._alpha)},rgb:function(){return this.hsv().rgb()},fromRgb:function(){return this.hsv().hsl()}}),v("CMYK",["cyan","magenta","yellow","black","alpha"],{rgb:function(){return new d.RGB(1-this._cyan*(1-this._black)-this._black,1-this._magenta*(1-this._black)-this._black,1-this._yellow*(1-this._black)-this._black,this._alpha)},fromRgb:function(){var e=this._red,t=this._green,n=this._blue,r=1-e,i=1-t,s=1-n,o=1;return e||t||n?(o=u(r,u(i,s)),r=(r-o)/(1-o),i=(i-o)/(1-o),s=(s-o)/(1-o)):o=1,new d.CMYK(r,i,s,o,this._alpha)}}),d.installMethod("clearer",function(e){return this.alpha(i(e)?-0.1:-e,!0)}),d.installMethod("darken",function(e){return this.lightness(i(e)?-0.1:-e,!0)}),d.installMethod("desaturate",function(e){return this.saturation(i(e)?-0.1:-e,!0)}),d.installMethod("greyscale",m),d.installMethod("grayscale",m),d.installMethod("lighten",function(e){return this.lightness(i(e)?.1:e,!0)}),d.installMethod("mix",function(e,t){e=d(e).rgb(),t=1-(i(t)?.5:t);var n=t*2-1,r=this._alpha-e._alpha,s=((n*r===-1?n:(n+r)/(1+n*r))+1)/2,o=1-s,u=this.rgb();return new d.RGB(u._red*s+e._red*o,u._green*s+e._green*o,u._blue*s+e._blue*o,u._alpha*t+e._alpha*(1-t))}),d.installMethod("negate",function(){var e=this.rgb();return new d.RGB(1-e._red,1-e._green,1-e._blue,this._alpha)}),d.installMethod("opaquer",function(e){return this.alpha(i(e)?.1:e,!0)}),d.installMethod("rotate",function(e){return this.hue((e||0)/360,!0)}),d.installMethod("saturate",function(e){return this.saturation(i(e)?.1:e,!0)}),d.installMethod("toAlpha",function(e){var t=this.rgb(),n=d(e).rgb(),r=1e-10,i=new d.RGB(0,0,0,t._alpha),s=["_red","_green","_blue"];return s.forEach(function(e){t[e]<r?i[e]=t[e]:t[e]>n[e]?i[e]=(t[e]-n[e])/(1-n[e]):t[e]>n[e]?i[e]=(n[e]-t[e])/n[e]:i[e]=0}),i._red>i._green?i._red>i._blue?t._alpha=i._red:t._alpha=i._blue:i._green>i._blue?t._alpha=i._green:t._alpha=i._blue,t._alpha<r?t:(s.forEach(function(e){t[e]=(t[e]-n[e])/t._alpha+n[e]}),t._alpha*=i._alpha,t)})})(Math,parseFloat,parseInt,Function,isNaN,Math.round,Math.pow,Math.min)
      
    },
    'one-color-debug': function (module, exports, require, global) {
      /*jshint evil:true, onevar:false*/
      /*global define*/
      var installedColorSpaces = [],
          namedColors = {},
          undef = function (obj) {
              return typeof obj === 'undefined';
          },
          channelRegExp = /\s*(\.\d+|\d+(?:\.\d+)?)(%)?\s*/,
          alphaChannelRegExp = /\s*(\.\d+|\d+(?:\.\d+)?)\s*/,
          cssColorRegExp = new RegExp(
                               "^(rgb|hsl|hsv)a?" +
                               "\\(" +
                                   channelRegExp.source + "," +
                                   channelRegExp.source + "," +
                                   channelRegExp.source +
                                   "(?:," + alphaChannelRegExp.source + ")?" +
                               "\\)$", "i");
      
      function ONECOLOR(obj) {
          if (Object.prototype.toString.apply(obj) === '[object Array]') {
              if (typeof obj[0] === 'string' && typeof ONECOLOR[obj[0]] === 'function') {
                  // Assumed array from .toJSON()
                  return new ONECOLOR[obj[0]](obj.slice(1, obj.length));
              } else if (obj.length === 4) {
                  // Assumed 4 element int RGB array from canvas with all channels [0;255]
                  return new ONECOLOR.RGB(obj[0] / 255, obj[1] / 255, obj[2] / 255, obj[3] / 255);
              }
          } else if (typeof obj === 'string') {
              var lowerCased = obj.toLowerCase();
              if (namedColors[lowerCased]) {
                  obj = '#' + namedColors[lowerCased];
              }
              if (lowerCased === 'transparent') {
                  obj = 'rgba(0,0,0,0)';
              }
              // Test for CSS rgb(....) string
              var matchCssSyntax = obj.match(cssColorRegExp);
              if (matchCssSyntax) {
                  var colorSpaceName = matchCssSyntax[1].toUpperCase(),
                      alpha = undef(matchCssSyntax[8]) ? matchCssSyntax[8] : parseFloat(matchCssSyntax[8]),
                      hasHue = colorSpaceName[0] === 'H',
                      firstChannelDivisor = matchCssSyntax[3] ? 100 : (hasHue ? 360 : 255),
                      secondChannelDivisor = (matchCssSyntax[5] || hasHue) ? 100 : 255,
                      thirdChannelDivisor = (matchCssSyntax[7] || hasHue) ? 100 : 255;
                  if (undef(ONECOLOR[colorSpaceName])) {
                      throw new Error("one.color." + colorSpaceName + " is not installed.");
                  }
                  return new ONECOLOR[colorSpaceName](
                      parseFloat(matchCssSyntax[2]) / firstChannelDivisor,
                      parseFloat(matchCssSyntax[4]) / secondChannelDivisor,
                      parseFloat(matchCssSyntax[6]) / thirdChannelDivisor,
                      alpha
                  );
              }
              // Assume hex syntax
              if (obj.length < 6) {
                  // Allow CSS shorthand
                  obj = obj.replace(/^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i, '$1$1$2$2$3$3');
              }
              // Split obj into red, green, and blue components
              var hexMatch = obj.match(/^#?([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])$/i);
              if (hexMatch) {
                  return new ONECOLOR.RGB(
                      parseInt(hexMatch[1], 16) / 255,
                      parseInt(hexMatch[2], 16) / 255,
                      parseInt(hexMatch[3], 16) / 255
                  );
              }
          } else if (typeof obj === 'object' && obj.isColor) {
              return obj;
          }
          return false;
      }
      
      function installColorSpace(colorSpaceName, propertyNames, config) {
          ONECOLOR[colorSpaceName] = new Function(propertyNames.join(","),
              // Allow passing an array to the constructor:
              "if (Object.prototype.toString.apply(" + propertyNames[0] + ") === '[object Array]') {" +
                  propertyNames.map(function (propertyName, i) {
                      return propertyName + "=" + propertyNames[0] + "[" + i + "];";
                  }).reverse().join("") +
              "}" +
              "if (" + propertyNames.filter(function (propertyName) {
                  return propertyName !== 'alpha';
              }).map(function (propertyName) {
                  return "isNaN(" + propertyName + ")";
              }).join("||") + "){" + "throw new Error(\"[" + colorSpaceName + "]: Invalid color: (\"+" + propertyNames.join("+\",\"+") + "+\")\");}" +
              propertyNames.map(function (propertyName) {
                  if (propertyName === 'hue') {
                      return "this._hue=hue<0?hue-Math.floor(hue):hue%1"; // Wrap
                  } else if (propertyName === 'alpha') {
                      return "this._alpha=(isNaN(alpha)||alpha>1)?1:(alpha<0?0:alpha);";
                  } else {
                      return "this._" + propertyName + "=" + propertyName + "<0?0:(" + propertyName + ">1?1:" + propertyName + ")";
                  }
              }).join(";") + ";"
          );
          ONECOLOR[colorSpaceName].propertyNames = propertyNames;
      
          var prototype = ONECOLOR[colorSpaceName].prototype;
      
          ['valueOf', 'hex', 'hexa', 'css', 'cssa'].forEach(function (methodName) {
              prototype[methodName] = prototype[methodName] || (colorSpaceName === 'RGB' ? prototype.hex : new Function("return this.rgb()." + methodName + "();"));
          });
      
          prototype.isColor = true;
      
          prototype.equals = function (otherColor, epsilon) {
              if (undef(epsilon)) {
                  epsilon = 1e-10;
              }
      
              otherColor = otherColor[colorSpaceName.toLowerCase()]();
      
              for (var i = 0; i < propertyNames.length; i = i + 1) {
                  if (Math.abs(this['_' + propertyNames[i]] - otherColor['_' + propertyNames[i]]) > epsilon) {
                      return false;
                  }
              }
      
              return true;
          };
      
          prototype.toJSON = new Function(
              "return ['" + colorSpaceName + "', " +
                  propertyNames.map(function (propertyName) {
                      return "this._" + propertyName;
                  }, this).join(", ") +
              "];"
          );
      
          for (var propertyName in config) {
              if (config.hasOwnProperty(propertyName)) {
                  var matchFromColorSpace = propertyName.match(/^from(.*)$/);
                  if (matchFromColorSpace) {
                      ONECOLOR[matchFromColorSpace[1].toUpperCase()].prototype[colorSpaceName.toLowerCase()] = config[propertyName];
                  } else {
                      prototype[propertyName] = config[propertyName];
                  }
              }
          }
      
          // It is pretty easy to implement the conversion to the same color space:
          prototype[colorSpaceName.toLowerCase()] = function () {
              return this;
          };
          prototype.toString = new Function("return \"[one.color." + colorSpaceName + ":\"+" + propertyNames.map(function (propertyName, i) {
              return "\" " + propertyNames[i] + "=\"+this._" + propertyName;
          }).join("+") + "+\"]\";");
      
          // Generate getters and setters
          propertyNames.forEach(function (propertyName, i) {
              prototype[propertyName] = prototype[propertyName === 'black' ? 'k' : propertyName[0]] = new Function("value", "isDelta",
                  // Simple getter mode: color.red()
                  "if (typeof value === 'undefined') {" +
                      "return this._" + propertyName + ";" +
                  "}" +
                  // Adjuster: color.red(+.2, true)
                  "if (isDelta) {" +
                      "return new this.constructor(" + propertyNames.map(function (otherPropertyName, i) {
                          return "this._" + otherPropertyName + (propertyName === otherPropertyName ? "+value" : "");
                      }).join(", ") + ");" +
                  "}" +
                  // Setter: color.red(.2);
                  "return new this.constructor(" + propertyNames.map(function (otherPropertyName, i) {
                      return propertyName === otherPropertyName ? "value" : "this._" + otherPropertyName;
                  }).join(", ") + ");");
          });
      
          function installForeignMethods(targetColorSpaceName, sourceColorSpaceName) {
              var obj = {};
              obj[sourceColorSpaceName.toLowerCase()] = new Function("return this.rgb()." + sourceColorSpaceName.toLowerCase() + "();"); // Fallback
              ONECOLOR[sourceColorSpaceName].propertyNames.forEach(function (propertyName, i) {
                  obj[propertyName] = obj[propertyName === 'black' ? 'k' : propertyName[0]] = new Function("value", "isDelta", "return this." + sourceColorSpaceName.toLowerCase() + "()." + propertyName + "(value, isDelta);");
              });
              for (var prop in obj) {
                  if (obj.hasOwnProperty(prop) && ONECOLOR[targetColorSpaceName].prototype[prop] === undefined) {
                      ONECOLOR[targetColorSpaceName].prototype[prop] = obj[prop];
                  }
              }
          }
      
          installedColorSpaces.forEach(function (otherColorSpaceName) {
              installForeignMethods(colorSpaceName, otherColorSpaceName);
              installForeignMethods(otherColorSpaceName, colorSpaceName);
          });
      
          installedColorSpaces.push(colorSpaceName);
      }
      
      ONECOLOR.installMethod = function (name, fn) {
          installedColorSpaces.forEach(function (colorSpace) {
              ONECOLOR[colorSpace].prototype[name] = fn;
          });
      };
      
      installColorSpace('RGB', ['red', 'green', 'blue', 'alpha'], {
          hex: function () {
              var hexString = (Math.round(255 * this._red) * 0x10000 + Math.round(255 * this._green) * 0x100 + Math.round(255 * this._blue)).toString(16);
              return '#' + ('00000'.substr(0, 6 - hexString.length)) + hexString;
          },
      
          hexa: function () {
              var alphaString = Math.round(this._alpha * 255).toString(16);
              return '#' + '00'.substr(0, 2 - alphaString.length) + alphaString + this.hex().substr(1, 6);
          },
      
          css: function () {
              return "rgb(" + Math.round(255 * this._red) + "," + Math.round(255 * this._green) + "," + Math.round(255 * this._blue) + ")";
          },
      
          cssa: function () {
              return "rgba(" + Math.round(255 * this._red) + "," + Math.round(255 * this._green) + "," + Math.round(255 * this._blue) + "," + this._alpha + ")";
          }
      });
      if (typeof define === 'function' && !undef(define.amd)) {
          define(function () {
              return ONECOLOR;
          });
      } else if (typeof exports === 'object') {
          // Node module export
          module.exports = ONECOLOR;
      } else {
          one = window.one || {};
          one.color = ONECOLOR;
      }
      
      if (typeof jQuery !== 'undefined' && undef(jQuery.color)) {
          jQuery.color = ONECOLOR;
      }
      
      /*global one*/
      
      installColorSpace('HSV', ['hue', 'saturation', 'value', 'alpha'], {
          rgb: function () {
              var hue = this._hue,
                  saturation = this._saturation,
                  value = this._value,
                  i = Math.min(5, Math.floor(hue * 6)),
                  f = hue * 6 - i,
                  p = value * (1 - saturation),
                  q = value * (1 - f * saturation),
                  t = value * (1 - (1 - f) * saturation),
                  red,
                  green,
                  blue;
              switch (i) {
              case 0:
                  red = value;
                  green = t;
                  blue = p;
                  break;
              case 1:
                  red = q;
                  green = value;
                  blue = p;
                  break;
              case 2:
                  red = p;
                  green = value;
                  blue = t;
                  break;
              case 3:
                  red = p;
                  green = q;
                  blue = value;
                  break;
              case 4:
                  red = t;
                  green = p;
                  blue = value;
                  break;
              case 5:
                  red = value;
                  green = p;
                  blue = q;
                  break;
              }
              return new ONECOLOR.RGB(red, green, blue, this._alpha);
          },
      
          hsl: function () {
              var l = (2 - this._saturation) * this._value,
                  sv = this._saturation * this._value,
                  svDivisor = l <= 1 ? l : (2 - l),
                  saturation;
      
              // Avoid division by zero when lightness approaches zero:
              if (svDivisor < 1e-9) {
                  saturation = 0;
              } else {
                  saturation = sv / svDivisor;
              }
              return new ONECOLOR.HSL(this._hue, saturation, l / 2, this._alpha);
          },
      
          fromRgb: function () { // Becomes one.color.RGB.prototype.hsv
              var red = this._red,
                  green = this._green,
                  blue = this._blue,
                  max = Math.max(red, green, blue),
                  min = Math.min(red, green, blue),
                  delta = max - min,
                  hue,
                  saturation = (max === 0) ? 0 : (delta / max),
                  value = max;
              if (delta === 0) {
                  hue = 0;
              } else {
                  switch (max) {
                  case red:
                      hue = (green - blue) / delta / 6 + (green < blue ? 1 : 0);
                      break;
                  case green:
                      hue = (blue - red) / delta / 6 + 1 / 3;
                      break;
                  case blue:
                      hue = (red - green) / delta / 6 + 2 / 3;
                      break;
                  }
              }
              return new ONECOLOR.HSV(hue, saturation, value, this._alpha);
          }
      });
      
      /*global one*/
      
      
      installColorSpace('HSL', ['hue', 'saturation', 'lightness', 'alpha'], {
          hsv: function () {
              // Algorithm adapted from http://wiki.secondlife.com/wiki/Color_conversion_scripts
              var l = this._lightness * 2,
                  s = this._saturation * ((l <= 1) ? l : 2 - l),
                  saturation;
      
              // Avoid division by zero when l + s is very small (approaching black):
              if (l + s < 1e-9) {
                  saturation = 0;
              } else {
                  saturation = (2 * s) / (l + s);
              }
      
              return new ONECOLOR.HSV(this._hue, saturation, (l + s) / 2, this._alpha);
          },
      
          rgb: function () {
              return this.hsv().rgb();
          },
      
          fromRgb: function () { // Becomes one.color.RGB.prototype.hsv
              return this.hsv().hsl();
          }
      });
      
      /*global one*/
      
      // This file is purely for the build system
      
      
    },
    'one-color-ieshim': function (module, exports, require, global) {
      !function(){var prepareString="a"!=="a"[0],toObject=function(o){if(null===o)throw new TypeError("can't convert "+o+" to object");return prepareString&&"string"==typeof o&&o?o.split(""):new Object(o)};Array.prototype.forEach||(Array.prototype.forEach=function(fun){var self=toObject(this),thisp=arguments[1],i=-1,length=self.length>>>0;if("function"!=typeof fun)throw new TypeError;for(;++i<length;)i in self&&fun.call(thisp,self[i],i,self)}),Array.prototype.map||(Array.prototype.map=function(fun){var i,self=toObject(this),length=self.length>>>0,result=new Array(length),thisp=arguments[1];if("function"!=typeof fun)throw new TypeError(fun+" is not a function");for(i=0;length>i;i+=1)i in self&&(result[i]=fun.call(thisp,self[i],i,self));return result}),Array.prototype.filter||(Array.prototype.filter=function(fun){var value,i,self=toObject(this),length=self.length>>>0,result=[],thisp=arguments[1];if("function"!=typeof fun)throw new TypeError(fun+" is not a function");for(i=0;length>i;i+=1)i in self&&(value=self[i],fun.call(thisp,value,i,self)&&result.push(value));return result})}();
    },
    'one-color': function (module, exports, require, global) {
      (function(e,t,n,r,i,s){function h(n){if(Object.prototype.toString.apply(n)==="[object Array]"){if(typeof n[0]=="string"&&typeof h[n[0]]=="function")return new h[n[0]](n.slice(1,n.length));if(n.length===4)return new h.RGB(n[0]/255,n[1]/255,n[2]/255,n[3]/255)}else if(typeof n=="string"){var r=n.toLowerCase();u[r]&&(n="#"+u[r]),r==="transparent"&&(n="rgba(0,0,0,0)");var i=n.match(c);if(i){var s=i[1].toUpperCase(),o=a(i[8])?i[8]:e(i[8]),f=s[0]==="H",l=i[3]?100:f?360:255,p=i[5]||f?100:255,d=i[7]||f?100:255;if(a(h[s]))throw new Error("one.color."+s+" is not installed.");return new h[s](e(i[2])/l,e(i[4])/p,e(i[6])/d,o)}n.length<6&&(n=n.replace(/^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i,"$1$1$2$2$3$3"));var v=n.match(/^#?([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])$/i);if(v)return new h.RGB(t(v[1],16)/255,t(v[2],16)/255,t(v[3],16)/255)}else if(typeof n=="object"&&n.isColor)return n;return!1}function p(e,t,i){function l(e,t){var r={};r[t.toLowerCase()]=new n("return this.rgb()."+t.toLowerCase()+"();"),h[t].propertyNames.forEach(function(e,i){r[e]=r[e==="black"?"k":e[0]]=new n("value","isDelta","return this."+t.toLowerCase()+"()."+e+"(value, isDelta);")});for(var i in r)r.hasOwnProperty(i)&&h[e].prototype[i]===undefined&&(h[e].prototype[i]=r[i])}h[e]=new n(t.join(","),"if (Object.prototype.toString.apply("+t[0]+") === '[object Array]') {"+t.map(function(e,n){return e+"="+t[0]+"["+n+"];"}).reverse().join("")+"}"+"if ("+t.filter(function(e){return e!=="alpha"}).map(function(e){return"isNaN("+e+")"}).join("||")+"){"+'throw new Error("['+e+']: Invalid color: ("+'+t.join('+","+')+'+")");}'+t.map(function(e){return e==="hue"?"this._hue=hue<0?hue-Math.floor(hue):hue%1":e==="alpha"?"this._alpha=(isNaN(alpha)||alpha>1)?1:(alpha<0?0:alpha);":"this._"+e+"="+e+"<0?0:("+e+">1?1:"+e+")"}).join(";")+";"),h[e].propertyNames=t;var s=h[e].prototype;["valueOf","hex","hexa","css","cssa"].forEach(function(t){s[t]=s[t]||(e==="RGB"?s.hex:new n("return this.rgb()."+t+"();"))}),s.isColor=!0,s.equals=function(n,i){a(i)&&(i=1e-10),n=n[e.toLowerCase()]();for(var s=0;s<t.length;s+=1)if(r.abs(this["_"+t[s]]-n["_"+t[s]])>i)return!1;return!0},s.toJSON=new n("return ['"+e+"', "+t.map(function(e){return"this._"+e},this).join(", ")+"];");for(var u in i)if(i.hasOwnProperty(u)){var f=u.match(/^from(.*)$/);f?h[f[1].toUpperCase()].prototype[e.toLowerCase()]=i[u]:s[u]=i[u]}s[e.toLowerCase()]=function(){return this},s.toString=new n('return "[one.color.'+e+':"+'+t.map(function(e,n){return'" '+t[n]+'="+this._'+e}).join("+")+'+"]";'),t.forEach(function(e,r){s[e]=s[e==="black"?"k":e[0]]=new n("value","isDelta","if (typeof value === 'undefined') {return this._"+e+";"+"}"+"if (isDelta) {"+"return new this.constructor("+t.map(function(t,n){return"this._"+t+(e===t?"+value":"")}).join(", ")+");"+"}"+"return new this.constructor("+t.map(function(t,n){return e===t?"value":"this._"+t}).join(", ")+");")}),o.forEach(function(t){l(e,t),l(t,e)}),o.push(e)}var o=[],u={},a=function(e){return typeof e=="undefined"},f=/\s*(\.\d+|\d+(?:\.\d+)?)(%)?\s*/,l=/\s*(\.\d+|\d+(?:\.\d+)?)\s*/,c=new RegExp("^(rgb|hsl|hsv)a?\\("+f.source+","+f.source+","+f.source+"(?:,"+l.source+")?"+"\\)$","i");h.installMethod=function(e,t){o.forEach(function(n){h[n].prototype[e]=t})},p("RGB",["red","green","blue","alpha"],{hex:function(){var e=(i(255*this._red)*65536+i(255*this._green)*256+i(255*this._blue)).toString(16);return"#"+"00000".substr(0,6-e.length)+e},hexa:function(){var e=i(this._alpha*255).toString(16);return"#"+"00".substr(0,2-e.length)+e+this.hex().substr(1,6)},css:function(){return"rgb("+i(255*this._red)+","+i(255*this._green)+","+i(255*this._blue)+")"},cssa:function(){return"rgba("+i(255*this._red)+","+i(255*this._green)+","+i(255*this._blue)+","+this._alpha+")"}}),typeof define=="function"&&!a(define.amd)?define(function(){return h}):typeof exports=="object"?module.exports=h:(one=window.one||{},one.color=h),typeof jQuery!="undefined"&&a(jQuery.color)&&(jQuery.color=h),p("HSV",["hue","saturation","value","alpha"],{rgb:function(){var e=this._hue,t=this._saturation,n=this._value,i=s(5,r.floor(e*6)),o=e*6-i,u=n*(1-t),a=n*(1-o*t),f=n*(1-(1-o)*t),l,c,p;switch(i){case 0:l=n,c=f,p=u;break;case 1:l=a,c=n,p=u;break;case 2:l=u,c=n,p=f;break;case 3:l=u,c=a,p=n;break;case 4:l=f,c=u,p=n;break;case 5:l=n,c=u,p=a}return new h.RGB(l,c,p,this._alpha)},hsl:function(){var e=(2-this._saturation)*this._value,t=this._saturation*this._value,n=e<=1?e:2-e,r;return n<1e-9?r=0:r=t/n,new h.HSL(this._hue,r,e/2,this._alpha)},fromRgb:function(){var e=this._red,t=this._green,n=this._blue,i=r.max(e,t,n),o=s(e,t,n),u=i-o,a,f=i===0?0:u/i,l=i;if(u===0)a=0;else switch(i){case e:a=(t-n)/u/6+(t<n?1:0);break;case t:a=(n-e)/u/6+1/3;break;case n:a=(e-t)/u/6+2/3}return new h.HSV(a,f,l,this._alpha)}}),p("HSL",["hue","saturation","lightness","alpha"],{hsv:function(){var e=this._lightness*2,t=this._saturation*(e<=1?e:2-e),n;return e+t<1e-9?n=0:n=2*t/(e+t),new h.HSV(this._hue,n,(e+t)/2,this._alpha)},rgb:function(){return this.hsv().rgb()},fromRgb:function(){return this.hsv().hsl()}})})(parseFloat,parseInt,Function,Math,Math.round,Math.min)
      
    }
  }, 'one-color-all-debug');

  require('qwery');
  require('qwery/src/ender');
  require('bonzo');
  require('bonzo/src/ender');
  require('bean');
  require('bean/src/ender');
  require('moment');
  require('moment/ender');
  require('kizzy');
  require('kizzy/src/ender');
  require('pnglib');
  require('onecolor');

}.call(window));
//# sourceMappingURL=ender.js.map
