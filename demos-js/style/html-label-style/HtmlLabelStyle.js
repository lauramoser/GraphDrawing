/****************************************************************************
 ** @license
 ** This demo file is part of yFiles for HTML 2.6.0.4.
 ** Copyright (c) 2000-2024 by yWorks GmbH, Vor dem Kreuzberg 28,
 ** 72070 Tuebingen, Germany. All rights reserved.
 **
 ** yFiles demo files exhibit yFiles for HTML functionalities. Any redistribution
 ** of demo files in source code or binary form, with or without
 ** modification, is not permitted.
 **
 ** Owners of a valid software license for a yFiles for HTML version that this
 ** demo is shipped with are allowed to use the demo source code as basis
 ** for their own yFiles for HTML powered applications. Use of such programs is
 ** governed by the rights and conditions as set out in the yFiles for HTML
 ** license agreement.
 **
 ** THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESS OR IMPLIED
 ** WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 ** MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN
 ** NO EVENT SHALL yWorks BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 ** SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 ** TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 ** PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 ** LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 ** NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 ** SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 **
 ***************************************************************************/
import { HtmlVisual, LabelStyleBase, OrientedRectangle, Size } from 'yfiles'

/**
 * @typedef {Object} Cache
 * @property {OrientedRectangle} layout
 * @property {string} text
 * @property {Font} font
 */

/**
 * @typedef {*} CachingHtmlElement
 */

/**
 * A label style which displays HTML markup as label text.
 */
export default class HtmlLabelStyle extends LabelStyleBase {
  /** 
   *
     * A (shared) event listener that just stops event propagation.
     
  * @type {function(*)}
   */
  static get stopPropagationAlwaysListener() {
    if (typeof HtmlLabelStyle.$stopPropagationAlwaysListener === 'undefined') {
      HtmlLabelStyle.$stopPropagationAlwaysListener = (evt) => {
        evt.stopImmediatePropagation()
      }
    }

    return HtmlLabelStyle.$stopPropagationAlwaysListener
  }

  /**
   * Creates a new instance of the HTMLLabelStyle class.
   * @param {!Font} font The font used for rendering the label text.
   */
  constructor(font) {
    super()
    this.font = font
  }

  /**
   * Creates an HTML-based visual to display an HTML-formatted text.
   * @see Overrides {@link LabelStyleBase.createVisual}
   * @param {!IRenderContext} context
   * @param {!ILabel} label
   * @returns {!HtmlVisual}
   */
  createVisual(context, label) {
    const layout = label.layout

    const htmlElement = document.createElement('div')

    this.updateElement(htmlElement, {
      text: label.text,
      font: this.font,
      layout: new OrientedRectangle(layout)
    })

    const stopPropagationOptions = { capture: true, passive: true }

    // Prevent event propagation for the mousewheel event.
    // Otherwise, it will be captured by the graph component, which calls preventDefault on it.
    for (const eventName of ['mousewheel', 'wheel']) {
      htmlElement.addEventListener(
        eventName,
        HtmlLabelStyle.createStopPropagationListenerForScrolling(htmlElement.firstElementChild),
        stopPropagationOptions
      )
    }

    // Prevent event propagation for the click event.
    // Otherwise, it will be captured by the graph component, which calls preventDefault on it.
    htmlElement.querySelectorAll('a').forEach((element) => {
      element.addEventListener(
        'click',
        HtmlLabelStyle.stopPropagationAlwaysListener,
        stopPropagationOptions
      )
    })

    // Move the element to the correct location
    LabelStyleBase.createLayoutTransform(context, layout, true).applyTo(htmlElement)

    return new HtmlVisual(htmlElement)
  }

  /**
   * Updates the HTML-based visual to display an HTML-formatted text.
   * @see Overrides {@link LabelStyleBase.updateVisual}
   * @param {!IRenderContext} context
   * @param {!HtmlVisual} oldVisual
   * @param {!ILabel} label
   * @returns {!HtmlVisual}
   */
  updateVisual(context, oldVisual, label) {
    const element = oldVisual.element
    if (!(element instanceof HTMLElement)) {
      // Re-create from scratch if the visual isn't as expected
      return this.createVisual(context, label)
    }

    this.updateElement(element, {
      text: label.text,
      font: this.font,
      layout: new OrientedRectangle(label.layout)
    })

    // Move the element to the correct location
    LabelStyleBase.createLayoutTransform(context, label.layout, true).applyTo(element)

    return oldVisual
  }

  /**
   * Updates the given element to match the given data.
   *
   * If the element comes with cached data, only the different parts are updated.
   * @param {!CachingHtmlElement} element
   * @param {!Cache} newData
   */
  updateElement(element, newData) {
    // Get the data that describes the current state of the element
    const currentData = element.cache ?? {
      text: null,
      font: null,
      layout: null
    }

    if (currentData.layout?.width !== newData.layout.width) {
      element.style.width = `${newData.layout.width}px`
    }
    if (currentData.layout?.height !== newData.layout.height) {
      element.style.height = `${newData.layout.height}px`
    }

    if (!currentData.font || !currentData.font.equals(newData.font)) {
      element.style.fontFamily = this.font.fontFamily
      element.style.fontSize = `${this.font.fontSize}px`
      element.style.fontWeight = `${this.font.fontWeight}`
      element.style.fontStyle = `${this.font.fontStyle}`
    }

    if (currentData.text !== newData.text) {
      element.innerHTML = newData.text
    }

    // Update the cache
    element.cache = newData
  }

  /**
   * Returns the preferred size of the label.
   * @see Overrides {@link LabelStyleBase.getPreferredSize}
   * @param {!ILabel} label The label to which this style instance is assigned.
   * @returns {!Size} The preferred size.
   */
  getPreferredSize(label) {
    const div = document.createElement('div')
    div.style.setProperty('display', 'inline-block')
    div.innerHTML = label.text
    document.body.appendChild(div)
    const clientRect = div.getBoundingClientRect()
    document.body.removeChild(div)
    return new Size(clientRect.width, clientRect.height)
  }

  /**
   * Detects whether the given element has the need for a scrollbar, i.e., it shows as scrollbar
   * in overflow: auto mode.
   * @param {!Element} element
   * @returns {boolean}
   */
  static needsScrollbar(element) {
    const isVerticalScrollbar = element.scrollHeight > element.clientHeight
    const isHorizontalScrollbar = element.scrollWidth > element.clientWidth
    return isHorizontalScrollbar || isVerticalScrollbar
  }

  /**
   * Returns an event listener that stops event propagation if the element can be scrolled itself.
   * @param {!Element} element
   * @returns {!function}
   */
  static createStopPropagationListenerForScrolling(element) {
    return (evt) => {
      if (HtmlLabelStyle.needsScrollbar(element)) {
        evt.stopImmediatePropagation()
      }
    }
  }
}
