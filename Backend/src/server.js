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

const getSpecificImageNames = (namesArray) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
    }

    return new Promise( (resolve, reject) => {
        s3.listObjectsV2(params, (err, data) => {
            if(err) {
                reject(err);
            }
            else {    
                const array = namesArray? 
                    data.Contents
                    .map(object => object.Key)
                    .filter(key => namesArray.some(name => key.includes(name.replace(/ /g, "")))) // Only want the corresponding images to the website - remove spaces from name
                    : 
                    data.Contents.map(object => object.Key);
                resolve(array);   
            }
        });
    })
}


const retrieveImages = async(namesArray) => {

    return getSpecificImageNames(namesArray) // Retrieve list of image names / object keys
        .then(imageNamesArray => {           // Generate a signed URL for each image

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
            return imageURLs;  // Return the signed URLs
        })
        .catch(err => {
            throw err; 
        });
}


// Query the database and retrieve all documents in website collection
app.get('/api/retrieve-websites', async (req, res) => {

    const websites = await db.collection('websites').find({}).toArray(); // Array of website objects
    const namesArray = websites.map(website => website.name); // Get names of retrieved websites

    if(websites) {
        // Retrieve corresponding images from AWS S3 Bucket
        retrieveImages(namesArray)
        .then(URLs => {

            // Find corresponding website and attach image URL to website object
            const responseData = {
                websites: websites.map( (website) => ({
                    ...website,
                    image: URLs.find(url => url.includes(website.name.replace(/ /g, "")))// Assign the image URL to the corresponding website
                }))
            };
            res.send(responseData);
            
        })
        .catch(err => {
            console.error(err); 
        });
    }
    else {
        res.sendStatus(404);
    }
})


// Upload images into the AWS S3 Bucket
app.post('/upload', upload.single('image'), (req, res) => {
    const image = req.file;

    if(image && (image.mimetype === 'image/png' || image.mimetype === 'image/jpg'|| image.mimetype === 'image/jpeg' )) {
        uploadFile(image);
        res.send('Image successfully uploaded');
    } 
    else {
        res.send('File is not an image');
    }
})

const PORT = process.env.PORT || 3000;

connectToDb( () => {
    console.log('Succesfully connected to database');
    app.listen(PORT, () => {
        console.log('Server is listening on port ' + PORT);
    });
})
