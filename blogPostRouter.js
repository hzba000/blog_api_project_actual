//import express
const express = require('express');

//express router instance
const router = express.Router();


//Import Blog Posts Model
const {BlogPosts} = require('./models');

//Include body parser to parse data from header 
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//Preload some data
BlogPosts.create('Shannara', 'Great Book!' ,'Terry Brooks');
BlogPosts.create('Willy Wonka', 'Great for kids!', 'Roald Dahl');
BlogPosts.create('Spiderman', 'Comic book', 'Stan Lee');

//when root of this route is called with GET, return
//all Blog Posts by calling 'BlogPosts.get()'
router.get('/', (req, res) =>{
    res.json(BlogPosts.get());
})

//when root of this route is called with POST
//Make sure title, content, author in request body

router.post('/', jsonParser, (req,res) => {

const requiredFields = ['title', 'content', 'author'];
for (let i=0; i<requiredFields.length; i++){
    const field = requiredFields[i];
    if (!(field in req.body)){
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
    }
}


const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
res.status(201).json(item);
});

//when root of this route is called with PUT
//Make sure title, content, author, id in request body
//Make sure requested id in body matches id in requested url

router.put('/:id', jsonParser, (req,res)=>{
    const requiredFields = ['id','title','content','author'];
    for(let i=0; i<requiredFields.length; i++){
        const field = requiredFields[i];
        if(!(field in req.body)){
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }

    if(req.params.id !== req.body.id){
        const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
        console.error(message);
        return res.status(400).send(message);
    }

    console.log(`Updating blog post \`${req.params.id}\``);
    BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    })
    res.status(204).end();
})

//when root of this route is called with DELETE
//Make sure title, content, author, id in request body
//Make sure requested id in body matches id in requested url

router.delete('/:id', jsonParser, (req,res)=>{
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blog post \`${req.params.ID}\``);
    res.status(204).end();
});


module.exports = router;