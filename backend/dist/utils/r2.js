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
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
exports.url = url;
exports.del = del;
exports.copy = copy;
exports.move = move;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
exports.client = new client_s3_1.S3Client({
    region: "auto",
    endpoint: `https://${process.env.CF_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: `${process.env.R2_ID}`,
        secretAccessKey: `${process.env.R2_SECRET}`,
    },
});
function url(Bucket_1, Key_1) {
    return __awaiter(this, arguments, void 0, function* (Bucket, Key, expire = 60 * 60) {
        const command = new client_s3_1.PutObjectCommand({ Bucket, Key });
        return yield (0, s3_request_presigner_1.getSignedUrl)(exports.client, command, { expiresIn: expire });
    });
}
function del(Bucket_1, Key_1) {
    return __awaiter(this, arguments, void 0, function* (Bucket, Key, strict = false) {
        try {
            yield exports.client.send(new client_s3_1.DeleteObjectCommand({ Bucket, Key }));
        }
        catch (e) {
            if (strict)
                throw e;
        }
    });
}
function copy(Bucket, from, to) {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.client.send(new client_s3_1.CopyObjectCommand({ Bucket, Key: to, CopySource: from }));
    });
}
function move(Bucket, from, to) {
    return __awaiter(this, void 0, void 0, function* () {
        yield copy(Bucket, from, to);
        yield del(Bucket, from);
    });
}
const r2 = {
    client: exports.client,
    url,
    del,
    copy,
    move,
};
exports.default = r2;
