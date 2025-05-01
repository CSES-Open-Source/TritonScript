"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var express_1 = require("express");
var mongoose_1 = require("mongoose");
var note_1 = require("./routes/note");
var app = (0, express_1.default)();
// Middleware
// Middleware to parse form data (without files)
app.use(express_1.default.json());
app.use(function (req, res, next) {
    console.log("Headers:", req.headers);
    console.log(req.path, req.method);
    next();
});
// Routes
app.use('/api/notes', note_1.default);
// Connect to database
var CONNECTION_URL = process.env.CONNECTION_URL;
var PORT = process.env.PORT || 5000;
if (!CONNECTION_URL) {
    console.error('Database connection URL is not defined in environment variables.');
    process.exit(1);
}
mongoose_1.default.connect(CONNECTION_URL)
    .then(function () {
    console.log('Connected to database');
    app.listen(PORT, function () {
        console.log("Listening forr requests on port ".concat(PORT));
    });
})
    .catch(function (err) {
    console.error('Database connection error:', err);
});
