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

let lists = 1;

/* async function getCurrentList(req) {
  try {
  const listId = req.body.list;
  console.log(listId); 
  const result = await db.query("SELECT * FROM lists WHERE id = ($1)", [listId]);
  console.log(result.rows[0]);
  return result.rows[0];
  } catch(err) {
    console.log(err);
  }
} */ 

async function getCurrentList() {
  
}

app.get("/", async (req, res) => {
  
  try {
    const getList = await getCurrentList(req); // get current list 
    const listsResult = await db.query("SELECT * FROM lists"); // Get all lists 
    const itemsResult = await db.query("SELECT * FROM items WHERE list_id = $1 ORDER BY id ASC", 
      [getList]
    );
  
    res.render("index.ejs", {
      listTitle: "Today", 
      listItems: itemsResult.rows, 
      lists: listsResult.rows
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

// New List 
/*
app.post("/user", async (req, res) => {
  if( req.body.add === "new") {
    res.render("new.ejs")
  } else {
    currentUserId = req.body.list;
    res.redirect("/");
  }
}); */ 

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
