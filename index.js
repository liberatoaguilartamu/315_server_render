const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();

const app = express();
const port = 3000;

const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: {rejectUnauthorized: false}
});

process.on('SIGINT', function() {
    pool.end();
    console.log('Application successfully shutdown');
    process.exit(0);
});
	 	 	 	
app.set("view engine", "ejs");

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/items', (req, res) => {
    items = []
    pool
    .query('SELECT * FROM items;')
    .then(query_res => {
        for (let i = 0; i < query_res.rowCount; i++){
            items.push(query_res.rows[i]);
        }
        const data = {items: items};
        console.log(items);
        res.send(data);
        return;
    });
});

//SERVER GUI//

// Get orderid
app.get('/orderid', (req, res) => {
    items = []
    pool
    .query('SELECT order_id from orders ORDER BY order_id DESC LIMIT 1;')
    .then(query_res => {
        for (let i = 0; i < query_res.rowCount; i++){
            items.push(query_res.rows[i]);
        }
        const data = {items: items};
        console.log(items);
        res.send(data);
        return;
    });
});

// Get item uuid
app.get('/itemuuid', (req, res) => {
    items = []
    pool
    .query("SELECT uuid from order_items ORDER BY uuid DESC LIMIT 1;")
    .then(query_res => {
        for (let i = 0; i < query_res.rowCount; i++){
            items.push(query_res.rows[i]);
        }
        const data = {items: items};
        console.log(items);
        res.send(data);
        return;
    });
});

// Get topping uuid
app.get('/toppinguuid', (req, res) => {
    items = []
    pool
    .query("SELECT uuid from order_toppings ORDER BY uuid DESC LIMIT 1;")
    .then(query_res => {
        for (let i = 0; i < query_res.rowCount; i++){
            items.push(query_res.rows[i]);
        }
        const data = {items: items};
        console.log(items);
        res.send(data);
        return;
    });
});

// Get item quantity
app.get('/quantity', (req, res) => {
    items = []
    pool
    .query(`SELECT item_quantity from inventory WHERE item_id=${req.query.id}`.replace(/:/g, ""))
    .then(query_res => {
        for (let i = 0; i < query_res.rowCount; i++){
            items.push(query_res.rows[i]);
        }
        const data = {items: items};
        console.log(items);
        res.send(data);
        return;
    });
});

// Get id from name
app.get('/itemid', (req, res) => {
    items = []
    pool
    .query(`SELECT id FROM items WHERE name='${req.query.name}'`.replace(/:/g, ""))
    .then(query_res => {
        for (let i = 0; i < query_res.rowCount; i++){
            items.push(query_res.rows[i]);
        }
        const data = {items: items};
        console.log(items);
        res.send(data);
        return;
    });
});

// Insert order table
app.get('/createorder', (req, res) => {
    items = []
    pool
    .query(`INSERT INTO orders VALUES (${req.query.orderID},${req.query.calories},${req.query.total},${req.query.tip},${req.query.total_after_tip},'${req.query.date}');`.replace(/:/g, ""))
    .then(query_res => {
        for (let i = 0; i < query_res.rowCount; i++){
            items.push(query_res.rows[i]);
        }
        const data = {items: items};
        console.log(items);
        res.send(data);
        return;
    });
});

// Update inventory after order
app.get('/updateinventoryserver', (req, res) => {
    items = []
    pool
    .query(`UPDATE inventory SET item_quantity=GREATEST(item_quantity-1,0) WHERE item_id=(${req.query.itemid});UPDATE inventory SET num_sold=num_sold+1 WHERE item_id=(${req.query.itemid});`.replace(/:/g, ""))
    .then(query_res => {
        for (let i = 0; i < query_res.rowCount; i++){
            items.push(query_res.rows[i]);
        }
        const data = {items: items};
        console.log(items);
        res.send(data);
        return;
    });
});

// Insert into order items
app.get('/insertitem', (req, res) => {
    items = []
    pool
    .query(`INSERT INTO order_items VALUES (${req.query.uuid},${req.query.orderid},${req.query.subitem},${req.query.id},'${req.query.name}');`.replace(/:/g, ""))
    .then(query_res => {
        for (let i = 0; i < query_res.rowCount; i++){
            items.push(query_res.rows[i]);
        }
        const data = {items: items};
        console.log(items);
        res.send(data);
        return;
    });
});

// Insert into order toppings
app.get('/inserttopping', (req, res) => {
    items = []
    pool
    .query(`INSERT INTO order_toppings VALUES (${req.query.uuid},${req.query.orderid},${req.query.subitem},${req.query.id},'${req.query.name}');`.replace(/:/g, ""))
    .then(query_res => {
        for (let i = 0; i < query_res.rowCount; i++){
            items.push(query_res.rows[i]);
        }
        const data = {items: items};
        console.log(items);
        res.send(data);
        return;
    });
});

//MANAGER GUI//

// Get inventory
app.get('/inventory', (req, res) => {
    items = []
pool
.query("SELECT inventory.id, inventory.item_id, inventory.name, items.category, items.price, inventory.item_quantity, inventory.num_sold, inventory.vendor, inventory.purchase_price, inventory.batch_quantity FROM inventory JOIN items on items.id = inventory.item_id order by inventory.item_id;")
.then(query_res => {
    for (let i = 0; i < query_res.rowCount; i++){
        items.push(query_res.rows[i]);
    }
    const data = {items: items};
    console.log(items);
    res.send(data);
    return;
});
});

// Update inventory
app.get('/updateinventory', (req, res) => {
    items = []
    pool
    .query(`UPDATE inventory SET name = '${req.query.name}' WHERE item_id = ${req.query.itemid}`.replace(/:/g, ""))
    .then(query_res => {
        for (let i = 0; i < query_res.rowCount; i++){
            items.push(query_res.rows[i]);
        }
        const data = {items: items};
        console.log(items);
        res.send(data);
        return;
    });
});

// Update items
app.get('/updateitem', (req, res) => {
    items = []
    pool
    .query(`UPDATE items SET name = '${req.query.name}', price = ${req.query.price} WHERE id = ${req.query.itemid}`.replace(/:/g, ""))
    .then(query_res => {
        for (let i = 0; i < query_res.rowCount; i++){
            items.push(query_res.rows[i]);
        }
        const data = {items: items};
        console.log(items);
        res.send(data);
        return;
    });
});

// Add items
app.get('/additem', (req, res) => {
    items = []
    pool
    .query(`INSERT INTO items (id,name,category,price,calories) VALUES (${req.query.itemid},'${req.query.name}','${req.query.category}',${req.query.price},${req.query.calories})`.replace(/:/g, ""))
    .then(query_res => {
        for (let i = 0; i < query_res.rowCount; i++){
            items.push(query_res.rows[i]);
        }
        const data = {items: items};
        console.log(items);
        res.send(data);
        return;
    });
});

// Add inventory
app.get('/addinventory', (req, res) => {
    items = []
    console.log(req.query);
    pool
    .query(`INSERT INTO inventory VALUES (${req.query.id},${req.query.itemid},'${req.query.name}',${req.query.quantity},${req.query.num_sold},'${req.query.vendor}',${req.query.purchase_price},${req.query.batch_quantity});`.replace(/:/g, ""))
    .then(query_res => {
        for (let i = 0; i < query_res.rowCount; i++){
            items.push(query_res.rows[i]);
        }
        const data = {items: items};
        console.log(items);
        res.send(data);
        return;
    });
});

// Delete item
app.get('/deleteitem', (req, res) => {
    items = []
    pool
    .query(`DELETE FROM inventory where item_id = ${req.query.itemid}`.replace(/:/g, ""))
    .then(query_res => {
        for (let i = 0; i < query_res.rowCount; i++){
            items.push(query_res.rows[i]);
        }
        const data = {items: items};
        console.log(items);
        res.send(data);
        return;
    });
});

// Delete inventory
app.get('/deleteinventory', (req, res) => {
    items = []
    pool
    .query(`DELETE FROM items where id = ${req.query.itemid}`.replace(/:/g, ""))
    .then(query_res => {
        for (let i = 0; i < query_res.rowCount; i++){
            items.push(query_res.rows[i]);
        }
        const data = {items: items};
        console.log(items);
        res.send(data);
        return;
    });
});

// RESTOCK/EXCESS

// Count item
app.get('/countitem', (req, res) => {
    items = []
    pool
    .query(`SELECT COUNT(order_items.uuid) from orders INNER JOIN order_items on orders.order_id = order_items.order_id WHERE datetime BETWEEN '${req.query.from}' and '${req.query.to}' AND order_items.item_id = ${req.query.itemuuid};`.replace(/:/g, ""))
    .then(query_res => {
        for (let i = 0; i < query_res.rowCount; i++){
            items.push(query_res.rows[i]);
        }
        const data = {items: items};
        console.log(items);
        res.send(data);
        return;
    });
});

//Count topping
app.get('/counttopping', (req, res) => {
    items = []
    pool
    .query(`SELECT COUNT(order_toppings.uuid) from orders INNER JOIN order_toppings on orders.order_id = order_toppings.order_id WHERE datetime BETWEEN '${req.query.from}' and '${req.query.to}' AND order_toppings.item_id = ${req.query.topping};`.replace(/:/g, ""))
    .then(query_res => {
        for (let i = 0; i < query_res.rowCount; i++){
            items.push(query_res.rows[i]);
        }
        const data = {items: items};
        console.log(items);
        res.send(data);
        return;
    });
});

// CONNECTOR

// Get item from category
app.get('/getcategory', (req, res) => {
    items = []
    pool
    .query(`SELECT * FROM items WHERE category='${req.query.category}' ORDER BY id`.replace(/:/g, ""))
    .then(query_res => {
        for (let i = 0; i < query_res.rowCount; i++){
            items.push(query_res.rows[i]);
        }
        const data = {items: items};
        console.log(items);
        res.send(data);
        return;
    });
});

// Get prices
app.get('/getprice', (req, res) => {
        items = []
    pool
    .query("SELECT name, price FROM items")
    .then(query_res => {
        for (let i = 0; i < query_res.rowCount; i++){
            items.push(query_res.rows[i]);
        }
        const data = {items: items};
        console.log(items);
        res.send(data);
        return;
    });
});

// SALES/SALES TOGETHER

// Get mainEntrees
app.get('/getmainentrees', (req, res) => {
    items = []
pool
.query("SELECT * FROM items WHERE category='mainEntree' ORDER BY id ;")
.then(query_res => {
    for (let i = 0; i < query_res.rowCount; i++){
        items.push(query_res.rows[i]);
    }
    const data = {items: items};
    console.log(items);
    res.send(data);
    return;
});
});

// Get allItems
app.get('/getitems', (req, res) => {
    items = []
pool
.query("SELECT * FROM items WHERE category='mainEntree' or category='subEntree' ORDER BY id;")
.then(query_res => {
    for (let i = 0; i < query_res.rowCount; i++){
        items.push(query_res.rows[i]);
    }
    const data = {items: items};
    console.log(items);
    res.send(data);
    return;
});
});

// Get toppings
app.get('/toppings', (req, res) => {
    items = []
pool
.query("SELECT * FROM items WHERE category='topping' or category='mainProtein' or category='subProtein' ORDER BY id;")
.then(query_res => {
    for (let i = 0; i < query_res.rowCount; i++){
        items.push(query_res.rows[i]);
    }
    const data = {items: items};
    console.log(items);
    res.send(data);
    return;
});
});

// Get order item between dates
app.get('/getorderitemdate', (req, res) => {
    items = []
    pool
    .query(`SELECT COUNT(order_items.uuid) from orders INNER JOIN order_items on orders.order_id = order_items.order_id WHERE datetime BETWEEN '${req.query.from}' and '${req.query.to}' AND order_items.entree_name = '${req.query.entreename}';`.replace(/:/g, ""))
    .then(query_res => {
        for (let i = 0; i < query_res.rowCount; i++){
            items.push(query_res.rows[i]);
        }
        const data = {items: items};
        console.log(items);
        res.send(data);
        return;
    });
});

// Get order topping between dates
app.get('/getordertoppingdate', (req, res) => {
    items = []
    pool
    .query(`SELECT COUNT(order_toppings.uuid) from orders INNER JOIN order_items ON orders.order_id = order_items.order_id INNER JOIN order_toppings ON orders.order_id = order_toppings.order_id AND order_items.order_subitem = order_toppings.order_subitem WHERE datetime BETWEEN '${req.query.from}' and '${req.query.to}' AND order_toppings.topping_name = '${req.query.toppingname}';`.replace(/:/g, ""))
    .then(query_res => {
        for (let i = 0; i < query_res.rowCount; i++){
            items.push(query_res.rows[i]);
        }
        const data = {items: items};
        console.log(items);
        res.send(data);
        return;
    });
});

// Get bigboy count
app.get('/bigboycount', (req, res) => {
    items = []
    pool
    .query(`SELECT COUNT(order_toppings.uuid) from orders INNER JOIN order_items ON orders.order_id = order_items.order_id INNER JOIN order_toppings ON orders.order_id = order_toppings.order_id AND order_items.order_subitem = order_toppings.order_subitem WHERE datetime BETWEEN '${req.query.from}' and '${req.query.to}' AND order_items.entree_name = '${req.query.entreename}' AND order_toppings.topping_name = '${req.query.toppingname}';`.replace(/:/g, ""))
    .then(query_res => {
        for (let i = 0; i < query_res.rowCount; i++){
            items.push(query_res.rows[i]);
        }
        const data = {items: items};
        console.log(items);
        res.send(data);
        return;
    });
});

// Get bigboy
app.get('/bigboy', (req, res) => {
    items = []
    pool
    .query(`SELECT * from orders INNER JOIN order_items ON orders.order_id = order_items.order_id INNER JOIN order_toppings ON orders.order_id = order_toppings.order_id AND order_items.order_subitem = order_toppings.order_subitem WHERE datetime BETWEEN '${req.query.from}' AND '${req.query.to}';`.replace(/:/g, ""))
    .then(query_res => {
        for (let i = 0; i < query_res.rowCount; i++){
            items.push(query_res.rows[i]);
        }
        const data = {items: items};
        console.log(items);
        res.send(data);
        return;
    });
});


// app.get(, (req, res) => {
//     items = []
//     pool
//     .query(`${req.query.}`.replace(/:/g, ""))
//     .then(query_res => {
//         for (let i = 0; i < query_res.rowCount; i++){
//             items.push(query_res.rows[i]);
//         }
//         const data = {items: items};
//         console.log(items);
//         res.send(data);
//         return;
//     });
// });


// app.get(, (req, res) => {
    //     items = []
//     pool
//     .query()
//     .then(query_res => {
//         for (let i = 0; i < query_res.rowCount; i++){
//             items.push(query_res.rows[i]);
//         }
//         const data = {items: items};
//         console.log(items);
//         res.send(data);
//         return;
//     });
// });

 

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`); 
});
