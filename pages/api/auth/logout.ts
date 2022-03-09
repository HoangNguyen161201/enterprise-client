// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import httpProxy, { ProxyResCallback } from "http-proxy";
import Cookies from "cookies";

//Config body parser let pass to server api by proxy server
export const config = {
    api: {
        bodyParser: false,
    },
};

//Create server proxy
const proxy = httpProxy.createProxyServer();

export default function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    //Check method
    if (req.method !== "POST") {
        return res.status(400).json({
            err: "Method not valid.",
        });
    }

    //Return promise
    return new Promise((resolve) => {
        const cookies = new Cookies(req, res);

        //Don't send cookies to API server
        req.headers.cookie = "";

        //Proxy server send req and res to target server
        // /api/students => http://localhost:3000/api/students
        proxy.web(req, res, {
            target: process.env.API_URL,
            changeOrigin: true,
            selfHandleResponse: true,
            secure: true
        });

        const handleLogoutResponse: ProxyResCallback = (proxyRes, req, res) => {
            let body = "";
            proxyRes.on("data", function (chunk) {
                body += chunk;
            });

            proxyRes.on("end", function () {
                try {
                    const { status, msg, err, statusCode } = JSON.parse(body);

                    //Remove access and refresh token cookie
                    if (status) {
                        cookies.set("refresh_token");
                    }

                    (res as NextApiResponse).status(statusCode).json({
                        status,
                        msg,
                        err,
                    });
                } catch (error) {
                    (res as NextApiResponse).status(500).json({
                        err: "Something went wrong.",
                    });
                }

                resolve(true);
            });
        };

        proxy.once("proxyRes", handleLogoutResponse);
    });
}
