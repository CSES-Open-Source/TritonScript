"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const note_1 = __importDefault(require("./routes/note"));
const multer_1 = __importDefault(require("multer"));
const app = (0, express_1.default)();
const storage = multer_1.default.memoryStorage(); // Store files in memory for now
exports.upload = (0, multer_1.default)({ storage });
// Middleware
// Middleware to parse form data (without files)
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(exports.upload.none());
app.use((req, res, next) => {
    console.log("Headers:", req.headers);
    console.log(req.path, req.method);
    next();
});
// Routes
app.use('/api/notes', note_1.default);
// Connect to database
const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 5000;
if (!CONNECTION_URL) {
    console.error('Database connection URL is not defined in environment variables.');
    process.exit(1);
}
mongoose_1.default.connect(CONNECTION_URL)
    .then(() => {
    console.log('Connected to database');
    app.listen(PORT, () => {
        console.log(`Listening for requests on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error('Database connection error:', err);
});
