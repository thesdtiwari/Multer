var express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  multer = require("multer"),
  path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/public", express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.static(path.join(__dirname, "views")));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Uploads is the Upload_folder_name
    cb(null, "public");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  },
});

var upload = multer({
  storage: storage,
  // limits: { fileSize: maxSize },
  // fileFilter: function (req, file, cb){

  //     // Set the filetypes, it is optional
  //     // var filetypes = /jpeg|jpg|png/;
  //     // var mimetype = filetypes.test(file.mimetype);

  //     // var extname = filetypes.test(path.extname(
  //     //             file.originalname).toLowerCase());

  //     // if (mimetype && extname) {
  //     //     return cb(null, true);
  //     // }

  //     cb("Error: File upload only supports the "
  //             + "following filetypes - " + filetypes);
  //   }
}).single("image");

//connecting mongoose
mongoose.connect("mongodb://localhost:27017/multer", { useNewUrlParser: true });

//Creating mongoose schema and model
var imageSchema = mongoose.Schema({
  name: String,
  image: String,
});

var imageData = mongoose.model("multer", imageSchema);

//Taking data in mongodb
// imageData.create({
//     name : 'Rishabh',
//     image : ''
// })

//retrieving data
// imageData.find({}, (err, data) => {
//   console.log(data);
// });

app.get("/", (req, res) => {
  res.redirect("/add");
});

app.get("/add", (req, res) => {
  res.render("index");
});

app.get("/image", (req, res) => {
  imageData.find({}, function (err, data) {
    res.render("image", { data: data });
  });
});

app.post("/image", upload, (req, res) => {
  var name = req.body.name;
  var image = req.file.path;
  image = image.replace(/\\/g, "/");

  imageData.create({
    name: name,
    image: image,
  });

  imageData.find({}, function (err, data) {
    res.render("image", { data: data });
  });
});

app.listen(3001, process.env.IP, () => {
  console.log("Server started");
});
