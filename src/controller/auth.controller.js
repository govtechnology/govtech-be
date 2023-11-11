import { prisma } from "../lib/dbConnector";
import { generateToken, verifyToken } from "../lib/tokenHandler.js";
import { createHash } from "crypto";

export * as authController from "../controller/auth.controller";

export const signUp = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const users = await prisma.user.create({
            data: {
                name,
                email,
                role: 'user',
                password,
            },
        });
        res.status(201).json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
};

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findFirst({
            where: { email: email },
        });

        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found",
            });
        }

        if (password !== user.password) {
            return res.status(422).json({
                status: 422,
                message: "Incorrect password!",
            });
        } else {
            const access_token = generateToken({ id: user.id });
            const refresh_token = generateToken({ id: user.id }, false);
            const md5Refresh = createHash("md5").update(refresh_token).digest("hex");

            await prisma.refresh_token.create({
                data: {
                    userId: user.id,
                    token: md5Refresh,
                },
            });

            res.json({
                status: 200,
                access_token,
                refresh_token,
            });
        }
    } catch (error) {
        next(error);
    }
};