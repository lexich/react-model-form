module.exports = {
  stories: ['../stories/**/*.stories.tsx'],
  addons: ['@storybook/addon-actions', '@storybook/addon-links'],
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('ts-loader'),
        },
        {
          loader: require.resolve('react-docgen-typescript-loader'),
        },
      ],
    });



    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|svg)$/,
      use: 'url-loader'
    });

    config.resolve.extensions.push('.ts', '.tsx');
    return config;
  },
};
