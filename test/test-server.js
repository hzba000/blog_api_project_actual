const chai = require("chai");
const chaiHttp = require("chai-http");

const {app, runServer, closeServer} = require("../server");

const expect = chai.expect;

chai.use(chaiHttp);

describe("Blog Posts", function(){
    
    before(function(){
        return runServer();
    });

    after(function(){
        return closeServer();
    });

    it("should list blog posts on GET", function(){
        return chai
            .request(app)
            .get("/blog-posts")
            .then(function(res){
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a("array");
                expect(res.body.length).to.be.at.least(1);
                const expectedKeys = ["title", "content", "author"];
                res.body.forEach(function(item){
                    expect(item).to.be.a("object");
                    expect(item).to.include.keys(expectedKeys);
                });
            });
    });

    it("should add blog posts on POST", function(){
        const newPost = {title: "Adventures of Manny", content:"Manny is happy because he has a cake!", author:"Nikki"};
        return chai
            .request(app)
            .post("/blog-posts")
            .send(newPost)
            .then(function(res){
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a("object");
                expect(res.body).to.include.keys("title", "content", "author");
                expect(res.body.id).to.not.equal(null);
                expect(res.body.title).to.equal(newPost.title);
                expect(res.body.content).to.equal(newPost.content);
                expect(res.body.author).to.equal(newPost.author);

            });
    });

    it("should update blog posts on PUT", function(){
        const updateData = {
            title: "The REPLACER",
            content: "He replaces content with PUT",
            author: "Jack Stevens"
        };

        return(
            chai
                .request(app)
                .get("/blog-posts")
                .then(function(res){
                    updateData.id = res.body[0].id;
                    
                    return chai 
                        .request(app)
                        .put(`/blog-posts/${updateData.id}`)
                        .send(updateData);
                })

                .then(function(res){
                    expect(res).to.have.status(204);
                })
        );
    });

    it("should delete blog posts on DELETE", function(){
        return(
            chai    
                .request(app)
                .get("/blog-posts")
                .then(function(res){
                    return chai.request(app).delete(`/blog-posts/${res.body[0].id}`);
                })
                .then(function(res){
                    expect(res).to.have.status(204);
                })
        );
    });
});

