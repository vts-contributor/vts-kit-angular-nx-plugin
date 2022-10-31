const { merge } = require('webpack-merge');

module.exports = (config, context) => {
  return merge(config, {
    // overwrite values here
    module: {
      rules: [
        {
          test: /\.less$/,
          loader: 'less-loader',
          options: {
            lessOptions: {
              javascriptEnabled: true,
            },
          },
        },
      ],
    },
  });
};
