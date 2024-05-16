import { defineConfig, type Plugin } from 'vite'
import { VitePluginRuntimeError } from './tools/vite-plugin-runtime-error/vite-plugin-runtime-error'
import topLevelPackageJson from './package.json'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

console.log('Dev Server for yFiles Demos')

const demoServerPlugin: Plugin = {
  name: 'vite-plugin-demo-server',

  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
      )
      res.setHeader('Access-Control-Expose-Headers', 'x-yfiles-for-html-dev-server')
      res.setHeader('x-yfiles-for-html-dev-server', topLevelPackageJson.version)

      if (req.url?.startsWith('/favicon.ico')) {
        req.url = '/demos-js/resources/icons/favicon.ico'
        next()
        return
      }

      if (req.url?.startsWith('/self-path')) {
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        })
        res.end(__dirname)
        return
      }

      if (req.url?.startsWith('/shutdown')) {
        console.log('Shutdown signal received, stopping...')
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        })
        res.end('OK')
        await server.close()
        return
      }

      // Serve lib/license for any license.json request that doesn't match an actual file
      if (req.url?.endsWith('/license.json')) {
        try {
          if (!existsSync(join(server.config.root, req.url))) {
            req.url = '/lib/license.json'
            next()
            return
          }
        } catch (ignored) {}
      }

      // Display the readme as default for some directories
      if (['/', '/demos-ts/', '/demos-js/', '/demos-ts/'].includes(req.url!)) {
        req.url = `${req.url}README.html`
      }

      next()
    })
  }
}

const envPort = Number(process.env.DEMO_SERVER_PORT)

export default defineConfig({
  root: __dirname,
  base: './',
  resolve: {
    extensions: ['.ts', '.js']
  },
  server: {
    port: isNaN(envPort) ? 4242 : envPort,
    strictPort: true,
    hmr: {
      overlay: true
    }
  },
  plugins: [demoServerPlugin, VitePluginRuntimeError],
  optimizeDeps: {
    // ignore files in standalone demos style/vue-component-node-style and toolkit/vue
    exclude: ['vue', 'vuetify', '@mdi', '@/components', '@/composables']
  }
})
