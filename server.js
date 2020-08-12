var express = require ('express');
var fs = require ('fs');
var path = require("path");
// - needs for path.join 
var app = express();
const PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
// Is this neccessary? 
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Test 
// app.get("/", (request, response) => {
//     response.send("Test!");
// })

// Get/notes - needs to return notes.html (?)
// routes 

app.get('/notes',function(req , res){
    res.sendFile(path.join(__dirname, './public/notes.html'))
});

//  routes API
app.get('/api/notes', function(req ,res){
    res.sendFile(path.join(__dirname, './db/db.json'))
});
 //post route,what ever user post 
app.post("/api/notes", function (req, res) {
    //at first our given file db.json is read and  stored in noteData
    var noteData = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  //request from the user is assign to the newNote
    var newNote = req.body;
    console.log('newNote'+ newNote);
    //to create id now comparing its id with its length and make it to string
    var uniqueId = (noteData.length).toString();
    //new id is created by .id and assigning to uniqueID
    newNote.id = uniqueId;
    console.log("new data enter", newNote);
//so what ever data comes from the user, so it is push to the noteData object
    noteData.push(newNote);
    console.log("inside the array", noteData);
    //the the noteData is written by sync method
    fs.writeFileSync("./db/db.json", JSON.stringify(noteData));
//then the file is send to its respective path;
    res.sendFile(path.join(__dirname, "./db/db.json"))
});
//  delete routes
//route for delete
app.delete("/api/notes/:id", function (req, res) {
    console.log("Called")
    var noteData = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
//what the user enter is captured in choosen variable
    var choosen = req.params.id;
    console.log(choosen)
    var newId = 0;
    //if noteData length is more than zero only we save the file. here filter method is used to save the data(file) except choosen
    if (noteData.length > 0) {
        noteData = noteData.filter(currentNote => {
            return currentNote.id != choosen;
        });
        for (currentNote of noteData) {
            currentNote.id = newId.toString();
            newId++;
        }
        //again write the file of noteData
        fs.writeFileSync("./db/db.json", JSON.stringify(noteData));
        res.sendFile(path.join(__dirname, "./db/db.json"));
    }else return;
});

//display a single character,or return false
app.get("/api/notes/:id", function (req, res) {
    //var choosen = req.params;
    //var myid = choosen.id
    let noteData = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(noteData[Number(req.params.id)]);
    // console.log("index", Number(req.params.id));//it gives index number of object array;
    //console.log("choosen....", myid);
});
app.get('*',function(req , res){
    res.sendFile(path.join(__dirname, './public/index.html'))
});

// start listening on port
app.listen(PORT,function(){
    console.log ('listening to port ' + PORT);
});