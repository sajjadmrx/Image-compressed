const fs = require('fs');
const sharp = require('sharp');

// Input and output folders
const inputFolder = 'images'; 
const outputFolder = 'updatedFiles'; 

const targetFileSizeKB = 500;

if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

fs.readdir(inputFolder, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  files.forEach((file) => {
    const inputFilePath = `${inputFolder}/${file}`;
    const outputFilePath = `${outputFolder}/${file}`;

    const inputBuffer = fs.readFileSync(inputFilePath);

    const originalSizeKB = inputBuffer.length / 1024;
    let qualityFactor = (targetFileSizeKB / originalSizeKB) * 100;

    // Dynamically adjust the quality factor within the valid range (1 to 100)
    qualityFactor = qualityFactor > 100 ? 100 : qualityFactor < 1 ? 1 : qualityFactor;
    if (qualityFactor < 10) {
      qualityFactor = 50
    }
    qualityFactor = Number(qualityFactor.toFixed())

    sharp(inputBuffer)
      .resize({ withoutEnlargement: true }) 
      .png({ quality: 60, force: true, compressionLevel: 9 })
      .toFile(outputFilePath, (err) => {
        if (err) {
          console.error(`Error saving ${outputFilePath}: ${err}`);
        } else {
          console.log(`Image compressed successfully: ${outputFilePath}`);
        }
      });
  });
});
