module.exports = function(api) {
  //実行元がjestかrollupかを判定。
  const isTest = api.env("test");
  api.cache(true);

  const rollupPresets = [
    [
      "@babel/preset-env",
      {
        modules: false
      }
    ]
  ];
  const testPresets = [
    [
      "@babel/preset-env",
      {
        targets: {
          node: true
        }
      }
    ]
  ];
  const presets = isTest ? testPresets : rollupPresets;

  const plugins = [];

  return {
    presets,
    plugins
  };
};
