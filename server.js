const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(express.json());
app.use(bodyParser.json());

//Skapar en sqlite databas
const db = new sqlite3.Database(':memory:');
db.on('trace', console.log);

// Gör så att CORS funkar
app.use(cors({
    origin: 'http://localhost:3001',
}));

//Hämtar alla employees
app.get('/employees', (req, res) => {
    db.all('SELECT * FROM employees', (err, rows) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            res.json(rows);
        }
    });
});

//Hämtar alla bilmodeller
app.get('/carmodels', (req, res) => {
    db.all('SELECT * FROM carmodels', (err, rows) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            res.json(rows);
        }
    });
});

//Lägger till en ny bilmodell i databasen
app.post('/carmodels', (req, res) => {
    const carmodel = req.body;

    db.run(
        'INSERT INTO carmodels (brand, model, price) VALUES (?, ?, ?)',
        [carmodel.brand, carmodel.model, carmodel.price],
        function (err) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            } else {
                carmodel.id = this.lastID;
                res.status(201).json(carmodel);
            }
        }
    );
});

//Tar bort en bilmodell från databasen
app.delete('/carmodels/:id', (req, res) => {
    const carmodelId = req.params.id;

    db.run('DELETE FROM carmodels WHERE id = ?', [carmodelId], function (err) {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            res.json({ id: carmodelId });
        }
    });
});

//Hämtar total sales för en användar med dess id som parameter
app.get('/total_sales/:id', (req, res) => {
    const employeeId = req.params.id;

    db.all(
        `SELECT SUM(carmodels.price) AS total_sales
       FROM sales
       INNER JOIN CarModels ON sales.carmodel_id = carmodels.id
       WHERE sales.id = ?`, [employeeId],
        (err, rows) => {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            } else {
                res.json(rows);
            }
        }
    );
});

//Hämtar alla användare
app.get('/users', async (req, res) => {
    const sql = `SELECT * FROM users`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.send(rows);
    });
});

//Hämtar specefik användare efter deras namn
app.get('/users/:name', async (req, res) => {
    const sql = `SELECT * FROM users WHERE username = ?`;
    db.get(sql, [req.params.name], (err, row) => {
        if (err) {
            throw err;
        }
        res.send(row);
    });
});

//Lägger till användare
  app.post('/users', (req, res) => {
    const user = req.body;
    const sql = `INSERT INTO users(username, password) VALUES (?, ?)`;
    db.run(sql, [user.name, user.password], function(err) {
        if (err) {
            return console.error(err.message);
        }
        res.json({id: this.lastID});
    });
});


db.serialize(() => {
    //Skapar databas table för anställda 
    db.run(`
      CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY,
        name TEXT
      )`);

    //Skapar databas table för bilmodeller 
    db.run(`
      CREATE TABLE IF NOT EXISTS carmodels (
        id INTEGER PRIMARY KEY,
        brand TEXT,
        model TEXT,
        price INTEGER
      )`);

    //Skapar databas table för dem olika säljen
    db.run(`
      CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY,
        employee_id INTEGER,
        carmodel_id INTEGER,
        FOREIGN KEY (employee_id) REFERENCES employees (id),
        FOREIGN KEY (carmodel_id) REFERENCES carmodels (id)
      )`);

    //Skapar databas table för användare
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT,
        password TEXT
      )`);

    // Följande är script som fyller databasens olika tables med datan från data.json
    const data = require('./data.json');
    const { employees, carmodels, sales } = data.carshop;


    employees.forEach((employee) => {
        db.run('INSERT INTO employees (id, name) VALUES (?, ?)', [employee.id, employee.name]);
    });


    carmodels.forEach((carmodel) => {
        db.run('INSERT INTO carmodels (id, brand, model, price) VALUES (?, ?, ?, ?)', [
            carmodel.id,
            carmodel.brand,
            carmodel.model,
            carmodel.price,
        ]);
    });


    sales.forEach((sale) => {
        db.run('INSERT INTO sales (id, employee_id, carmodel_id) VALUES (?, ?, ?)', [
            sale.id,
            sale.employee_id,
            sale.carmodel_id,
        ]);
    });



    // Startar servern
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
});
