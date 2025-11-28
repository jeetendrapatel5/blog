import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import methodOverride from "method-override";

const app = express();
const PORT = process.env.PORT || 3000;

let posts = JSON.parse(fs.readFileSync("./data/posts.json", "utf-8"));
let contacts = JSON.parse(fs.readFileSync("./data/contacts.json", "utf-8"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");

app.get('/', (req, res) => {
    res.render('index.ejs');
})

app.get('/about', (req, res) => {
    res.render('about.ejs');
})

app.get('/contact', (req, res) => {
    res.render('contact.ejs');
})

app.get('/blog', (req, res) => {
    res.render('blog.ejs', { posts });
})

app.get('/write', (req, res) => {
    res.render('writeblog.ejs');
})

app.get('/blog/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const post = posts.find(p => p.id === postId);
    
    if (!post) {
        return res.status(404).send('Post not found');
    }

    res.render('blogpost.ejs', { post });
});

app.get('/blog/:id/edit', (req, res) => {
    const id = parseInt(req.params.id);
    const post = posts.find(p => p.id === id);

    if (!post) return res.status(404).send('Post not found');

    res.render('editblog.ejs', { post });
})

app.post('/write', (req, res) => {
    const { title, content } = req.body;
    const newPosts = {
        heading: title,
        body: content,
        id: posts.length + 1
    }
    posts.push(newPosts);

    fs.writeFileSync("./data/posts.json", JSON.stringify(posts, null, 2));

    res.redirect('/blog');
    
})

app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;
    const newContact = {
        clientName: name,
        clientEmail: email,
        clientMessage: message,
        id: contacts.length + 1
    }
    contacts.push(newContact);

    fs.writeFileSync("./data/contacts.json", JSON.stringify(contacts, null, 2));
    res.redirect('/');

})

app.delete('/blog/:id', (req, res) => {
    const pId = parseInt(req.params.id);

    posts = posts.filter(p => p.id !== pId);

    fs.writeFileSync("./data/posts.json", JSON.stringify(posts, null, 2));

    res.redirect('/blog');
})

app.put('/blog/:id/', (req, res) => {
    const pId = parseInt(req.params.id);
    const { title, content } = req.body;

    const index = posts.findIndex(p => p.id === pId);

    if (index !== -1) {
        posts[index].heading = title;
        posts[index].body = content;
        fs.writeFileSync("./data/posts.json", JSON.stringify(posts, null, 2));
        res.redirect(`/blog/${pId}`);
    } else {
        res.status(404).send('Post not found');
    }

});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})