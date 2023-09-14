import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Sequelize, DataTypes } from "sequelize";

dotenv.config();

const app = express();
app.use(cors());

const port = process.env.PORT;

async function main(seq: Sequelize) {
  try {
    await seq.authenticate();
    console.log('la connexion est établie');
  } catch (error) {
    console.error('Uimpossible de se connecter à la base de données', error);
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

// Route pour ajouter une recette
app.get('/ajout-recette/:nom', async (req, res) => {
  const recette = await Recette.create({ nom: req.params.nom, duree: 2, lienimage: 'www.test.fr', note: 5 });
  res.send(JSON.stringify(recette));
});

// Route pour récupérer toutes les données (nom, durée, lien de l'image et note) de toutes les recettes
app.get('/findall', async (req, res) => {
  try {
    const recettes = await Recette.findAll({
      attributes: ['nom', 'duree', 'lienimage', 'note'],
    });
    res.send(JSON.stringify(recettes));
  } catch (error) {
    res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération des recettes.' });
  }
});

app.listen(port, () => {
  console.log('API on port : ' + port);
});
