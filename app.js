// --- REQUIRE ALL MODULES ---
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

// --- SERVER LISTEN PARAMS ---
const port = 5000;
const host = "localhost";

// --- EXPRESS APP ---
const app = express();

// --SET EXPRESS PUBLIC FOLDER ---
app.use(express.static("public"));

// --- SET VIEW ENGINE ---
app.set('view engine', 'ejs');

// --- BODY PARSER URLENDODED OPTIONS ---
bodyParser.urlencoded({
    extended: true
});

// --- LET Express USE BOY PARSER
app.use(bodyParser.urlencoded({
    extended: true
}));

// --- MONGOOSE PARAMS AND APP ---
mongoose.connect("mongodb+srv://mat-dev:ETI99dfhu.@test-cluster-9yzmf.mongodb.net/test?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Schema = mongoose.Schema;

// --- DEFINE MONGOOSE SCHEMA ---
const blogPostSchema = new Schema({
    title: String,
    body: String
});

const BlogPost = mongoose.model("BlogPost", blogPostSchema);


// --- DEFAULT SITE TEXT ---
const homeText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Bibendum neque egestas congue quisque. Bibendum enim facilisis gravida neque convallis a cras semper auctor. Placerat vestibulum lectus mauris ultrices eros in cursus turpis. Nulla facilisi cras fermentum odio eu feugiat pretium. Purus gravida quis blandit turpis cursus in hac habitasse platea. Ultrices vitae auctor eu augue ut lectus. Nunc id cursus metus aliquam eleifend mi in nulla posuere. Tristique magna sit amet purus gravida quis blandit turpis. Nunc aliquet bibendum enim facilisis gravida neque. Scelerisque in dictum non consectetur. Egestas purus viverra accumsan in nisl nisi scelerisque eu. Eget nunc lobortis mattis aliquam faucibus purus in massa.";
const aboutText = "Leo vel orci porta non pulvinar neque laoreet suspendisse interdum. Cras pulvinar mattis nunc sed blandit libero. Rutrum quisque non tellus orci ac. Rhoncus dolor purus non enim praesent elementum facilisis leo. Fringilla est ullamcorper eget nulla facilisi etiam dignissim. Enim nulla aliquet porttitor lacus luctus accumsan tortor. Maecenas accumsan lacus vel facilisis volutpat est. Volutpat blandit aliquam etiam erat velit scelerisque. Tempor id eu nisl nunc. Eu feugiat pretium nibh ipsum. Sem integer vitae justo eget magna fermentum. Id leo in vitae turpis massa. Donec enim diam vulputate ut. Pulvinar etiam non quam lacus. Ultrices eros in cursus turpis massa tincidunt dui. Rhoncus urna neque viverra justo nec. Nulla facilisi cras fermentum odio eu feugiat. Facilisis volutpat est velit egestas dui. Arcu felis bibendum ut tristique et egestas quis ipsum.";
const contactText = "Lectus quam id leo in vitae turpis massa. Sed risus pretium quam vulputate dignissim suspendisse. Eu non diam phasellus vestibulum lorem sed risus ultricies tristique. Semper risus in hendrerit gravida rutrum quisque. Elit sed vulputate mi sit amet mauris. Dui vivamus arcu felis bibendum ut tristique. Aliquet bibendum enim facilisis gravida neque. Arcu non sodales neque sodales ut etiam sit amet. Pulvinar sapien et ligula ullamcorper malesuada. Nulla facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum. Sagittis nisl rhoncus mattis rhoncus urna neque. Sed velit dignissim sodales ut eu sem. Quam vulputate dignissim suspendisse in est ante.";


// --- GET REQUESTS ---

app.get("/", (req, res) => {
    BlogPost.find({}, (err, posts) => {
        if (err) {
            console.log("FIND POSTS ERROR: " + err)
        } else {
            console.log(posts);


            res.render("home", {
                text: homeText,
                posts: posts
            });

        }

    })

});


app.get("/editlist", (req, res) => {
    BlogPost.find({}, (err, posts) => {
        if (err) {
            console.log("FIND POSTS ERROR: " + err)
        } else {
            console.log(posts);


            res.render("edit", {
                posts: posts
            });

        }

    })

});


app.get("/about", (req, res) => {
    res.render("about", {
        text: aboutText
    });
});

app.get("/contact", (req, res) => {
    res.render("contact", {
        text: contactText
    });
});

app.get("/compose", (req, res) => {
    res.render("compose");
});

app.post("/compose", (req, res) => {
    const post = {};
    post.title = req.body.postTitle;
    post.body = req.body.postBody;

    const blogPost = new BlogPost({
        title: req.body.postTitle,
        body: req.body.postBody
    });


    blogPost.save((err) => {
        if (err) {
            console.log("THERE WAS AN ERRER SAVING THE POST : " + blogPost);
        } else {
            console.log("POST SUCCESSFULLS SAVED");
            res.redirect("/editlist");
        }
    })
});



app.get("/edit/:postId", (req, res) => {
    let postId = req.params.postId;
    postId = postId.trim();

    BlogPost.findById(postId, (err, post) => {
        if (err) {
            console.log("ERROR, BLOG POST NOT FOUND");
            res.redirect("/");
        } else {
            res.render("editpost", {
                post: post
            });
        }
    })
})



app.post("/update", (req, res) => {

    let pos = postId = req.body.postId;
    postId = postId.trim();
    const title = req.body.postTitle;
    const body = req.body.postBody;

    BlogPost.findByIdAndUpdate(postId, {
        title: title,
        body: body
    }, (err) => {
        if (err) {
            console.log("THERE WAS AN ERRER UPDATING THE POST : " + blogPost);
        } else {
            console.log("POST SUCCESSFULLS UPDATED");
            res.redirect("/editlist");
        }
    })
});


app.get("/posts/:postId", (req, res) => {

    let requestedId = req.params.postId;
    requestedId = requestedId.trim();
    console.log("REQUESTEDID IS: " + requestedId);

    BlogPost.findById(requestedId, (err, post) => {
        if (err) {
            console.log("NO MATCH FOUND OR ERROR : " + err);
            res.redirect("/");
        } else {
            res.render("post", {
                post: post
            });
        }
    })

});


app.post("/delete", (req, res) => {
    const idToDelete = req.body.submit
    console.log(idToDelete);
    BlogPost.findByIdAndDelete(idToDelete, (err, post) => {
        if (err) {
            console.log("ERRER WHILE DELETING POST : " + err)
        } else {
            console.log("POST SUCCESSFULLY DELETED.   SEE POST HERE: " + post);
            res.redirect("/");
        }
    })



})




function truncateString(str, num) {
    if (str.length <= num) {
        return str
    } else {
        let sliceString = str.slice(0, num);
        return sliceString
    }

}

app.listen(port, host, () => {
    console.log(`Server is up and listening on ${host}:${port}`);
});