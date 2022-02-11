// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import httpProxy, { ProxyResCallback } from 'http-proxy';
import Cookies from 'cookies';
import { resolve } from 'path';

//Config body parser let pass to server api by proxy server
export const config = {
  api: {
    bodyParser: false,
  },
};

//Create server proxy
const proxy = httpProxy.createProxyServer();

export default function handle(req: NextApiRequest, res: NextApiResponse<any>) {
  //Check Method
  if (req.method !== 'GET') {
    return res.status(400).json({
      err: 'Method not valid.',
    });
  }

  //Return promise
  return new Promise((resolve) => {
    const cookies = Cookies(req, res);

    //Proxy server send req and res to target server
    // /api/students => http://localhost:3000/api/students
    proxy.web(req, res, {
      target: process.env.API_URL,
      changeOrigin: true,
      selfHandleResponse: true,
    });

    const handleAccessTokenResponse: ProxyResCallback = (proxyRes, req, res) => {
      let body = '';
      proxyRes.on('data', function (chunk) {
        body += chunk;
      });

      proxyRes.on('end', function () {
        try {
          const { status, accessToken, msg, err, user, statusCode } = JSON.parse(body);

          //Check if has error will remove refresh token
          if (err) {
            //Remove refresh token
            cookies.set('refresh_token');
          }

          (res as NextApiResponse).status(statusCode).json({
            status,
            accessToken,
            msg,
            err,
            user,
          });
        } catch (error) {
          (res as NextApiResponse).status(500).json({
            err: 'Something went wrong.',
          });
        }
        resolve(true);
      });
    };
    proxy.once('proxyRes', handleAccessTokenResponse);
  });
}
