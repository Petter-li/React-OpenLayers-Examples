module.exports = {
  parser: 'babel-eslint',
  //extends: ['airbnb', 'prettier', 'plugin:compat/recommended'],
  extends: "eslint-config-umi",
  rules: {
    "no-new": 0,//禁止在使用new构造一个实例后不赋值
  },
};
