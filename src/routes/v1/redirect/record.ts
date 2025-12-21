import db from "@/lib/db";

export default async function record(
  ip: string,
  header: Record<string, string | undefined>,
  id: string
) {
  const referer = header["referer"] || null;
  const userAgent = header["user-agent"] || null;
  const headerJson = JSON.stringify(header || {});
  if (!ip && !userAgent) {
    return {
      status: 400,
      message: "No data to record",
    };
  }
  const dbClient = db.redirector.getConnection();
  if (!dbClient) {
    return {
      status: 500,
      message: "Database connection not available",
    };
  }
  try {
    await dbClient.execute(
      "UPDATE endpoint SET used = used + 1 WHERE `url` = ?",
      [id]
    );
    const rows = await dbClient.query(
      "INSERT INTO requests (`ip`, `string`, `referer`, `user_agent`, `to`) VALUES (?, ?, ?, ?, ?)",
      [ip || "", headerJson, referer, userAgent, id]
    );
    return {
      status: 200,
      data: rows,
    };
  } catch (err) {
    console.error("Error recording request:", err);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}
