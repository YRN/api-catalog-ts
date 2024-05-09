import express, { Request, Response } from 'express';
import mysql from 'mysql2/promise';

const app = express();
const port = 3000;

app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  port: 3306,
  database: 'catalog',
  waitForConnections: true,
  connectionLimit: 10,
});



app.post('/skus', async (req: Request, res: Response) => {
    const { productId, productName, category } = req.body;
    try {
      let query = 'SELECT skus.*, products.name, products.category, products.image FROM skus INNER JOIN products ON skus.product_id = products.id';
      let params: (number | string)[] = [];

      if (productId || productName || category){
        query += ' WHERE '
      }
  
      if (productId) {
        query += ' skus.product_id = ? ';
        params.push(productId as string);
      } else if (productName) {
        query += ' products.name LIKE ? ';
        params.push(`%${productName}%`); 
      } else if (category) {
        query += ' products.category LIKE ? ';
        params.push(`%${category}%`);
      }
  
      const [rows] = await pool.query(query, params);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  
  // Mulai server
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });