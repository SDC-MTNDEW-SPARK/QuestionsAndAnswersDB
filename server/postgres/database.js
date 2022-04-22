const { Client } = require('pg');

// List Questions, when given a product ID
async function listQuestions(productID = 1) {
  const client = new Client({
    database: 'qa',
  });
  await client.connect();
  const res = await client.query(`SELECT * FROM question WHERE product_id = ${Number(productID)};`);
  console.log(res.rows);
  await client.end();
  return res.rows;
}

module.exports.listQuestions = listQuestions;
