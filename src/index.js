import express from "express";
import path from "path";
import bodyParser from "body-parser";

import auth from "./routes/auth";
import users from "./routes/users";
import reservations from "./routes/reservations";
import locations from "./routes/locations";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/reservations", reservations);
app.use("/api/locations", locations);

app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(8080, () => console.log("Running on localhost:8080"));
