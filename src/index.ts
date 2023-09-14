import express from "express"
import dotenv from "dotenv"
import { Sequelize , DataTypes} from "sequelize";
dotenv.config();
const app = express();
const port = process.env.PORT;

async function main(seq: Sequelize){
  try {
    await seq.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  await seq.sync({ force: true});
  // await seq.sync();
}

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./db.sqlite",
})

const Recette = sequelize.define('recettes', {
  // différents attributs
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  duree: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  lienimage: {
    type: DataTypes.STRING,
    allowNull: false
  },
  note: {
    type: DataTypes.NUMBER,
    allowNull: false
  },
}, {
});


main(sequelize)

// routes
app.get('/ajout-recette', async (req, res) => {
  await Recette.create({nom: 'yyo', duree: 2, lienimage: 'www.test.fr', note: 5})
  res.send('toto')
})

app.listen(port, () => {
  console.log('API on port : ' + port);
  
})