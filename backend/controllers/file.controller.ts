import { RequestHandler } from "express";
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import { error } from "console";
dotenv.config();


export const uploadToS3 = async (file: any, bucketName: string){
    try{
        const s3: AWS.S3 = new AWS.S3( {
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            }
        });

        const newFileName = `pic_${(Date.now()).toString()}.${file.mimetype.split('/')[1]}`
        const params = {
            Bucket: bucketName,
            Key: newFileName,
            Body: file.data
        }

        return new Promise((resolve, reject)=> {
            s3.upload(params, {}, (err, data) => {
                if(err){
                    console.log(err);
                    reject(err);
                } else {
                    console.log(data);
                    resolve(data.Location);
                }
            });
        });

    }catch (e) {
        return e;
    }
}

export const uploadFile: RequestHandler =  async (req: any, res){
    try {
        if (req.files.file.name){
            const result = await uploadToS3(req.files.file, process.env.AWS_S3_BUCKET!);
            return res.status(201).json({
                message: "Success",
                url: result
            })
        }
    }
    catch (e){
        return res.status(400).json(
            { success: false, 
              message: "Something went wrong" }
        );

    }
}