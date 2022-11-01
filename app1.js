const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-david:Test123@cluster0.xke59zq.mongodb.net/todolistDB", { useNewUrlParser: true });
const itemsSchema = {
    name: String
}

const Item = mongoose.model("Item", itemsSchema);
const myItems = [];



app.get('/', function (req, res) {
    Item.find({}, function (err, foundItems) {
        if (err) {
            console.log(err);
        } else {
            res.render('list', { listTitle: "Today", newListItems: foundItems });
        }
    });
});



app.post('/', function (req, res) {
    const itemName = req.body.newItem;


    const item = new Item({
        name: itemName
    });
    myItems.push(item);
    item.save();
    res.redirect('/');
});

app.post('/delete', function (req, res) {
    const checkedItemId = req.body.checkbox;
    const index = myItems.findIndex(item => item.id === checkedItemId);
    Item.findByIdAndRemove(checkedItemId, function (err) {
        if (!err) {
            console.log("Successfully deleted checked item.");
        }
    });
    myItems.splice(index, 1);
    res.redirect('/');
});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3001;
}

app.listen(port, () => console.log(`Server has started successfully ${port}!`));