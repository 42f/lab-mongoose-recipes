const mongoose = require('mongoose');

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require('./models/Recipe.model');
// Import of the data from './data.json'

const data = require('./data');

const MONGODB_URI = 'mongodb://localhost:27017/recipe-app';

const lvl = Recipe.schema.path('level').enumValues;
const dishTypes = Recipe.schema.path('dishType').enumValues;

async function logAllTitles() {
  const allRecipes = await Recipe.find({});
  console.log('↪️ -------------- All Recipes:');
  allRecipes.forEach(r => console.log(`${r.title} -> ${r.duration}`))
}


const myRecipe =
  {
    title: 'Flan aux huitres 👌',
    level: lvl[0],
    ingredients: ['patates', 'ail', 'huitres'],
    cuisine: 'froncaiiise',
    dishType: dishTypes[3],
    duration: 42,
  }


// Connection to the database "recipe-app"
mongoose
  .connect(MONGODB_URI)
  .then(x => {
    console.log(`Connected to the database: "${x.connection.name}"`);
    // Before adding any recipes to the database, let's remove all existing ones
    return Recipe.deleteMany()
  })
  .then(() => Recipe.create(myRecipe))
  .then(() => Recipe.insertMany(data))
  .then(() => logAllTitles())
  .then(() => Recipe.findOneAndUpdate({title: 'Rigatoni alla Genovese'}, {duration: 100}, {new: true}))
  .then(() => logAllTitles())
  .then(() => Recipe.deleteOne({title: 'Carrot Cake'}))
  .then(() => logAllTitles())
  .then(() => mongoose.connection.close())
  .catch(error => {
    console.error('Error connecting to the database', error);
  });
