const { merge } = require('webpack-merge');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (config, context) => {
  return merge(config, {
    // overwrite values here
    plugins: [
      ...(process.env.ANALYZE
        ? [
            new BundleAnalyzerPlugin({
              analyzerMode: 'server',
              analyzerHost: '127.0.0.1',
              analyzerPort: 8002,
            }),
          ]
        : []),
    ],
  });
};
