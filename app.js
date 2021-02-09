const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const _ = require("lodash")


const app = express();


app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

////// DBs //////


mongoose.connect("mongodb://localhost:27017/wikiDB", {useUnifiedTopology: true, useNewUrlParser: true});

const articleSchema = { 
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

 

app.route('/articles')

        .get(function(req, res){
            Article.find(function(err, foundArticles){
                res.send(foundArticles);
            })
        })

        .post(function(req, res){
            var titlePost = (req.body.title);
            var contentPost = (req.body.content);

            const  newArticle = new Article ({
                title: titlePost,
                content: contentPost
            });

            newArticle.save(function(err){
                if (!err){
                    res.send("Succesfully added a new article.");

                } else {
                    res.send(err);
                }
            });

        })

        .delete( function(req, res){
            
            Article.deleteMany(function(err){
                if(!err){
                    res.send("Successfully delete")
                } else {
                    res.send("Error")
                }
            })
        });


        ////////////   customRoute ///////////

 app.route("/articles/:articleTitle")
 
    .get(function(req, res){
        const articleTitle = _.lowerCase(req.params.articleTitle)
        
        Article.findOne(function(err, result){
             result.forEach(function(post){
                if ( articleTitle === _.lowerCase(post.title)) {
                    res.send(post.content)
                }
            })
            
             //// find and print Content /// 
            // result.forEach(function(post){
            //     if ( articleTitle === _.lowerCase(post.title)) {
            //         console.log(post.content)
            //     }
            // })
        })
    })
    .put(function(req, res){
        Article.update(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            {overwrite: true}, 
            function(err) {
                if(!err) {
                    res.send("Succesfully updated articles")
                }
            }
        );

    })
    .patch(function(req, res){
        Article.update(
            {title: req.params.articleTitle},
            {$set: req.body},
            function(err){
                if(!err) {
                    res.send("Successfully updated articles")
                } else {
                    res.send(err);
                }
            }
        )
    })
    .delete(function(req,res){
        Article.deleteOne(
            {title: req.params.articleTitle},
            function(err){
            if(!err){
                res.send("Successfully delete")
            } else {
                res.send("Error")
            }
        })
    })






app.listen(3000, function() {
    console.log("I love you 3000");
})