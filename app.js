require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const rescollectionRoutes = require("./routes/rescollection");

mongoose
	.connect(process.env.ATLAS_DATABASE_HOST, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => {
		console.log("DB CONNECTED");
	})
	.catch((e) => {
		console.log(e);
		console.log("DB NOT CONNECTED");
	});

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//My Routes
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/collection/", rescollectionRoutes);
const User = require("./models/user");
const ResCollection = require("./models/rescollection");
app.use("/userlist", function (req, res) {
	console.log("hey");
	User.find({}, function (err, users) {
		var userMap = [];
		console.log("USERS", users);
		console.log("err", err);
		for (let index = 0; index < users.length; index++) {
			const user = users[index];
			var list2 = [];
			var pointer = 0;
			var json = {};

			ResCollection.ResCollection.find(
				{
					_id: user.rescollection,
				},
				function (err, list) {
					list2.push({
						email: user.email,
						"rescollection size": user.rescollection.length,
						"stars size": user.starred.length,
						rescollection: list,
					});

					if (index == users.length - 1) res.send(list2);
				}
			);
		}
	});
});

//dot env see docs for more explaination
const port = process.env.PORT || 8000;

app.listen(port, () => {
	console.log(`app is running at ${port}`);
});
