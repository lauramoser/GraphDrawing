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
import {
  GraphMLAttribute,
  ILookup,
  INode,
  IRenderContext,
  MarkupExtension,
  NodeStyleBase,
  SvgVisual,
  TypeAttribute,
  YString
} from 'yfiles'
import { isColorSetName } from 'demo-resources/demo-styles'

/**
 * @typedef {Object} Sample2NodeStyleCache
 * @property {number} width
 * @property {number} height
 * @property {string} [cssClass]
 */

/**
 * The type of the type argument of the creatVisual and updateVisual methods of the style implementation.
 * @typedef {TaggedSvgVisual.<SVGRectElement,Sample2NodeStyleCache>} Sample2NodeStyleVisual
 */

/**
 * A custom demo node style whose colors match the given well-known CSS rule.
 */
export class Sample2NodeStyle extends NodeStyleBase {
  /**
   * @param {!(string|ColorSetName)} [cssClass]
   */
  constructor(cssClass) {
    super()
    this.cssClass = cssClass
  }

  /**
   * Creates the visual for a node.
   * @param {!IRenderContext} renderContext
   * @param {!INode} node
   * @returns {?Sample2NodeStyleVisual}
   */
  createVisual(renderContext, node) {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    const { x, y, width, height } = node.layout
    const nodeRounding = '3.5'

    rect.width.baseVal.value = width
    rect.height.baseVal.value = height
    rect.setAttribute('rx', nodeRounding)
    rect.setAttribute('ry', nodeRounding)
    rect.setAttribute('fill', '#FF6C00')
    rect.setAttribute('stroke', '#662b00')
    rect.setAttribute('stroke-width', '1.5px')

    if (this.cssClass) {
      const attribute = isColorSetName(this.cssClass) ? this.cssClass + '-node' : this.cssClass
      rect.setAttribute('class', attribute)
    }

    SvgVisual.setTranslate(rect, x, y)

    return SvgVisual.from(rect, {
      width,
      height,
      cssClass: this.cssClass
    })
  }

  /**
   * Re-renders the node by updating the old visual for improved performance.
   * @param {!IRenderContext} renderContext
   * @param {!Sample2NodeStyleVisual} oldVisual
   * @param {!INode} node
   * @returns {?Sample2NodeStyleVisual}
   */
  updateVisual(renderContext, oldVisual, node) {
    const rect = oldVisual.svgElement
    const cache = oldVisual.tag
    if (!cache) {
      return this.createVisual(renderContext, node)
    }

    const layout = node.layout
    const { x, y, width, height } = layout

    if (cache.width !== width) {
      rect.width.baseVal.value = width
      cache.width = width
    }
    if (cache.height !== height) {
      rect.height.baseVal.value = height
      cache.height = height
    }

    if (cache.cssClass !== this.cssClass) {
      if (this.cssClass) {
        const attribute = isColorSetName(this.cssClass) ? this.cssClass + '-node' : this.cssClass
        rect.setAttribute('class', attribute)
      } else {
        rect.removeAttribute('class')
      }
      cache.cssClass = this.cssClass
    }

    SvgVisual.setTranslate(rect, x, y)

    return oldVisual
  }
}

export class Sample2NodeStyleExtension extends MarkupExtension {
  _cssClass = ''

  /**
   * @type {!string}
   */
  get cssClass() {
    return this._cssClass
  }

  /**
   * @type {!string}
   */
  set cssClass(value) {
    this._cssClass = value
  }

  /**
   * @type {!object}
   */
  static get $meta() {
    return {
      cssClass: [GraphMLAttribute().init({ defaultValue: '' }), TypeAttribute(YString.$class)]
    }
  }

  /**
   * @param {!ILookup} serviceProvider
   * @returns {!Sample2NodeStyle}
   */
  provideValue(serviceProvider) {
    const style = new Sample2NodeStyle()
    style.cssClass = this.cssClass
    return style
  }
}
