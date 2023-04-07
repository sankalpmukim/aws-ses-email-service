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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBulkTransactionalEmail = exports.sendTransactionalEmail = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
aws_sdk_1.default.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: (_a = process.env.AWS_REGION) !== null && _a !== void 0 ? _a : `ap-south-1`,
});
// verify credentials are loaded
aws_sdk_1.default.config.getCredentials(function (err) {
    var _a, _b;
    if (err)
        console.log(err.stack);
    // credentials not loaded
    else {
        console.log("Access key:", (_a = aws_sdk_1.default.config.credentials) === null || _a === void 0 ? void 0 : _a.accessKeyId);
        console.log("Secret access key:", (_b = aws_sdk_1.default.config.credentials) === null || _b === void 0 ? void 0 : _b.secretAccessKey);
    }
});
const SES = new aws_sdk_1.default.SES({
    apiVersion: "2010-12-01",
    region: (_b = process.env.AWS_REGION) !== null && _b !== void 0 ? _b : `ap-south-1`,
});
const sendTransactionalEmail = ({ to, from, subject, body, }) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        Destination: {
            ToAddresses: [to],
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: body,
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: subject,
            },
        },
        Source: from !== null && from !== void 0 ? from : process.env.FROM_EMAIL,
    };
    const sendPromise = SES.sendEmail(params).promise();
    const data = yield sendPromise;
    return data;
});
exports.sendTransactionalEmail = sendTransactionalEmail;
const sendBulkTransactionalEmail = ({ recipients, from, subject, body, }) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        Destination: {
            BccAddresses: recipients,
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: body,
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: subject,
            },
        },
        Source: from !== null && from !== void 0 ? from : process.env.FROM_EMAIL,
    };
    const sendPromise = SES.sendEmail(params).promise();
    const data = yield sendPromise;
    console.log(data);
    return data;
});
exports.sendBulkTransactionalEmail = sendBulkTransactionalEmail;
