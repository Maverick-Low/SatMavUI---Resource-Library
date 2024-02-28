import express from 'express';
import multer from 'multer';
import AWS from 'aws-sdk';
import fs from 'fs';
import 'dotenv/config';


AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
});

const app = express();
const upload = multer({ dest: 'uploads/' });
const s3 = new AWS.S3();

const uploadFile = (image) => {
    const fileContent = fs.readFileSync(image.path);

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: image.originalname,
        Body: fileContent,
    };

    // Upload image to AWS S3 Bucket
    s3.upload(params, (err, data) => {
        if(err) {
            console.error('Error uploading file', err);
        } else {
            console.log(`File uploaded successfully. ${data.Location}`);
        }
    });
};

const retrieveImages = () => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
    }

    return new Promise( (resolve, reject) => {
        s3.listObjectsV2(params, (err, data) => {
            if(err) {
                reject(err);
            }
            else {
                const array = data.Contents.map(object => object.Key);
                resolve(array);   
            }
        });
    })
}


app.get('/api/retrieveImages', (req, res) => {
    retrieveImages()
    .then( array => {
        res.send(array);
    })
    .catch(err => {
        console.error('Error retrieving images', err);
    })
})

app.post('/upload', upload.single('image'), (req, res) => {
    const image = req.file;

    if(image && (image.mimetype === 'image/png' || image.mimetype === 'image/jpg' )) {
        uploadFile(image);
        res.send('Image successfully uploaded');
    } 
    else {
        res.send('File is not an image');
    }
})

const PORT = process.env.PORT || 3000;

// console.log('Succesfully connected to database');
app.listen(3000, () => {
    console.log('Server is listening on port ' + PORT);
});
