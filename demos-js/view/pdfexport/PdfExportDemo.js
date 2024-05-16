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
import { applyDemoTheme, initDemoStyles } from 'demo-resources/demo-styles'
import { fetchLicense } from 'demo-resources/fetch-license'
import { finishLoading } from 'demo-resources/demo-page'
import { createSampleGraph } from './samples.js'
import { initializeExportRectangle } from './export-rectangle/export-rectangle.js'
import { initializeToggleWebGl2RenderingButton } from './webgl-support.js'
import './option-panel/option-panel.css'
import { initializeOptionPanel } from './option-panel/option-panel.js'
import { initializeExportDialog, showExportDialog } from './export-dialog/export-dialog.js'
import { initializeServerSideExport } from './server-side-export.js'
import { exportPdfServerSide, NODE_SERVER_URL } from './pdf-export-server-side.js'
import { exportPdfClientSide } from './pdf-export-client-side.js'
import { retainAspectRatio } from './aspect-ratio.js'
import { downloadFile } from 'demo-utils/file-support'
import { loadExternalFonts } from './load-external-fonts.js'

/**
 * @returns {!Promise}
 */
async function run() {
  License.value = await fetchLicense()

  if (window.location.protocol === 'file:') {
    alert(
      'This demo features image export with inlined images. ' +
        'Due to the browsers security settings, images cannot be inlined if the demo is started from the file system. ' +
        'Please start the demo from a web server.'
    )
  }

  // initialize the main graph component
  const graphComponent = new GraphComponent('graphComponent')
  graphComponent.inputMode = new GraphEditorInputMode()
  applyDemoTheme(graphComponent)
  initDemoStyles(graphComponent.graph)
  retainAspectRatio(graphComponent.graph)

  const exportRect = initializeExportRectangle(graphComponent)

  let pdf = ''

  initializeOptionPanel(async (options) => {
    const rect = options.useExportRectangle ? exportRect.toRect() : undefined

    if (options.serverExport) {
      await exportPdfServerSide(graphComponent, options.scale, options.margin, rect)
    } else {
      const { pdfData, previewElement } = await exportPdfClientSide(
        graphComponent,
        options.scale,
        options.margin,
        options.paperSize,
        rect,
        await loadExternalFonts()
      )
      pdf = pdfData
      showExportDialog(previewElement)
    }
  })

  initializeExportDialog('Client-side PDF Export', () => {
    try {
      downloadFile(pdf, 'graph.pdf')
    } catch (e) {
      alert(
        'Saving directly to the filesystem is not supported by this browser. Please use the server based export instead.'
      )
    }
  })

  // initialize server-side export in a non-blocking way
  initializeServerSideExport(NODE_SERVER_URL)

  // wire up the button to toggle webgl rendering
  initializeToggleWebGl2RenderingButton(graphComponent)

  // create a sample graph
  await createSampleGraph(graphComponent)
  graphComponent.fitGraphBounds()
}

void run().then(finishLoading)
