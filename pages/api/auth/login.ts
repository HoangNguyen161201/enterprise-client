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
    const handleLoginResponse: ProxyResCallback = async (proxyRes, req, res) => {
      let body = '';
      proxyRes.on('data', function (chunk) {
        body += chunk;
      });

      proxyRes.on('end', function () {
        console.log(body)
        try {
          const { accessToken, refreshToken, status, msg, err, statusCode } = JSON.parse(body);

  
            ;(res as NextApiResponse).status(400).json({
              err:' faslse nha ncon'
            })
          
        } catch (error: any) {
          console.log(error)
          ;(res as NextApiResponse).status(500).json({
            err: 'Something went wrong, hahaha',
          });
        }
        resolve(true);
      });
    };

    proxy.once('proxyRes', handleLoginResponse);
  });
}
