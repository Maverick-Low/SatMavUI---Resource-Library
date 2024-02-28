import express from 'express';
import multer from 'multer';
import AWS from 'aws-sdk';
import fs from 'fs';
import 'dotenv/config';
import {db, connectToDb} from './db.js';


AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
    signatureVersion: 'v4', // VERY IMPORTANT TO KEEP TO BE ABLE TO ACCESS IMAGES
});

const app = express();
const upload = multer({ dest: 'uploads/' });
const s3 = new AWS.S3();


// Upload a file to AWS S3 Bucket specified in .env
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


// Return an array of object keys -> Identifier for images in bucket
const getImageNames = () => {
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


const retrieveImages = async() => {

    return getImageNames() // Retrieve list of image names
        .then(imageNamesArray => {

            const signedUrlsPromises = imageNamesArray.map(key => {

                // Set the parameters
                const signedUrlParams = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: key,
                    Expires: 60 // URL expiration time in seconds
                };

                return new Promise((resolve, reject) => {
                    
                    // Generate signed URLs for each key
                    s3.getSignedUrl('getObject', signedUrlParams, (err, url) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(url);
                        }
                    });
                });
            });
            return Promise.all(signedUrlsPromises);
        })
        .then(imageURLs => {
            // Return the signed URLs
            return imageURLs;
        })
        .catch(err => {
            throw err; 
        });
}

// Retrieve images from AWS
app.get('/api/retrieve-images', (req, res) => {

    retrieveImages()
    .then(URLs => {
        res.send(URLs);
    })
    .catch(err => {
        console.error(err); 
    });
    
})

// Upload images into the AWS S3 Bucket
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
connectToDb( () => {
    console.log('Succesfully connected to database');
    app.listen(PORT, () => {
        console.log('Server is listening on port ' + PORT);
    });
})
