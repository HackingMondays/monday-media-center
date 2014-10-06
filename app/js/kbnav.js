/**
 * The kbnav module provides Keyboard Navigation to the elements of a web page.
 * It supports a 4-way navigation + an activation of the element.
 *
 * Usage:
 *
 *  kbnav.install([selector-or-nodes]) : install the keyboard navigation on the window object, and optionnally
 *  to the nodes described by the argument.
 *
 *  kbnav.register() : registers a dom node to the kbnav system
 *
 *  kbnav.unregister(): unregisters a previously registered dom node
 *
 *  kbnav.moveFrom(domNode, direction) : moves the focus to another element according to the current layout on the page.
 *
 *  kbnav.setFocus(index): sets programatically the focus to a managed element.
 *
 *  Compatibility: ES5 + Array.forEach
 *
 * @type {kbnav|*}
 */
var kbnav = kbnav || (function(){
    'use strict';

    var Nav = {};

    var keymap = {
        "up": 38,
        "down": 40,
        "left": 37,
        "right": 39,
        "trigger": 13
    };

    var directionCommands = ["up", "down", "left", "right"];

    var keymapToCommandCache;
    function keyToCommand(keyCode) {
        if (!keymapToCommandCache) {
            keymapToCommandCache = {};
            for (var k in keymap) {
                if (keymap.hasOwnProperty(k)) {
                    keymapToCommandCache[keymap[k]] = k;
                }
            }
        }
        return keymapToCommandCache[keyCode];
    };

    var elements = [];

    /**
     * The Element class has basically two purposes: it associates a native html element to its
     * trigger/focus callbacks, and it caches its positions on the page, as it can be slow
     * to fetch it in some browsers (getBoundingClientRect may cause a layout redraw in webkit,
     * see http://stackoverflow.com/questions/7664229/optimize-js-jquery-performance-getboundingclientrect-and-eliminating-layout-re )
     *
     * If no requestTriggerCallback is provided, a click mouse event is generated and dispatched to the dom element.
     * If no requestFocusCallback is provided, it just calls the native focus() method (this should be fine in most cases)
     *
     * @param domElement
     * @param requestTriggerCallback
     * @param requestFocusCallback
     * @returns {HTMLElement}
     * @constructor
     */
    function Element(domElement, requestTriggerCallback, requestFocusCallback) {
        if (!(this instanceof Element)) {
            return new Element(domElement)
        }

        // We try to detect whether the domElement provided happens to erroneously be a jQuery object.
        // If JQuery is detected, we get() the dom behind it.
        // The detection method is an ugly guess, please do better if you know how
        var isJquery = false;
        try {
            isJquery = (domElement.jquery) || (domElement instanceof JQuery);
        } catch(err) {
            // ignore and go on, JQuery was not loaded at all and the instanceof just threw an error
        }

        var nativeDom = isJquery?domElement.get():domElement;

        this.update = function() {
            var bound = nativeDom.getBoundingClientRect();
            this.top = bound.top;
            this.left = bound.left;
            this.right = bound.right;
            this.bottom = bound.bottom;
            this.centery = bound.top + ((bound.bottom - bound.top)/2);
            this.centerx = bound.left + ((bound.right - bound.left)/2);
        }

        this.focus = function() {
            return requestFocusCallback?requestFocusCallback():nativeDom.focus();
        };

        this.trigger = function() {
            if (requestTriggerCallback) {
                requestTriggerCallback();
            } else {
                var event = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true
                });
                nativeDom.dispatchEvent(event);
            }
        }

        this.domElementEquals = function(someDomElement) {
            return nativeDom == someDomElement;
        }

        this.execute = function(command) {
            if (directionCommands.indexOf(command)>=0) {
                Nav.moveFrom(domElement, command);
            } else if (command == "trigger") {
                this.trigger();
            }
        };

        this.installKeymap = function(controlList) {
        // TODO: FATAL CHECK (FOUS TA CAGOULE)
//            var self = this;
//            nativeDom.addEventListener("keydown", function(event) {
//                var command = keyToCommand(event.which);
//
//                console.log("+",event.which,command);
//
//                if (command && controlList.indexOf(command)>=0) {
//                    event.stopPropagation();
//                    event.preventDefault();
//                    self.execute(command);
//                }
//            });
        }

        this.element = domElement;
        this.update();
    }

    function findClosest(direction, from) {
        var cur = from;
        var list = partitionList(cur, direction);
        var closest = undefined;
        var closestDistance = undefined;
        for (var i= 0,max=list.length; i<max; i+=1) {
            var el = list[i];
            var dist = findDistance(direction, cur, el);
            if (closestDistance === undefined || dist < closestDistance) {
                closest = el;
                closestDistance = dist;
            }
        }
        return closest;
    }

    /**
     * Calculates the distance between two elements of type Element.
     * The returned distance does not really matter, it is just meant to be
     * a value consistent enough to be compared to others'.
     *
     * @param direction a string, "up", "down", "left", "right"
     * @param el an Element object
     * @param el2 another Element object
     * @returns {number} a number representing the distance
     */
    function findDistance(direction, el, el2) {
        var result = {};

        // The x distance between two rectangles
        function get_x_dist(el,el2) {
            var x;
            if (el.left > el2.right) {
                x = el2.right - el.left;
            } else if (el.right < el2.left) {
                x = el2.left - el.right;
            } else {
                x = el.centerx - el2.centerx;
            }
            return x;
        }

        // The y distance between two rectangles
        function get_y_dist(el,el2) {
            var y;
            if (el.top > el2.bottom) {
                y = el.top - el2.bottom;
            } else if (el.bottom < el2.top) {
                y = el.bottom - el2.top;
            } else {
                y = el.centery - el2.centery;
            }
            return y;
        }

        switch (direction) {
            case 'up':
                var y = el.top - el2.bottom;
                var x = get_x_dist(el,el2);
                break;
            case 'down':
                var y = el.bottom - el2.top;
                var x = get_x_dist(el,el2);
                break;
            case 'left':
                var x = el.left - el2.right;
                var y = get_y_dist(el,el2);
                break;
            case 'right':
                var x = el.right - el2.left;
                var y = get_y_dist(el,el2);
                break;
        }

        return x*x + y*y; // We do not sqrt that, as we just need a consistent value, not the exact distance
    }

    /**
     * Returns a list of all the Element object that are a match for a move to the specified
     * direction. This basically partitions the space in two halves.
     * @param currentElement The Element object to start the parition from
     * @param direction a string, "up", "down", "left", "right"
     * @returns {Array} an array of Element objects.
     */
    function partitionList(currentElement, direction) {
        var list = [];
        var all = elements;
        switch(direction) {
            case 'up':
                all.forEach(function(e) {
                    if (e.centery < currentElement.top) {
                        list.push(e);
                    }
                });
                break;
            case 'down':
                all.forEach(function(e) {
                    if (e.centery > currentElement.bottom) {
                        list.push(e);
                    }
                });
                break;
            case 'left':
                all.forEach(function(e) {
                    if (e.right < currentElement.centerx) {
                        list.push(e);
                    }
                });
                break;
            case 'right':
                all.forEach(function(e) {
                    if (e.left > currentElement.centerx) {
                        list.push(e);
                    }
                });
                break;
        }
        return list;
    }

    /**
     * Return the Element object that is currently the active (ie. focused) element of the document.
     * @returns {*} an Element instance, or undefined is none is active
     */
    function findCurrent() {
        return findFromDom(document.activeElement)
            || new Element(document.activeElement);
    }

    function findFromDom(domElement) {
        for (var i=0,max=elements.length; i<max; i+=1) {
            if (elements[i].domElementEquals(domElement)) {
                return elements[i];
            }
        }
        return undefined;
    }

    /**
     * Moves the focus to the direction requested.
     * @param direction a string, "up", "down", "left", "right"
     */
    function goToDirection(direction, element) {
        var cur = element?element:findCurrent();
        if (cur) {
            var nextElement = findClosest(direction, cur);
            if (nextElement !== undefined) {
                console.log(nextElement);
                nextElement.focus();
            }
        }
    }

    function expandDomNodeList(select) {
        var selectedNodes = [];
        if (document && typeof select == 'string') {
            select = document.querySelectorAll(select);
        }
        if (select instanceof NodeList) {
            for (var i=0;i<select.length; i+=1) {
                selectedNodes.push(select[i]);
            }
        } else {
            selectedNodes = selectedNodes.concat(select)
        }

        return selectedNodes;
    }

    /**
     * Installs the keyboard navigation on the window object, so that it can process the bubbling keydown event.
     * If 'select' is provided, it can be either a selector or a list of dom elements to install.
     */
    Nav.install = function(select) {
        Nav.register(select);

        window.addEventListener("keydown", function(e){
            var command = keyToCommand(e.which);
            console.log(e.which,command);
            switch (command) {
                case "up":
                case "down":
                case "left":
                case "right":

                    goToDirection(command);
                    e.stopPropagation();
                    break;
                case "trigger":
                    (function(){
                        var cur = findCurrent();
                        if (cur) {
                            cur.trigger();
                            e.stopPropagation();
                        }
                    })();
                break;
            }
        });
    };

    /**
     * Updates the positions of all the elements managed by the navigation system.
     * This should be called when the elements are moved, or resized.
     */
    Nav.updatePositions = function() {
        elements.forEach(function(el) {
            el.update();
        })
    };

    function register(domElement, triggerCallback, focusRequestCallback) {
        var element = new Element(domElement, triggerCallback, focusRequestCallback);
        elements.push(element);
        return element;
    }

    /**
     * Register an element with the navigation system, and makes it possible to received focus and activation
     * event dispatched from keyboard events.
     *
     * @TODO: Check the element is not registered already
     * @param domElement a dom element from the html page.
     * @param triggerCallback a function called when the element is triggered
     * @param focusRequestCallback a function called when the navigation system requests the element to get focus.
     * This callback can be ignored, unless the element needs to delegate the official focus to a child.
     */
    Nav.register = function(select, triggerCallback, focusRequestCallback, controls) {
        controls = controls || ["up", "down", "left", "right", "trigger"];
        if (typeof controls == "string") {
            controls = controls.split(',');
        }
        controls.forEach(function(e,i){
            controls[i] = controls[i].trim().toLowerCase();
        });

        expandDomNodeList(select).forEach(function(domElement) {
            register(domElement, triggerCallback, focusRequestCallback).installKeymap(controls);
        });

    };

    Nav.unregister = function(domElement) {
        for (var i= 0,max=elements.length; i<max; i+=1) {
            if (elements[i].domElementEquals(domElement)) {
                elements.splice(i,1);
                return;
            }
        }
    };

    /**
     * Request a change of focus in a given direction. Works even if the domElement provided is not a managed
     * element.
     *
     * @param domElement
     * @param direction a string, "up", "down", "left", or "right"
     */
    Nav.moveFrom = function(domElement, direction) {
        var element = findFromDom(domElement);
        goToDirection(direction, element);
    };

    Nav.setFocus = function(index) {
        index = index===undefined?0:index;
        if (index >=0 && index < elements.length && elements[index]) {
            elements[index].focus();
        }
    }

    return Nav;

})();
