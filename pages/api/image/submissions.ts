import { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from 'app/config/cloudinary'

const getAllImg = async (req: NextApiRequest, res: NextApiResponse) => {
  const data: { resources: Array<any> } = await cloudinary.api.resources_by_tag('submission', {
    max_results: 60,
  });
  const imgs = data.resources.map((item: { secure_url: string }) => item.secure_url);
  return res.status(200).json({
    imgs,
    msg: 'get all image success',
    statusCode: 200,
  });
};

export default getAllImg;
