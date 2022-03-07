import { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from 'app/config/cloudinary';

const download = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST')
    return res.status(401).json({
      statusCode: 401,
      err: 'You do not have access.',
    });
  const { tag } = req.body;

  const url = await cloudinary.utils.download_zip_url({
    tags: [tag],
    resource_type: 'raw',
  })

  return res.status(200).json({
    statusCode: 200,
    msg: 'Download file success',
    url
  });
};

export default download;
