const express = require('express');
const Post = require('./posts-model')
const router = express.Router();
router.use(express.json());

// *** GET *** //
router.get('/', (req, res) => {
    Post.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            res.status(500).json({
                message: "The posts information could not be retrieved",
            })
        })
})
router.get('/:id', (req, res) => {
    const { id } = req.params
    Post.findById(id)
        .then(post => {
            if(post){
                res.status(200).json(post)
            } else {
                res.status(404).json({
                    message: "The post with the specified ID does not exist" 
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "The post information could not be retrieved"
            })
        })
})
router.get('/:id/comments', (req, res) => {
    const { id } = req.params;
    Post.findPostComments(id)
        .then(comments => {
            if(comments.length > 0){
                res.status(200).json(comments);
            } else {
                res.status(404).json({
                    message: "The post with the specified ID does not exist"
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "The comments information could not be retrieved"
            })
        })
})

// *** POST *** //
router.post('/', (req, res) => {
    const { title, contents } = req.body
    if(!title || !contents) {
        res.status(400).json({
            message: "Please provide title and contents for the post"
        })
    } else {
        const newPost = {title: title, contents: contents}
        Post.insert(newPost)
            .then(post => {
                res.status(201).json({
                    id: post,
                    title: title,
                    contents: contents,
                })
            })
            .catch(err => {
                console.log(newPost)
                res.status(500).json({
                    message: "There was an error while saving the post to the database"
                })
            })
    }
})

// *** PUT *** //
router.put('/:id', (req,res) => {
    const { id } = req.params;
    const changes = req.body;
    if(!changes.title || !changes.contents){ // if the req body is missing title or contents
        res.status(400).json({
            message: "Please provide title and contents for the post"
        })
    } else {  // if the req body has necessary data
        Post.update(id, changes)
            .then(post => {
                if(post){ // if the Post.update returns a valid id
                    res.status(200).json({
                        id: post,
                        title: changes.title,
                        contents: changes.contents,
                    });
                } else { // if the Post.update returns an invalid id
                    res.status(404).json({
                        message: "The post with the specified ID does not exist"
                    })
                }
            })
            .catch(err => { // if there is an error updating post
                res.status(500).json({
                    message: "The post information could not be modified"
                })
            })
    }
})

// *** DELETE *** //
router.delete('/:id', async (req,res) => {
    const { id } = req.params;
    try {
        const deletedPost = await Post.findById(id);
        if(deletedPost) {
            await Post.remove(id)
            res.status(200).json(deletedPost)
        } else{
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        }
    } catch {
        res.status(500).json({
            message: "The post could not be removed"
        })
    }
})

module.exports = router;
