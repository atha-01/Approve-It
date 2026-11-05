
import multer from "multer";
import { randomUUID } from "node:crypto";

function validatePdf(req, file, callback) {
    if (file.mimetype !== "application/pdf") {
        return callback(new Error("Only PDF files are allowed."));
    }

    callback(null, true);
}

export const uploadIdeaPdf = multer({
    storage: multer.memoryStorage(),

    fileFilter: validatePdf,

    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 1,
    },
}).single("pdf");

export function processIdeaPdfUpload(req, res) {
    return new Promise((resolve, reject) => {
        uploadIdeaPdf(req, res, (error) => {
            if (error) {
                reject(error);
                return;
            }

            resolve();
        });
    });
}

export function generatePdfKey() {
    return `ideas/${randomUUID()}.pdf`;
}
