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
  GraphComponent,
  License,
  NodeStylePortStyleAdapter,
  ShapeNodeStyle,
  Size
} from 'yfiles'
import { fetchLicense } from 'demo-resources/fetch-license'
import {
  createSimpleGraph,
  enableGraphEditing,
  fitGraphBounds,
  initializeLabelModel,
  initializeTutorialDefaults
} from '../common'
import { CustomEdgeStyle as OldCustomEdgeStyle } from '../01-create-a-polyline/CustomEdgeStyle'

import { finishLoading } from 'demo-resources/demo-page'
import { CustomEdgeStyle } from './CustomEdgeStyle'
import { initializeInlineGraphComponent } from '../../tutorial-style-implementation-node/common'

License.value = await fetchLicense()

const graphComponent = new GraphComponent('#graphComponent')
initializeTutorialDefaults(graphComponent)
initializeLabelModel(graphComponent)
graphComponent.graph.edgeDefaults.style = new CustomEdgeStyle()
createSimpleGraph(graphComponent, false)
enableGraphEditing(graphComponent)
fitGraphBounds(graphComponent)

const oldState = initializeInlineGraphComponent('#old-state')
oldState.graph.edgeDefaults.style = new OldCustomEdgeStyle()
const portStyle = new NodeStylePortStyleAdapter(
  new ShapeNodeStyle({
    shape: 'ellipse',
    fill: 'gray'
  })
)
portStyle.renderSize = new Size(5, 5)
oldState.graph.nodeDefaults.ports.style = portStyle
createSimpleGraph(oldState, false)
oldState.zoomTo(oldState.graph.nodes.first().layout.toRect().getEnlarged(10))

finishLoading()