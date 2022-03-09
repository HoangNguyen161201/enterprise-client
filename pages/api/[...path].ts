// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import httpProxy from 'http-proxy';

//Config body parser let pass to server api by proxy server
export const config = {
  api: {
    bodyParser: false,
  },
};

//Create server proxy
const proxy = httpProxy.createProxyServer();

export default function handle(req: NextApiRequest, res: NextApiResponse<any>) {
  return new Promise((resolve) => {
    //Don't send cookies to API server
    req.headers.cookie = '';

    //Proxy server send req and res to target server
    // /api/students => http://localhost:4000/api/students
    proxy.web(req, res, {
      target: process.env.API_URL,
      changeOrigin: true,
      selfHandleResponse: false,
      secure: true
    });

    //Because self handle response is false, don't need response
    // res.status(200).json({
    //     name: "PATH - Match all here"
    // })        // res.status(200).json({
    //     name: "PATH - Match all here"
    // })

    proxy.once('proxyRes', () => {
      resolve(true);
    });
  });
}
