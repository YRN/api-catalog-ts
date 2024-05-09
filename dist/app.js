"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const promise_1 = __importDefault(require("mysql2/promise"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
const pool = promise_1.default.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 3306,
    database: 'catalog',
    waitForConnections: true,
    connectionLimit: 10,
});
app.post('/skus', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, productName, category } = req.body;
    try {
        let query = 'SELECT skus.*, products.name, products.category, products.image FROM skus INNER JOIN products ON skus.product_id = products.id';
        let params = [];
        if (productId || productName || category) {
            query += ' WHERE ';
        }
        if (productId) {
            query += ' skus.product_id = ? ';
            params.push(productId);
        }
        else if (productName) {
            query += ' products.name LIKE ? ';
            params.push(`%${productName}%`);
        }
        else if (category) {
            query += ' products.category LIKE ? ';
            params.push(`%${category}%`);
        }
        const [rows] = yield pool.query(query, params);
        res.json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}));
// Mulai server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
