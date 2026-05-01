/**
 * Final data:
 * First 16 bytes: Salt
 * Second 12 bytes: IV
 * Last 16 bytes: Message Authentication Code
 */

import fs from "fs";
import crypto from "crypto";
import { pipeline } from "stream";
import path from "path";

function encryptFile(filePath, password, outputPath) {
  return new Promise((resolve, reject) => {
    const algorithm = "aes-256-gcm";
    const iv = crypto.randomBytes(12); // 12 bytes according to NIST specification reccomendation
    const salt = crypto.randomBytes(16); // At least 16 bytes also according to NIST specification

    crypto.pbkdf2(password, salt, 1_000_000, 32, "sha512", (err, key) => {
      if (err) return reject(err);

      const input = fs.createReadStream(filePath);
      const parsedPath = path.parse(filePath);
      const outputPathEncrypted = path.join(
        outputPath,
        `${parsedPath.name}.enc`,
      );

      const output = fs.createWriteStream(outputPathEncrypted);
      const magic = Buffer.alloc(8);
      magic.write("MYAPP01M");
      const ext = path.extname(filePath).replace(".", "");
      const extSize = Buffer.from([ext.length]);

      // Prepending the iv and salt into the encrypted data
      output.write(magic);
      output.write(extSize);
      output.write(ext);
      output.write(salt);
      output.write(iv);

      const cipher = crypto.createCipheriv(algorithm, key, iv);

      pipeline(input, cipher, output, (err) => {
        if (err) return reject(err);

        const authTag = cipher.getAuthTag();
        console.log(
          `Salt is: ${salt.toString("hex")} \nIV is: ${iv.toString("hex")} \nMAC is: ${authTag.toString()}`,
        );
        fs.appendFileSync(outputPathEncrypted, authTag);

        resolve(outputPathEncrypted);
      });
    });
  });
}

function decryptFile(filePath, password, outputPath) {
  return new Promise((resolve, reject) => {
    const fd = fs.openSync(filePath);
    const fileSize = fs.fstatSync(fd).size;
    const parsedPath = path.parse(filePath);

    const magic = Buffer.alloc(8);
    fs.readSync(fd, magic, 0, 8, 0);
    if (magic.toString() !== "MYAPP01M")
      return reject("\n\nThis is not an encrypted file.");

    const extSizeBuf = Buffer.alloc(1);
    fs.readSync(fd, extSizeBuf, 0, 1, 8);
    const extSize = extSizeBuf[0];
    console.log(extSize);

    const ext = Buffer.alloc(extSize);
    fs.readSync(fd, ext, 0, extSize, 9);

    const salt = Buffer.alloc(16);
    const iv = Buffer.alloc(12);
    const mac = Buffer.alloc(16);
    const algorithm = "aes-256-gcm";

    fs.readSync(fd, salt, 0, 16, extSize + 8 + 1);
    fs.readSync(fd, iv, 0, 12, extSize + 16 + 8 + 1);
    fs.readSync(fd, mac, 0, 16, fileSize - 16);

    console.log(
      `Salt is: ${salt.toString("hex")} \nIV is: ${iv.toString("hex")} \nMAC is: ${mac.toString("hex")} \n ${magic.length} | ${extSizeBuf.length} | ${ext.length}`,
    );

    const outputPathDecrypted = path.join(
      outputPath,
      `${parsedPath.name}.${ext.toString()}`,
    );

    crypto.pbkdf2(password, salt, 1_000_000, 32, "sha512", (err, key) => {
      if (err) return reject(err);

      const cipher = crypto.createDecipheriv(algorithm, key, iv);
      cipher.setAuthTag(mac);

      const encryptedData = fs.createReadStream(filePath, {
        start: 8 + 1 + extSize + 16 + 12,
        end: fileSize - (16 + 1),
      });
      const output = fs.createWriteStream(outputPathDecrypted);

      pipeline(encryptedData, cipher, output, (err) => {
        if (err) {
          output.destroy();

          fs.unlink(outputPathDecrypted, (unlinkErr) => {
            if (unlinkErr) {
              console.error("Failed to delete corrupted output:", unlinkErr);
            }
          });

          return reject(
            "\n\nDecryption failed, you either have a corrupted file or you're using a wrong password",
          );
        }

        resolve(outputPathDecrypted);
      });
    });
  });
}

export { encryptFile, decryptFile };
