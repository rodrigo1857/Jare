

export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {



    if(!file) return callback(new Error('File is empty'),false)
    console.log(file);

    const fileExtension = file.mimetype.split('/')[1];
    const validExtension=['jpg','png','jpge','gif']

    if(validExtension.includes(fileExtension)){
        return callback(null,true)
    }
    callback(null,false)
}