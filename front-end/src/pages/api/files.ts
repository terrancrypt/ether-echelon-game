import fs from "fs";
import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";

import pinataSDK from "@pinata/sdk";
const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });

export const config = {
  api: {
    bodyParser: false,
  },
};

const saveFile = async (file: any, fields: any) => {
  try {
    const stream = fs.createReadStream(file.filepath as any);

    const options: any = {
      pinataMetadata: {
        name: fields.name,
        keyvalues: {
          description: fields.description,
        },
      },
    };
    const response = await pinata.pinFileToIPFS(stream, options);

    fs.unlinkSync(file.filepath);

    return response;
  } catch (error) {
    throw error;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const form = new formidable.IncomingForm();
      form.parse(req, async function (err, fields, files) {
        try {
          if (err) {
            console.log({ err });
            return res.status(500).send("Upload Error");
          }

          const response = await saveFile(files.file, fields);
          const { IpfsHash } = response;

          return res.status(200).send(IpfsHash);
        } catch (error) {
          console.log(error);
          res.status(500).json({ error: "Trouble pinning file to IPFS" });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Trouble pinning file to IPFS" });
    }
  } else {
    return res.status(405).send("Method Not Allowed");
  }
}
