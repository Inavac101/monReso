const PostModel = require('../models/post.model');
const UserModel = require('../models/user.model');
const ObjectId = require('mongoose').Types.ObjectId;


// Function to find all posts
module.exports.readPost = (req, res) => {
    PostModel.find((err, docs) => {
        if (!err) res.send(docs);
        else console.log('Error to get Data : ' + err);
    }).sort({ createdAt: -1});
};


// Function to create a post
module.exports.createPost = async (req, res) => {
    const newPost = new PostModel ({
        posterId: req.body.posterId,
        message: req.body.message,
        video: req.body.video,
        likers: [],
        comments: []
    });

    try {
        const post = await newPost.save();
        return res.status(201).json(post);
    } catch (err) {
        return res.status(400).send(err);
    }
};

// Function to update a post
module.exports.updatePost = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`ID unknown : ` + req.params.id);

    const updatedRecord = {
        message: req.body.message
    }

    PostModel.findByIdAndUpdate(
        req.params.id,
        { $set: updatedRecord },
        { new: true },
        (err, docs) => {
            if (!err) res.send(docs);
            else console.log("Update error : " + err)
        }
    )
}

// Function to delete a post
module.exports.deletePost = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`ID unknown : ` + req.params.id);

    PostModel.findByIdAndRemove(req.params.id, (err, docs) =>{
            if (!err) res.send(docs);
            else console.log("Delete error : " + err);
    }); 
};


//  Function to like a post
module.exports.likePost = async (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`ID unknown : ` + req.params.id);

    try {
        const post = await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $addToSet: { likers: req.body.id}
            },
            { new : true}
        );
        
        if (!post) {
            return res.status(400).send('Post not found');
        }

        const user = await UserModel.findByIdAndUpdate(
            req.body.id,
            {
                $addToSet: {likes: req.params.id}
            },
            { new : true}
        );

        if (!user) {
            return res.status(400).send('User not found');
        }

        return res.send(user);

    } catch (err) {
        return res.status(400).send(err);
    }
};

// Function to unlike a post
module.exports.unlikePost = async (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`ID unknown : ` + req.params.id);

        try {
            const post = await PostModel.findByIdAndUpdate(
                req.params.id,
                {
                    $pull: { likers: req.body.id}
                },
                { new : true}
            );
            
            if (!post) {
                return res.status(400).send('Post not found');
            }
    
            const user = await UserModel.findByIdAndUpdate(
                req.body.id,
                {
                    $pull: {likes: req.params.id}
                },
                { new : true}
            );
    
            if (!user) {
                return res.status(400).send('User not found');
            }
    
            return res.send(user);
    
        } catch (err) {
            return res.status(400).send(err);
        }
};

// Function to comment a post
module.exports.commentPost = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id))
            return res.status(400).send(`ID unknown : ` + req.params.id);

        const post = await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    comments: {
                        commenterId: req.body.commenterId,
                        commenterPseudo: req.body.commenterPseudo,
                        text: req.body.text,
                        timestamp: new Date().getTime()
                    }
                }
            },
            { new: true }
        );

        if (!post) {
            return res.status(404).send("Post not found");
        }

        return res.send(post);
    } catch (err) {
        return res.status(400).send(err);
    }
};


module.exports.editCommentPost = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send(`ID unknown : ` + req.params.id);
    }

    try {
        const docs = await PostModel.findById(req.params.id);
        const theComment = docs.comments.find((comment) => comment._id.equals(req.body.commentId));

        if (!theComment) {
            return res.status(404).send(`Comment not found`);
        }

        theComment.text = req.body.text;

        try {
            const savedDoc = await docs.save();
            return res.status(200).send(savedDoc);
        } catch (err) {
            return res.status(500).send(err);
        }
    } catch (err) {
        return res.status(400).send(err);
    }
};

module.exports.deleteCommentPost = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send(`ID unknown : ` + req.params.id);
    }

    try {
        const updatedPost = await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: {
                    comments: {
                        _id: req.body.commentId,
                    },
                },
            },
            { new: true }
        );

        if (updatedPost) {
            return res.status(200).send(updatedPost);
        } else {
            return res.status(404).send('Post not found');
        }
    } catch (err) {
        return res.status(400).send(err);
    }
};