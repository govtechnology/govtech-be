import { verifyToken } from "../lib/tokenHandler";
import Session from "../models/session";

export * as sessionController from "../controller/session.controller"

export const get = (req, res, next) => {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
            return res.status(401).json({
              status: 401,
              message: "Unauthorized: Bearer token required",
            });
        }
    
        if (req.query['page'] == null) req.query['page'] = 1;
        if (req.query['size'] == null) req.query['size'] = 10;

        req.query['page'] = parseInt(req.query['page']);
        req.query['size'] = parseInt(req.query['size']);
    
        const tokenData = verifyToken(req.headers.access_token);
        const userId = tokenData.id;
    
        new Session(userId, null).build()
            .then((session) => session.get(req.query['page'], req.query['size']))
            .then((result) => {
                return res.status(200).json({
                    status: 200,
                    message: "OK",
                    pagination: {
                        page: req.query['page'],
                        size: req.query['size'],
                        totalItem: result.total,
                        isFirst: req.query['page'] == 1,
                        isLast: req.query['page'] * req.query['size'] >= result.total,
                        hasNext: req.query['page'] * req.query['size'] < result.total,
                        nextPage: (req.query['page'] * req.query['size'] >= result.total) ? null : ++req.query['page']
                    },
                    data: result.data
                });
            });
    } catch (exception) {
        next(exception);
    }
}
