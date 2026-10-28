
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);

export const uploadDirectory = path.resolve(
    currentDirectory,
    "../../../uploads/ideas"
);

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploadDirectory);
    },

    filename: (req, file, callback) => {
        callback(null, `${randomUUID()}.pdf`);
    },
});

function validatePdf(req, file, callback) {
    if (file.mimetype !== "application/pdf") {
        return callback(new Error("Only PDF files are allowed."));
    }

    callback(null, true);
}

export const uploadIdeaPdf = multer({
    storage,
    fileFilter: validatePdf,
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 1,
    },
}).single("pdf");

// Wrap Multer's callback API in a Promise.
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
