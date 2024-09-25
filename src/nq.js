/**
 * @typedef {Object} Query - The nq library namespace.
 * @property {function} addClass - Adds one or more class names to the element.
 * @property {function} after - Inserts content after the element as a sibling.
 * @property {function} append - Inserts content as the last child of the element.
 * @property {function} attr - Sets or gets an attribute on the element.
 * @property {function} before - Inserts content before the element as a sibling.
 * @property {function} html - Sets or gets the HTML content of the element.
 * @property {function} off - Removes an event listener from the element.
 * @property {function} on - Attaches an event listener to the element.
 * @property {function} one - Attaches a listener to be triggered once for a specified event.
 * @property {function} prepend - Inserts content as the first child of the element.
 * @property {function} remove - Removes the element from the DOM.
 * @property {function} removeClass - Removes one or more class names from the element.
 * @property {function} serialize - Serialize form elements to a URL-encoded string
 * @property {function} serializeArray - Serialize form elements to an array of name/value pairs
 * @property {function} text - Sets or gets the text content of the element.
 * @property {function} toggleClass - Toggles a class name on the element.
 */
export default nq

/**
 * Helper to check if input is an HTML string
 *
 * @param {string|HTMLElement} input 
 * @returns {boolena}
 */
function isHTMLString(input) {
  return typeof input === 'string' && input.trim().startsWith('<') && input.trim().endsWith('>')
}

/**
 * nq constructor
 *
 * @param {string|HTMLElement} selector 
 * @returns {Query}
 */
function nq(selector) {
  if (typeof selector === 'string') {
    return new Query(document.querySelectorAll.call(document, selector))
  }

  if (selector instanceof HTMLElement
    || selector instanceof NodeList
    || selector instanceof HTMLCollection
  ) {
    return new Query(selector.tagName === 'FORM' ? selector.elements : selector)
  }
}

/**
 * nq constructor to handle node lists and chaining
 *
 * @param {HTMLElement[]} nodes 
 */
function Query(nodes) {
  this.nodes = nodes.length === 1 ? [nodes[0]] : Array.from(nodes)
}

// Add event listener to elements
Query.prototype = {
  // Utility to add a class
  addClass: function (className) {
    for (const node of this.nodes) {
      node.classList.add(className)
    }

    return this
  },

  /**
   * Insert new elements after each selected element
   * 
   * @param {string|HTMLElement} input
   * @param {Record<string, string|number|null>} [attributes]
   * @returns {this}
   */
  after: function (input, attributes) {
    for (const node of this.nodes) {
      if (isHTMLString(input)) {
        node.insertAdjacentHTML('afterend', input)
      } else if (typeof input === 'string') {
        const newElement = document.createElement(input)

        if (attributes) {
          for (const attr in attributes) {
            newElement.setAttribute(attr, attributes[attr])
          }
        }

        node.parentNode.insertBefore(newElement, node.nextSibling)
      }
    }

    return this
  },

  /**
   * Append new elements as the last child of each selected element
   *
   * @param {string|HTMLElement} input
   * @param {Record<string, string|number|null>} [attributes]
   * @returns {this}
   */
  append: function (input, attributes) {
    for (const parentNode of this.nodes) {
      if (isHTMLString(input)) {
        // Insert HTML string
        parentNode.insertAdjacentHTML('beforeend', input)
      } else if (typeof input === 'string') {
        // Create element using tagName and attributes
        const newElement = document.createElement(input)

        if (attributes) {
          for (const attr in attributes) {
            newElement.setAttribute(attr, attributes[attr])
          }
        }

        parentNode.appendChild(newElement)
      }
    }

    return this
  },

  /**
   * Utility to set or get attribute
   * 
   * @param {string} attr 
   * @param {string|number|null} value 
   * @returns {string|number|null}
   */
  attr: function (attr, value) {
    if (value !== undefined) {
      for (const node of this.nodes) {
        node.setAttribute(attr, value)
      }

      return this
    } else {
      return this.nodes.length ? this.nodes[0].getAttribute(attr) : null
    }
  },

  /**
   * Insert new elements before each selected element
   *
   * @param {string|HTMLElement} input
   * @param {Record<string, string|number|null>} [attributes]
   * @returns {this}
   */
  before: function (input, attributes) {
    for (const node of this.nodes) {
      if (isHTMLString(input)) {
        node.insertAdjacentHTML('beforebegin', input)
      } else if (typeof input === 'string') {
        const newElement = document.createElement(input)

        if (attributes) {
          for (const attr in attributes) {
            newElement.setAttribute(attr, attributes[attr])
          }
        }

        node.parentNode.insertBefore(newElement, node)
      }
    }

    return this
  },

  /**
   * Utility to get/set inner HTML
   * 
   * @param {string} content 
   * @returns {this|string|null}
   */
  html: function (content) {
    if (content !== undefined) {
      for (const node of this.nodes) {
        node.innerHTML = content
      }

      return this
    } else {
      return this.nodes.length ? this.nodes[0].innerHTML : null
    }
  },

  /**
   * Remove event listener from elements
   *
   * @param {string} event
   * @param {(event: eventObject) => void} listener
   * @param {boolean | EventListenerOptions} options
   * @returns {this}
   */
  off: function (event, listener, options) {
    for (const node of this.nodes) {
      node.removeEventListener(event, listener, options || false)
    }

    return this
  },

  /**
   * Add an event handler function for one event to the selected element.
   * 
   * @param {string} event
   * @param {(event: eventObject) => void} listener
   * @param {boolean | EventListenerOptions} options
   * @returns {this}
   */
  on: function (event, handler, options) {
    for (const node of this.nodes) {
      node.addEventListener(event, handler, options || false)
    }

    return this
  },

  /**
   * Add event listener for one-time events
   * 
   * @param {string} event
   * @param {(event: eventObject) => void} listener
   * @param {boolean | EventListenerOptions} options
   * @returns {this}
   */
  one: function (event, handler, options) {
    const self = this

    function oneTimeHandler(event) {
      handler.call(this, event)
      self.off(event.type, oneTimeHandler, options) // Remove after one execution
    }

    return this.on(event, oneTimeHandler, options) // Chainable
  },

  /**
   * Prepend new elements as the first child of each selected element
   * 
   * @param {string|HTMLElement} input
   * @param {Record<string, string|number|null>} [attributes]
   * @returns {this}
   */
  prepend: function (input, attributes) {
    for (const parentNode of this.nodes) {
      if (isHTMLString(input)) {
        parentNode.insertAdjacentHTML('afterbegin', input)
      } else if (typeof input === 'string') {
        const newElement = document.createElement(input)

        if (attributes) {
          for (const attr in attributes) {
            newElement.setAttribute(attr, attributes[attr])
          }
        }

        parentNode.insertBefore(newElement, parentNode.firstChild)
      }
    }

    return this
  },

  /**
   * Remove the current elements from the DOM
   *
   * @returns {this}
   */
  remove: function () {
    for (const node of this.nodes) {
      if (node.parentNode) {
        node.parentNode.removeChild(node)
      }
    }

    return this
  },

  /**
   * Utility to remove a class
   *
   * @param {string} className 
   * @returns {this}
   */
  removeClass: function (className) {
    for (const node of this.nodes) {
      node.classList.remove(className)
    }

    return this
  },

  /**
   * Serialize form elements to a URL-encoded string
   *
   * @returns {string}
   */
  serialize: function () {
    var formElements = [];

    for (const element of this.nodes) {
      if (element.name && !element.disabled && ['file', 'reset', 'submit', 'button'].indexOf(element.type) === -1) {
        if (element.type === 'select-multiple') {
          for (const option of element.options) {
            if (option.selected) {
              formElements.push(encodeURIComponent(element.name) + '=' + encodeURIComponent(option.value));
            }
          }
        } else if ((element.type !== 'checkbox' && element.type !== 'radio') || element.checked) {
          formElements.push(encodeURIComponent(element.name) + '=' + encodeURIComponent(element.value));
        }
      }
    }

    return formElements.join('&'); // Return URL-encoded string
  },

  /**
   * Serialize form elements to an array of name/value pairs
   * 
   * @returns {Array<Record<string, string>>}
   */
  serializeArray: function () {
    var formArray = []

    for (const element of this.nodes) {
      if (element.name && !element.disabled && ['file', 'reset', 'submit', 'button'].indexOf(element.type) === -1) {
        if (element.type === 'select-multiple') {
          for (const option of element.options) {
            if (option.selected) {
              formArray.push({ name: element.name, value: option.value })
            }
          }
        } else if ((element.type !== 'checkbox' && element.type !== 'radio') || element.checked) {
          formArray.push({ name: element.name, value: element.value })
        }
      }
    }

    return formArray // Return array of name/value pairs
  },

  /**
   * Utility to get/set inner Text
   * 
   * @param {string} [content]
   * @returns {this|string|undefined}
   */
  text: function (content) {
    if (content !== undefined) {
      for (const node of this.nodes) {
        node.innerText = content
      }

      return this
    } else {
      return this.nodes.length ? this.nodes[0].innerText : null
    }
  },

  /**
   * Utility to toggle a class
   * 
   * @param {string} className 
   * @returns {this}
   */
  toggleClass: function (className) {
    for (const node of this.nodes) {
      node.classList.toggle(className)
    }

    return this
  },
}
