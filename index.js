import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "iseult",
  port: 5432,
});
db.connect();

const app = express();
const port = 3000;

// Middleware 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items ORDER BY id ASC"); 
    // console.log(result.rows);
    const items = result.rows; 
  
    res.render("index.ejs", {
      listTitle: "Today", 
      listItems: items
    });
  } catch(err) {
    console.log(err);
  }
});

// Add new post 
app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  console.log(item);
  try {
    await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
    res.redirect("/");
  } catch(err) {
    console.log(err);
  }
  /* items.push({ title: item });
  res.redirect("/"); */ 
});

// Edit post 
app.post("/edit", async (req, res) => {
  const editId = req.body.updatedItemId; 
  const editTitle = req.body.updatedItemTitle;
  console.log(editId, editTitle);

  try {
    await db.query("UPDATE items SET title = ($1) WHERE id = ($2)", [editTitle, editId]);
    res.redirect("/");
  } catch(err) {
    console.log(err);
  }  
});

// Delete post
app.post("/delete", async (req, res) => {
  const deleteId = req.body.deleteItemId; 
  console.log(deleteId); 
  
  try {
    await db.query("DELETE FROM items WHERE id = ($1)", [deleteId]);
    res.redirect("/");
  } catch(err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
