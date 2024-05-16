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
window.addEventListener('error', e => {
  const error = e.error
  const ErrorOverlay = customElements.get('vite-error-overlay')
  if (!ErrorOverlay) {
    return
  }
  if (import.meta && import.meta.hot) {
    import.meta.hot.send('yfiles:stack-resolver', {
      error: { name: error.name, cause: error.cause, stack: error.stack, message: error.message }
    })
    import.meta.hot.on('yfiles:stack-resolver-response', response => {
      const {
        name: transformedName,
        message: transformedMessage,
        cause: transformedCause,
        stack: transformedStack
      } = response.transformedError
      const sourceMappedError = new Error()
      sourceMappedError.name = transformedName
      sourceMappedError.message = transformedMessage
      sourceMappedError.cause = transformedCause
      sourceMappedError.stack = transformedStack
      const overlay = new ErrorOverlay(sourceMappedError)
      document.body.appendChild(overlay)
    })
  } else {
    const overlay = new ErrorOverlay(error)
    document.body.appendChild(overlay)
  }
})
