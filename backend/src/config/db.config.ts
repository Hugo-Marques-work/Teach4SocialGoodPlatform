import { defConsts } from "@/defConsts";

export default {
    HOST: defConsts.processEnv.DB_HOST,
    USER: defConsts.processEnv.DB_USER,
    PASSWORD: defConsts.processEnv.DB_PASSWORD,
    DB: defConsts.processEnv.DB_NAME,
    dialect: "mysql",
    charset: 'utf8',
    collate: 'utf8_general_ci',
    socketPath: '/var/run/mysqld/mysqld.sock',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };