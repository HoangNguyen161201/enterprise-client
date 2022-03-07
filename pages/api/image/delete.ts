import { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from 'app/config/cloudinary';

const deleteFile = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST')
    return res.status(401).json({
      statusCode: 401,
      err: 'You do not have access.',
    });
  const { public_id, tag } = req.body;

  //Delete files by tag
  if (tag)
    await cloudinary.api.delete_resources_by_tag(tag, {
      resource_type: 'raw',
    });

  //Delete files by public id
  if (public_id)
    await cloudinary.uploader.destroy(public_id, {
      resource_type: 'raw',
    });

  return res.status(200).json({
    statusCode: 200,
    msg: 'delete file success',
  });
};

export default deleteFile;
