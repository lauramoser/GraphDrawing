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
import { type Plugin, ViteDevServer } from 'vite'
import { SourceMapConsumer } from 'source-map'
import * as path from 'path'
import { red, underline } from 'kolorist'

/**
 * Replaced file urls in an error stack from a client by file urls pointing to the client's system
 * files and the original line and column indices.
 */
async function transformStack(server: ViteDevServer, mappedStack?: string): Promise<string> {
  if (!mappedStack) {
    return Promise.resolve('')
  }
  const lines = mappedStack.split(/\r?\n/)
  let result = ''
  for (const line of lines) {
    const fileUrlMatch = line.match(/^(.*?)(http.*?\.[j|t]s:[0-9]+:[0-9]+)(.*?)$/)
    if (fileUrlMatch !== null && fileUrlMatch.length === 4) {
      const originalFileUrl = await transformFileLocation(server, fileUrlMatch[2])
      if (originalFileUrl !== null) {
        result += `${fileUrlMatch[1]}${originalFileUrl}${fileUrlMatch[3]}`
      } else {
        result += line
      }
    } else {
      result += line
    }
    result += '\n'
  }
  return Promise.resolve(result)
}

/**
 * Transforms a file url containing a source-mapped location to the original file url on the client
 * with original line and column index (reversing the source mapping).
 */
async function transformFileLocation(
  server: ViteDevServer,
  fileUrlWithLocation: string
): Promise<string> {
  // try to extract line and column number
  const locationRegexp = /^(.*?)(?::(\d+):(\d+))?$/
  const match = fileUrlWithLocation.match(locationRegexp)
  if (!match || match.length !== 4) {
    // either unexpected format or no line/column location... do nothing
    return fileUrlWithLocation
  }

  const fileUrl = match[1]
  const lineIndex = Number(match[2])
  const columnIndex = Number(match[3])

  // make URLs clickable and pointing to the original line and column in the user code
  const localUrl = server.resolvedUrls.local[0]
  const systemFileUrl = path.join(server.config.root, new URL(fileUrl).pathname)

  try {
    const localFileUrl = fileUrl.replace(localUrl, server.config.base)
    const transformResult = await server.transformRequest(localFileUrl)
    const sourceMap = transformResult.map
    if (sourceMap) {
      // reverse source-mapping
      return SourceMapConsumer.with(sourceMap, null, consumer => {
        const { line: originalLineIndex, column: originalColumnIndex } =
          consumer.originalPositionFor({
            line: lineIndex,
            column: columnIndex
          })
        if (originalLineIndex !== null && originalColumnIndex !== null) {
          return `${systemFileUrl}:${originalLineIndex}:${originalColumnIndex}`
        } else {
          return `${systemFileUrl}:${lineIndex}:${columnIndex}`
        }
      })
    }
  } catch (e) {
    console.error(e)
  }

  return `${systemFileUrl}:${lineIndex}:${columnIndex}`
}

/**
 * The viewer/layout import error messages are not active in the complete package.
 */
// eslint-disable-next-line
const PACKAGE_DISTRIBUTION: string = 'Complete'
function isUnresolvedImportError({ name, message }: Error) {
  if (PACKAGE_DISTRIBUTION.toLowerCase() === 'complete') {
    return false
  }
  const missingExportInChrome = /.*?yfiles\.js.*?does not provide an export named/i.test(message)
  const missingExportInFirefox = /.*?ambiguous indirect export.*?/i.test(message)
  const missingExportInSafari = /importing binding name .*? not found/i.test(message)
  const missingExport = missingExportInChrome || missingExportInFirefox || missingExportInSafari
  return name === 'SyntaxError' && missingExport
}

function createUnresolvedImportErrorMessage({ name, message }: Error): string {
  return `${name}: ${message}

The import cannot be resolved.

Note that if you are using the yFiles for HTML Viewer distribution, you cannot import any layout or algorithm class.
Also, if you are using the yFiles for HTML Layout distribution, you cannot import any viewer related classes.
    `
}

/**
 * A vite plugin that displays runtime errors in the vite-error-overlay with clickable file locations.
 */
export const VitePluginRuntimeError: Plugin = {
  name: 'vite-plugin-runtime-error',
  apply({ mode }, { command }) {
    return mode === 'development' && command === 'serve'
  },
  configureServer(server) {
    server.ws.on('yfiles:stack-resolver', async ({ error }, client) => {
      if (isUnresolvedImportError(error)) {
        error.message = createUnresolvedImportErrorMessage(error)
        client.send('yfiles:stack-resolver-response', {
          transformedError: error
        })
        return
      }
      error.stack = await transformStack(server, error.stack)
      console.log(`  ${red('➜')}  ${red(underline('Error in Client Code'))}\n${red(error.stack)}\n`)
      client.send('yfiles:stack-resolver-response', { transformedError: error })
    })
  },
  transformIndexHtml(html) {
    return {
      html,
      tags: [
        {
          tag: 'script',
          injectTo: 'head',
          attrs: {
            type: 'module',
            src: '/tools/vite-plugin-runtime-error/vite-plugin-runtime-error-client.js'
          }
        }
      ]
    }
  }
}
