import { prisma } from "../lib/dbConnector";
import { verifyToken } from "../lib/tokenHandler";
export * as certificateController from "../controller/certificate.controller";

export const requestCertificate = async (req, res, next) => {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthorized: Bearer token required',
            });
        }

        const { skType, skData } = req.body;
        const user = verifyToken(req.headers.access_token);

        if (skType === 'SKDI') {
            if (skData.nik && skData.instance && skData.instanceAddress) {
                const certificate = await prisma.certificate.create({
                    data: {
                        user: {
                            connect: {
                                id: user.id,
                            },
                        },
                        skType: 'SKDI',
                        skStatus: 'VERIFY',
                        skData: {
                            nik: skData.nik,
                            instance: skData.instance,
                            instanceAddress: skData.instanceAddress,
                        },
                    },
                });
                res.status(201).json({ success: true, data: certificate });
            } else {
                res.status(400).json({
                    success: false,
                    error: 'Missing required payload fields: nik, instance, and instanceAddress',
                });
            }
        }

    } catch (error) {
        next(error);
    }
};

export const getCertificate = async (req, res, next) => {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthorized: Bearer token required',
            });
        }

        const user = verifyToken(req.headers.access_token);

        const userCertificate = await prisma.certificate.findMany({
            where: { userId: user.id },
        });

        if (!userCertificate) {
            return res.status(404).json({
                status: 404,
                message: "Certificate not found",
            });
        } else {
            res.json({
                status: 200,
                certificate: userCertificate,
            });
        }
    } catch (error) {
        next(error);
    }
};