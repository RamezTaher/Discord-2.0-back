declare namespace NodeJS {
  export interface ProcessEnv {
    MYSQL_HOST?: string;
    MYSQL_BD?: string;
    MYSQL_PORT?: string;
    MYSQL_PASSWORD?: string;
    MYSQL_USER?: string;
    COOKIE_SECRET: string;
  }
}
