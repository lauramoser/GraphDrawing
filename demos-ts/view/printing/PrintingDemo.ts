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
import { GraphComponent, GraphEditorInputMode, License } from 'yfiles'

import PrintingSupport from 'demo-utils/PrintingSupport'
import { applyDemoTheme, initDemoStyles } from 'demo-resources/demo-styles'
import { fetchLicense } from 'demo-resources/fetch-license'
import { finishLoading } from 'demo-resources/demo-page'
import { createSampleGraph } from './samples'
import { initializeExportRectangle } from './export-rectangle/export-rectangle'
import { initializeOptionPanel } from './option-panel/option-panel'
import { initializeToggleWebGl2RenderingButton } from './webgl-support'
import { retainAspectRatio } from './aspect-ratio'

async function run(): Promise<void> {
  License.value = await fetchLicense()

  // initialize the main graph component
  const graphComponent = new GraphComponent('graphComponent')
  graphComponent.inputMode = new GraphEditorInputMode()
  applyDemoTheme(graphComponent)
  initDemoStyles(graphComponent.graph)
  retainAspectRatio(graphComponent.graph)

  const printRect = initializeExportRectangle(graphComponent)

  initializeOptionPanel((options) => {
    const rect = options.usePrintRectangle ? printRect.toRect() : undefined

    const printingSupport = new PrintingSupport()
    printingSupport.scale = options.scale
    printingSupport.margin = options.margin
    printingSupport.tiledPrinting = options.useTilePrinting
    printingSupport.tileWidth = options.tileWidth
    printingSupport.tileHeight = options.tileHeight

    // start the printing process
    // this will open a new document in a separate browser window/tab and use
    // the javascript "print()" method of the browser to print the document.
    printingSupport.printGraph(graphComponent.graph, rect)
  })

  // wire up the export button
  initializeToggleWebGl2RenderingButton(graphComponent)

  // create a sample graph
  await createSampleGraph(graphComponent)
  graphComponent.fitGraphBounds()
}

void run().then(finishLoading)
