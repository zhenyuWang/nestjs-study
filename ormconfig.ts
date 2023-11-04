// TypeORM configuration file
// database migration

import { DataSource } from 'typeorm';

// 控制台执行 npx typeorm migration:create path-to-migrations-dir/migrationName
// 创建迁移文件
// npx typeorm migration:run -- -d path-to-datasource-config 进行迁移

// 这个迁移太坑了，暴露的对象必须是 DataSource 实例，而不能是 ormconfig.js 中的普通对象
// 因此执行命令是 npx typeorm-ts-node-commonjs migration:run -d ormconfig.ts

// 同理，revert 命令是： npx typeorm-ts-node-commonjs migration:revert -d ormconfig.ts
// px typeorm -ts-node-commonjs migration:generate src/migrations/SchemaSync -d ormconfig.ts

export default new DataSource({
  migrationsTableName: 'migrations',
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'pass123',
  database: 'postgres',
  entities: ['src/**/**.entity{.ts,.js}'],
  migrations: ['src/migrations/**/*{.ts,.js}'],
});
