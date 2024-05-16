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
/// <reference types="vite/client" />

import fastGlob from 'fast-glob'
import fs from 'fs-extra'
import path from 'node:path'
import { URL } from 'node:url'
import { createLogger, defineConfig, type UserConfig } from 'vite'
import copy from 'rollup-plugin-copy'
import replace, { type RollupReplaceOptions } from '@rollup/plugin-replace'
import { demoDeploymentPlugin } from './demo-deployment-plugin'

export const getCopyTargets: (
  rootDir: string
) => Promise<NonNullable<Parameters<typeof copy>[0]>['targets']> = async (rootDir) => {
  const resourceFiles = await fastGlob(
    [
      'demos(-js|-ts|)/**/*.(css|svg|graphml|png|json|bpmn|jpg)',
      'demos(-js|-ts|)/view/printing/printdocument.html',
      'demos(-js|-ts|)/resources/*.js',
      'doc/readme-style.*',
      'doc/readme/resources/*'
    ],
    {
      ignore: ['**/node_modules/**'],
      absolute: false,
      cwd: rootDir
    }
  )

  const readmeFiles = await fastGlob(['demos(-js|-ts|)/**/README.html', 'README.html'], {
    cwd: rootDir
  })

  const r = (p: string): string => path.posix.join(rootDir, p)

  const indexTransform = (contents: Buffer, filename: string) =>
    demoDeploymentPlugin().transformIndexHtml.handler(contents.toString(), {
      path: filename,
      filename
    })

  return [
    ...resourceFiles.map((resourceFile) => ({
      src: r(resourceFile),
      dest: r(path.dirname(`/dist/${resourceFile}`))
    })),
    ...readmeFiles.map((readmeFile) => ({
      src: r(readmeFile),
      dest: r(path.dirname(`/dist/${readmeFile}`)),
      transform: indexTransform
    })),
    ...readmeFiles.map((readmeFile) => ({
      src: r(readmeFile),
      dest: r(path.dirname(`/dist/${readmeFile}`)),
      transform: indexTransform,
      rename: 'index.html'
    }))
  ]
}

const getDemoFiles: (rootDir: string) => Promise<string[]> = async (rootDir: string) => {
  return (
    await fastGlob(['./demos(-js|-ts|)/**/index.html'], {
      ignore: [],
      absolute: true,
      deep: 4, // Number of dirs + index.html
      cwd: rootDir
    })
  ).filter((filename) => !containsPackageJson(filename))
}

export default defineConfig(async ({}) => {
  const rootDir = '../..'

  const replaceBasicDemoLicense: RollupReplaceOptions = {
    include: ['**/basic-demo.(t|j)s'],
    delimiters: ['\\s', '[\\s;]'],
    preventAssignment: false,
    values: {
      "fetch('./license.json')": " fetch('../../../lib/license.json')",
      'fetch("./license.json")': " fetch('../../../lib/license.json')"
    }
  }

  const demoFilenames = await getDemoFiles(rootDir)
  if (demoFilenames.length === 0) {
    throw new Error(`Cannot find any demos at ${getAbsolutePathName(rootDir, '.')}`)
  } else {
    console.log(`Number of demo files: ${demoFilenames.length}`)
  }

  const config: UserConfig = {
    root: rootDir,
    base: './',
    build: {
      target: 'esnext',
      sourcemap: true,
      minify: false,
      rollupOptions: {
        input: getInputConfig(demoFilenames),
        plugins: [
          replace(replaceBasicDemoLicense),
          copy({ targets: await getCopyTargets(rootDir), hook: 'writeBundle' })
        ]
        // To disable hashing, use the following lines
        // output: {
        //   entryFileNames: `assets/[name].js`,
        //   chunkFileNames: `assets/[name].js`,
        //   assetFileNames: `assets/[name].[ext]`,
        // },
      }
    },
    optimizeDeps: {
      noDiscovery: true,
      include: []
    },
    plugins: [demoDeploymentPlugin()],
    customLogger: createCustomLogger(),
    logLevel: 'warn'
  }
  return config
})

/**
 * Builds the config object for rollupOptions.input for the given list of demo files.
 * Just specifying the files would work, too, but this way, the chunks get slightly nicer names.
 */
function getInputConfig(demoFiles: string[]): Record<string, string> {
  return demoFiles.reduce((obj, filename) => {
    const dirs = filename.split('/')
    const type = dirs.at(-4)!.endsWith('-ts') ? 'ts' : 'js'
    obj[`${dirs.at(-3)!}_${dirs.at(-2)}_${type}`] = filename
    return obj
  }, Object.assign({}))
}

/**
 * This is a replacement for resolve(__dirname, relPathName)
 */
function getAbsolutePathName(rootDir: string, relPathName: string) {
  return new URL(`${rootDir}/${relPathName}`, import.meta.url).pathname
}

/**
 * Returns whether the directory of the given file contains a package.json.
 */
function containsPackageJson(filePath: string, verbose = false): boolean {
  const dirName = path.dirname(filePath)
  const exists = fs.existsSync(`${dirName}/package.json`)
  if (exists && verbose) {
    console.log(`Found package.json in ${dirName}`)
  }
  return exists
}

function createCustomLogger() {
  const sameMessageThreshold = 6

  const logger = createLogger()
  const loggerWarn = logger.warn
  const counts = { mixedAsyncDefer: 0, localStorageScript: 0 }

  logger.warn = (msg, options) => {
    if (msg.includes('Mixed async and defer script modules')) {
      counts.mixedAsyncDefer++
      if (counts.mixedAsyncDefer === sameMessageThreshold) {
        loggerWarn(
          '\nMixed async and defer script modules in more files. Skipping additional log messages.',
          options
        )
      }
      if (counts.mixedAsyncDefer >= sameMessageThreshold) {
        return
      }
    }
    if (
      msg.includes('can\'t be bundled without type="module" attribute') &&
      msg.includes('node_modules/yfiles-umd')
    ) {
      // We get a warning for the main demo file, too, and don't need these warnings for the lib files
      return
    }
    if (msg.includes('/apply-local-storage-variables.js"> in')) {
      counts.localStorageScript++
      if (counts.localStorageScript === sameMessageThreshold) {
        loggerWarn(
          `File 'apply-local-storage-variables.js' included in more files. Skipping additional log messages.`,
          options
        )
      }
      if (counts.localStorageScript >= sameMessageThreshold) {
        return
      }
    }
    loggerWarn(msg, options)
  }
  return logger
}
