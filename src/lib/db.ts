import mariadb from "mariadb";

class MariaDB {
  private connection: mariadb.Pool;

  constructor(autoConnect: boolean = false) {
    this.connection = mariadb.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectionLimit: 5,
    });
    if (autoConnect) {
      this.connect();
    }
  }

  private async testConnection() {
    try {
      const conn = await this.connection.getConnection();
      console.log("MariaDB connected:", conn.threadId);
      conn.release();
    } catch (err) {
      console.error("Error connecting to MariaDB:", err);
    }
  }

  public async connect() {
    await this.testConnection();
  }

  public getConnection() {
    return this.connection;
  }
}

export const db = new MariaDB();

export default db;
