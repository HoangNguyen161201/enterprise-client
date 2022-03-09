// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import httpProxy, { ProxyResCallback } from 'http-proxy';
import Cookies from 'cookies';

//Config body parser let pass to server api by proxy server
export const config = {
  api: {
    bodyParser: false,
  },
};

//Create server proxy
const proxy = httpProxy.createProxyServer();

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  //Check method
  if (req.method !== 'POST') {
    return res.status(400).json({
      err: 'Method not valid.',
    });
  }

  //Return promise
  return new Promise((resolve) => {
    const cookies = new Cookies(req, res);

    //Don't send cookies to API server
    req.headers.cookie = '';

    //Proxy server send req and res to target server
    // /api/students => http://localhost:4000/api/students
    proxy.web(req, res, {
      target: process.env.API_URL,
      changeOrigin: true,
      selfHandleResponse: true,
    });

    //Because selfHandleResponse is true so need to response
    const handleLoginResponse: ProxyResCallback = (proxyRes, req, res) => {
      let body = '';
      proxyRes.on('data', function (chunk) {
        body += chunk;
      });

      proxyRes.on('end', function () {
        console.log(body)
        try {
          const { accessToken, refreshToken, status, msg, err, statusCode } = JSON.parse(body);

          if (status === 'success') {
            //Save refresh token to cookie
            cookies.set('refresh_token', refreshToken.token, {
              httpOnly: true,
              sameSite: 'lax',
              expires: new Date(refreshToken.exp * 1000),
            });

            ;(res as NextApiResponse).status(statusCode).json({
              status,
              accessToken,
              msg,
              err,
            });
          } else {
            ;(res as NextApiResponse).status(400).json(body)
          }
        } catch (error) {
          ;(res as NextApiResponse).status(500).json({
            err: 'Something went wrong.',
          });
        }
        resolve(true);
      });
    };

    proxy.once('proxyRes', handleLoginResponse);
  });
}
