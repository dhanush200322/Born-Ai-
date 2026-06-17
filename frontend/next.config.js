const path = require('path')

module.exports = {
  turbopack: {
    // Ensure Turbopack uses this project folder as the workspace root
    root: path.resolve(__dirname),
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ]
  },
}
