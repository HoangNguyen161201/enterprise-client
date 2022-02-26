import { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from 'app/config/cloudinary';

const download = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST')
    return res.status(401).json({
      statusCode: 401,
      err: 'You do not have access.',
    });
  const { tag } = req.body;

  const data = await cloudinary.utils.download_zip_url({
    tags: [tag],
    resource_type: 'raw',
  })

  console.log(data)

  res.status(200).json({
    statusCode: 200,
    msg: 'Download file success',
  });
};

export default download;
