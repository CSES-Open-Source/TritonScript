"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
exports.url = url;
exports.del = del;
exports.copy = copy;
exports.move = move;
var client_s3_1 = require("@aws-sdk/client-s3");
var s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
exports.client = new client_s3_1.S3Client({
    region: "auto",
    endpoint: "https://".concat(process.env.CF_ID, ".r2.cloudflarestorage.com"),
    credentials: {
        accessKeyId: "".concat(process.env.R2_ID),
        secretAccessKey: "".concat(process.env.R2_SECRET),
    },
});
function url(Bucket_1, Key_1) {
    return __awaiter(this, arguments, void 0, function (Bucket, Key, expire) {
        var command;
        if (expire === void 0) { expire = 60 * 60; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    command = new client_s3_1.PutObjectCommand({ Bucket: Bucket, Key: Key });
                    return [4 /*yield*/, (0, s3_request_presigner_1.getSignedUrl)(exports.client, command, { expiresIn: expire })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function del(Bucket_1, Key_1) {
    return __awaiter(this, arguments, void 0, function (Bucket, Key, strict) {
        var e_1;
        if (strict === void 0) { strict = false; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, exports.client.send(new client_s3_1.DeleteObjectCommand({ Bucket: Bucket, Key: Key }))];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    if (strict)
                        throw e_1;
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function copy(Bucket, from, to) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.client.send(new client_s3_1.CopyObjectCommand({ Bucket: Bucket, Key: to, CopySource: from }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function move(Bucket, from, to) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, copy(Bucket, from, to)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, del(Bucket, from)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
var r2 = {
    client: exports.client,
    url: url,
    del: del,
    copy: copy,
    move: move,
};
exports.default = r2;
