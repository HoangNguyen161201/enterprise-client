import { NextApiRequest, NextApiResponse } from 'next';
import { v2 } from 'cloudinary';

// config cloudinary to update image
v2.config({
  cloud_name: 'hoang161201',
  api_key: '127883878126518',
  api_secret: 'xZXAKvbsWtkYgsZZhG8OQrv5Kqs',
  secure: true,
});

const getAllImg = async (req: NextApiRequest, res: NextApiResponse) => {
  const data: {resources: Array<any> } = await v2.api.resources_by_tag('submission', {
      max_results: 60,
  })
  const imgs = data.resources.map((item: {secure_url: string})=> item.secure_url)
  return res.status(200).json({
      imgs,
      msg: 'get all image success',
      statusCode: 200
  })
};

export default getAllImg;
