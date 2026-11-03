// import "dotenv/config";
// import pg from "pg";

// const client = new pg.Client({
//   connectionString: process.env.DATABASE_URL,
// });

// try {
//   await client.connect();

//   const result = await client.query(`
//     SELECT column_name
//     FROM information_schema.columns
//     WHERE table_schema = 'public'
//       AND table_name = 'Idea'
//       AND column_name IN (
//         'category',
//         'problemStatement',
//         'proposedSolution'
//       )
//     ORDER BY column_name;
//   `);

//   console.log("Existing Idea columns:");
//   console.log(result.rows);
// } catch (error) {
//   console.error("Database inspection failed:", error.message);
// } finally {
//   await client.end();
// }




import "dotenv/config";
import pg from "pg";

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});

try {
  await client.connect();

  const result = await client.query(`
    SELECT migration_name, finished_at
    FROM "_prisma_migrations"
    ORDER BY started_at;
  `);

  console.log("Applied migrations:");
  console.table(result.rows);
} catch (error) {
  console.error(error.message);
} finally {
  await client.end();
}