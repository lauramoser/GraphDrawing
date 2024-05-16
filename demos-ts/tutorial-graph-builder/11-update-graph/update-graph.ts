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
import type { GraphBuilder, NodesSource } from 'yfiles'
import type { Data, EntityData } from '../DataTypes'

export function setDataAndUpdateGraph(
  nodesSource: NodesSource<EntityData>,
  graphBuilder: GraphBuilder,
  data: Data
): void {
  // get the new data
  const newData = data.nodesSource.slice(0, 6)

  // assign the new data to the nodesSource
  graphBuilder.setData(nodesSource, newData)
  // tell GraphBuilder to update the graph structure
  graphBuilder.updateGraph()
}

let nodeTypes: Set<string>

export async function createDynamicNodesSource(
  graphBuilder: GraphBuilder,
  data: Data
): Promise<NodesSource<EntityData>> {
  nodeTypes = new Set(['Corporation', 'Trust'])

  function* nodes(): Generator<EntityData, void, unknown> {
    for (const entity of data.nodesSource) {
      if (entity.type && nodeTypes.has(entity.type)) {
        yield entity as EntityData
      }
    }
  }

  // create nodes source from dynamic data
  return graphBuilder.createNodesSource(nodes, 'id')
}

export function updateGraph(graphBuilder: GraphBuilder): void {
  // update displayed node types
  nodeTypes.delete('Corporation')
  nodeTypes.add('Branch')
  nodeTypes.add('PE_Risk')

  // since the nodesSource uses a generator function,
  // calling updateGraph is enough to update the graph structure
  graphBuilder.updateGraph()
}

export function resetGraph(graphBuilder: GraphBuilder): void {
  // reset node types
  nodeTypes = new Set(['Corporation', 'Trust'])
  graphBuilder.updateGraph()
}
