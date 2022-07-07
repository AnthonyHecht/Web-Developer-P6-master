const Sauce = require('../models/Sauce');
//importation de File System de NodeJS
const fs = require('fs');

//création de sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error =>{
            res.status(400).json({ error })
        });
};

//modification de sauce
exports.modifySauce = (req, res, next) => {
    //if nouvelle image -> suppression de l'ancienne dans le dossier image
  if (req.file) {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            //mise à jour de l'image
          const sauceObject = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
          }
          Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'La sauce a été modifiée.' }))
            .catch(error => res.status(400).json({ error }));
        })
      })
      .catch(error => res.status(500).json({ error }));
    } 
    else //si pas de nouvelle image
    {
      const sauceObject = { ...req.body };
      Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'La sauce a été modifiée.' }))
        .catch(error => res.status(400).json({ error }));
    }
};

//suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'La sauce a été supprimée.'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

//affichage d'une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

//affichage de toute les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }))
};

//like, dislike
exports.likeSauce = (req, res, next) => {
  const userId = req.body.userId;
  const like = req.body.like;
  const sauceId = req.params.id;
  Sauce.findOne({ _id: sauceId })
    .then(sauce => {
        if (sauce.userId === userId) {
            res.status(401).json({ error });
        } else {
      // valeurs à modifier
      const newValues = {
        usersLiked: sauce.usersLiked,
        usersDisliked: sauce.usersDisliked,
        likes: 0,
        dislikes: 0
      }
      // Trois cas:
      switch (like) {
        case 1:  // like sauce
          newValues.usersLiked.push(userId);
          break;
        case -1:  // dislike sauce
          newValues.usersDisliked.push(userId);
          break;
        case 0:  // Annulation
          if (newValues.usersLiked.includes(userId)) {
            // Annulation du like
            const index = newValues.usersLiked.indexOf(userId);
            newValues.usersLiked.splice(index, 1);
          } else {
            // Annulation du dislike
            const index = newValues.usersDisliked.indexOf(userId);
            newValues.usersDisliked.splice(index, 1);
          }
          break;
          default: res.status(400).end();
      };
      // Calcul du nombre de likes, dislikes
      newValues.likes = newValues.usersLiked.length;
      newValues.dislikes = newValues.usersDisliked.length;
      // Mise à jour de la sauce
      Sauce.updateOne({ _id: sauceId }, newValues )
        .then(() => res.status(200).json({ message: 'La sauce a été notée.' }))
        .catch(error => res.status(400).json({ error }))
}})
  .catch(error => res.status(500).json({ error }));
};