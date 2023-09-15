import express, { Request } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Sequelize, DataTypes } from "sequelize";
import bodyParser from "body-parser"

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT;

async function main(seq: Sequelize) {
  try {
    await seq.authenticate();
    console.log('la connexion est établie');
  } catch (error) {
    console.error('impossible de se connecter à la base de données', error);
  }

  await seq.sync();
}

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./db.sqlite",
});

const Recette = sequelize.define('recettes', {
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duree: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  lienimage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  note: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {});

main(sequelize);
interface IMaRequetBody {
  nom: string,
  duree: Number,
  url: string,
  note: Number,
}
// Route pour ajouter une recette
app.post('/recettes', async (req:Request<IMaRequetBody>, res) => {
  const recette = await Recette.create({ nom: req.body.nom, duree: req.body.duree, lienimage: req.body.url, note: req.body.note });
  res.json(recette);
});

// Route pour récupérer toutes les données (nom, durée, lien de l'image et note) de toutes les recettes
app.get('/recettes', async (req, res) => {
  try {
    const recettes = await Recette.findAll();
    res.json(recettes);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération des recettes.' });
  }
});

app.listen(port, () => {
  console.log('API on port : ' + port);
});
