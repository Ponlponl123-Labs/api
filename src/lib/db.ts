import mariadb from "mariadb";

class MariaDB {
  public name: string;
  private connection: mariadb.Pool;

  constructor(
    name: string,
    host: string,
    user: string,
    password: string,
    database: string,
    autoConnect: boolean = false
  ) {
    this.name = name;
    this.connection = mariadb.createPool({
      host: host,
      user: user,
      password: password,
      database: database,
      connectionLimit: 5,
    });
    if (autoConnect) {
      this.connect();
    }
  }

  private async testConnection() {
    try {
      const conn = await this.connection.getConnection();
      console.log(`MariaDB connected (${this.name}):`, conn.threadId);
      conn.release();
    } catch (err) {
      console.error(`Error connecting to MariaDB (${this.name}):`, err);
    }
  }

  public async connect() {
    await this.testConnection();
  }

  public getConnection() {
    return this.connection;
  }
}

export const databases = {
  central: new MariaDB(
    "central",
    process.env.DB_HOST_CT || "localhost",
    process.env.DB_USER_CT || "root",
    process.env.DB_PASS_CT || "",
    process.env.DB_NAME_CT || "central_db",
    true
  ),
  redirector: new MariaDB(
    "redirector",
    process.env.DB_HOST_RT || "localhost",
    process.env.DB_USER_RT || "root",
    process.env.DB_PASS_RT || "",
    process.env.DB_NAME_RT || "redirector_db",
    true
  ),
};

export default databases;
