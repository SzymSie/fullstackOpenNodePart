const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://fullstack:${password}@cluster0.wwb8w.mongodb.net/?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLegth: 3,
    required: true
  },
  number: {
    type: String,
    required: true
  },
});

const Person = mongoose.model("Person", personSchema);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected");
    if (process.argv.length < 4) {
      return Person.find({}).then((result) => {
        result.forEach((note) => {
          console.log(note);
        });
        return mongoose.connection.close();
      });
    } else {
      const person = new Person({
        name: name,
        number: number,
      });

      return person.save().then(() => {
        console.log("person saved!");
        return mongoose.connection.close();
      });
    }
  })
  .catch((err) => console.log(err));
