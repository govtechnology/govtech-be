import bcryptjs from "bcryptjs";
import { prisma } from "../lib/dbConnector";
import { generateToken, verifyToken } from "../lib/tokenHandler.js";
import { createHash } from "crypto";

export * as authController from "../controller/auth.controller";

export const signUp = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const existingUsers = await prisma.user.findFirst({
            where: { email: email },
        });

        if (existingUsers) {
            return res.status(400).json({
                status: 400,
                message: 'Email address is already in use.',
            });
        } else {

            const saltRounds = 12;
            const hashPassword = await bcryptjs.hash(password, saltRounds);

            const users = await prisma.user.create({
                data: {
                    name,
                    email,
                    role: 'user',
                    password: hashPassword,
                },
            });
            res.status(201).json({ success: true, data: users });
        }
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
        const passwordMatch = await bcryptjs.compare(password, user.password);
        if (!passwordMatch) {
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