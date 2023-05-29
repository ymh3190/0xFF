import mysql from "mysql2/promise";

export default mysql.createConnection({
  host: "localhost",
  user: "admin",
  database: "ff",
});
