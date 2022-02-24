import { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from 'app/config/cloudinary';

const deleteFile = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST')
    return res.status(401).json({
      err: 'ban khong co quyen',
    });
  const { public_id, tag } = req.body;

  if (tag) await cloudinary.api.delete_resources_by_tag(tag, {
    resource_type: 'raw'
  });
  if (public_id)
    await cloudinary.uploader.destroy(public_id, {
      resource_type: 'raw',
    });

  res.status(200).json({
    statusCode: 200,
    msg: 'delete file success',
  });
};

export default deleteFile;
