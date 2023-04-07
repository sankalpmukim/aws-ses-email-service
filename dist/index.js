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
Object.defineProperty(exports, "__esModule", { value: true });
require("./configEnvironment");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const aws_ses_1 = require("./aws-ses");
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// health check
app.get("/", (req, res) => {
    return res.sendStatus(200);
});
// Transactional email endpoint (one to one)
app.post("/send-email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { to, subject, body } = req.body;
        // input validation
        if (!to || !subject || !body) {
            return res.status(400).send("Invalid input");
        }
        const data = yield (0, aws_ses_1.sendTransactionalEmail)({ to, subject, body });
        console.log(`⚡️[aws]:`, data);
        return res.status(200).send(data);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}));
// Marketing email endpoint (one to many)
app.post("/send-bulk-email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { recipients, subject, body } = req.body;
        // input validation
        if (!recipients || !subject || !body) {
            return res.status(400).send("Invalid input");
        }
        const data = yield (0, aws_ses_1.sendBulkTransactionalEmail)({
            recipients,
            subject,
            body,
        });
        console.log(`⚡️[aws]:`, data);
        return res.status(200).send(data);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}));
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
