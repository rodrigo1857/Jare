

export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {
    if (!file) {
        req['fileValidationError'] = 'File is empty';
        return callback(null, false);
    }

    const fileExtension = file.mimetype.split('/')[1];
    const validExtension = ['jpg', 'png', 'jpeg'];

    if (validExtension.includes(fileExtension)) {
        return callback(null, true);
    } else {
        req['fileValidationError'] = 'File extension not valid';
        return callback(null, false);
    }
}