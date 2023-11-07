// 这种模式对于复杂，多层嵌套的配置不友好，因为其没有类型推导和检查，
// 一个属性名错误就会造成运行时错误，而且没有提示

export default () => ({
  environment: process.env.NODE_ENV || 'development',
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
});
