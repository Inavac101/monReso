const UserModel = require('../models/user.model');
// const ObjectID = require('mongoose').Types.ObjectID;
const { ObjectId } = require('mongodb');


module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
}

module.exports.userInfo =  (req, res) => {
    console.log(req.params);
        if (!ObjectId.isValid(req.params.id)){
            return res.status(400).send(`ID unknown : ${req.params.id}`)
        }
    UserModel.findById(req.params.id, (err, docs) => {
        if (!err){ res.send(docs)}
        else {console.log(`ID unknown : ${err}`)};
    }).select('-password');
};

module.exports.updateUser = async (req, res) =>{
    if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`ID unknown : ${req.params.id}`)

    try {
    const updatedUser = await UserModel.findOneAndUpdate(
        { _id: req.params.id },
        {
        $set: {
            bio: req.body.bio
        }
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    )
    if (!updatedUser) {
        return res.status(404).send({ message: 'User not found' })
    }
    return res.send(updatedUser)
    } catch (err) {
    return res.status(500).send({ message: err })
    }
}

module.exports.deleteUser = async (req, res) =>{
    if (!ObjectId.isValid(req.params.id))
    return res.status(400).send(`ID unknown : ${req.params.id}`)

    try {
        await UserModel.remove({ _id: req.params.id}).exec();
            res.status(400).json({ message: 'Succesfuly deleted'});
    } catch(err){
        return res.status(500).send({ message: err });
    }
}

module.exports.follow = async (req, res) => {
    if (!ObjectId.isValid(req.params.id) || !ObjectId.isValid(req.body.idToFollow)) {
      return res.status(400).send(`ID unknown : ${req.params.id}`);
    }
  
    try {
      // add to the followers list
      const user = await UserModel.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { following: req.body.idToFollow } },
        { new: true, upsert: true }
      );
      // add to following list
      const followedUser = await UserModel.findByIdAndUpdate(
        req.body.idToFollow,
        { $addToSet: { followers: req.params.id } },
        { new: true, upsert: true }
      );
  
      res.status(201).json({ user, followedUser });
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  };
  

module.exports.unfollow = async (req, res) =>{
    if (!ObjectId.isValid(req.params.id) || !ObjectId.isValid(req.body.idToUnFollow)) {
        return res.status(400).send(`ID unknown : ${req.params.id}`);
      }
    
      try {
        // delete to the followers list
        const user = await UserModel.findByIdAndUpdate(
          req.params.id,
          { $pull: { following: req.body.idToUnFollow } },
          { new: true, upsert: true }
        );
        // delete to following list
        const followedUser = await UserModel.findByIdAndUpdate(
          req.body.idToUnFollow,
          { $pull: { followers: req.params.id } },
          { new: true, upsert: true }
        );
    
        res.status(201).json({ user, followedUser });
      } catch (err) {
        return res.status(500).json({ message: err });
      }
}