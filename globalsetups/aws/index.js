import AWS from "aws-sdk"
import { nanoid } from "nanoid"
import _ from "lodash"

AWS.config.update({
    accessKeyId: "AKIAYRGQ44ZVBPYEUFW5",
    secretAccessKey: "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"
})

const myBucket = new AWS.S3({
    params: { Bucket: "ikshvakubucket" },
    region: "ap-south-1",
})
// export const uploadObject = async ({ file, filename }, callback) => {

//     const params = {
//         ACL: 'public-read',
//         Body: file,
//         Bucket: "ikshvakubucket",
//         Key: filename
//     }
//     await myBucket.upload(params)
//         .on('httpUploadProgress', (evt) => {
//             return (Math.round((evt.loaded / evt.total) * 100))
//         })
//         .send((err, data) => {
//             callback(err, data)
//         })
// }
export const uploadObject = async ({ file },callback) => {
console.log(file)
    const params = {
        ACL: 'public-read',
        Body: file,
        Bucket: "ikshvakubucket",
        Key: "sih_"+nanoid(9)+".csv"
    }
    await myBucket.upload(params)
        .on('httpUploadProgress', (evt) => {
            return (Math.round((evt.loaded / evt.total) * 100))
        })
        .send((err, data) => {
            callback(err, data)
        })
}
