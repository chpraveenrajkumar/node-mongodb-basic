const express = require("express");
const { connectToDB, getDB } = require("./db");
const { ObjectId } = require("mongodb");

const app = express(); // initilization
app.use(express.json()); // middleware to parse req body

//db connection
let client;
connectToDB((err) => {
  if (!err) {
    app.listen(PORT.env.PORT, () => {
      console.log("running on port 3000");
    });
    client = getDB();
  }
});

// REST API end points
app.get("/test", (req, res) => {
  res.json({ msg: "test response" });
});

// CREATE operation
app.post("/employees", (req, res) => {
  const addEmp = req.body;
  client
    .db("sample_employees") // db name
    .collection("employees") // collection name
    .insertOne(addEmp)
    .then((result) => {
      res.status(200).json({ msg: result });
    })
    .catch(() => {
      res.status(500).json({ msg: "something went wrong" });
    });
});

// UPDATE operation
app.patch("/employees/:id", (req, res) => {
  const updatedValue = req.body;
  if (ObjectId.isValid(req.params.id)) {
    client
      .db("sample_employees")
      .collection("employees")
      .updateOne({ _id: ObjectId(req.params.id) }, { $set: updatedValue })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch(() => {
        res.status(500).json({ msg: "doc not found" });
      });
  } else {
    res.status(500).json({ msg: "not a valid id" });
  }
});

// READ operation
app.get("/employees", (req, res) => {
  let employees = [];
  client
    .db("sample_employees")
    .collection("employees")
    .find()
    .sort({ name: 1 })
    .forEach((emp) => {
      employees.push(emp);
    })
    .then(() => {
      res.status(200).json(employees);
    })
    .catch(() => {
      res.status(500).json({ msg: "unable to fetch employees" });
    });
});

app.get("/employees/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    client
      .db("sample_employees")
      .collection("employees")
      .findOne({ _id: ObjectId(req.params.id) })
      .then((emp) => {
        res.status(200).json(emp);
      })
      .catch(() => {
        res.status(500).json({ msg: "doc not found" });
      });
  } else {
    res.status(500).json({ msg: "not a valid id" });
  }
});

// DELETE operation
app.delete("/employees/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    client
      .db("sample_employees")
      .collection("employees")
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch(() => {
        res.status(500).json({ msg: "doc not found" });
      });
  } else {
    res.status(500).json({ msg: "not a valid id" });
  }
});
