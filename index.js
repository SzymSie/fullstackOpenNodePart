const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(requestLogger);
app.use(morgan("tiny"));
app.use(morgan(":req[Content-Length]"));
app.use(morgan(":body"));
app.use(cors());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
  console.log({ persons });
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((note) => note.id !== id);

  response.status(204).end();
});

app.get("/info", (request, response) => {
  response.send(
    `<h1>Persons has info for ${
      persons.length
    } people</h1><h1>${new Date()}</h1>`
  );
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  // The name already exists in the phonebook
  const prsn = persons.find((person) => person.name === body.name);
  if (prsn) {
    return response.status(409).json({
      error: `${body.name} already exists in the phonebook`,
    });
  }

  const person = {
    id: Math.random() * 1000000000,
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
