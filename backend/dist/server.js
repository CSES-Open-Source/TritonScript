"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const note_1 = __importDefault(require("./routes/note"));
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const catalog_1 = __importDefault(require("./routes/catalog"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5005;
// Middleware
app.use(express_1.default.json());
app.options('*', (0, cors_1.default)());
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_fileupload_1.default)());
app.use((req, _res, next) => {
    console.log(req.path, req.method);
    next();
});
// Routes
app.use('/api/notes', note_1.default);
app.use('/api/auth', auth_1.default);
app.use('/api/user', user_1.default);
app.use('/', catalog_1.default);
// Start server (Prisma connects lazily on first query)
app.listen(PORT, () => {
    console.log(`Listening for requests on port ${PORT}`);
});
