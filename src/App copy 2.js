import AWS from "aws-sdk";
import { useState } from "react";

function App() {
  // Create state to store file
  const [file, setFile] = useState(null);

  // Function to upload file to s3
  const uploadFile = async () => {
    // S3 Bucket Name
    const S3_BUCKET = "aipaint407";

    // S3 Region
    const REGION = "eu-west-2";

    // S3 Credentials
    AWS.config.update({
      accessKeyId: "AKIASHKK6YEOJD2IUYKX",
      secretAccessKey: "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",
    });
    const s3 = new AWS.S3({
      params: { Bucket: S3_BUCKET },
      region: REGION,
    });

    // Files Parameters

    const params = {
      Bucket: S3_BUCKET,
      Key: file.name,
      Body: file,
    };

    // Uploading file to s3

    var upload = s3
      .putObject(params)
      .on("httpUploadProgress", (evt) => {
        // File uploading progress
        console.log(
          "Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%"
        );
      })
      .promise();

    await upload.then((err, data) => {
      console.log(err);
      // Fille successfully uploaded
      alert("File uploaded successfully.");
    });
  };
  // Function to handle file and store it to file state
  const handleFileChange = (e) => {
    // Uploaded file
    const file = e.target.files[0];
    // Changing file state
    setFile(file);
  };
  return (
    <div className="App">
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={uploadFile}>Upload</button>
        {/* <img src="https://aipaint407.s3.eu-west-2.amazonaws.com/NSHM_PHOTO_2024_12_6_00_38_23.jpg" alt="test" /> */}
      </div>
    </div>
  );
}

export default App;