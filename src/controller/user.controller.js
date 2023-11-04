import { prisma } from "../lib/dbConnector";

export * as userController from "../controller/user.controller";

export const getUser = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();

    if (users.length === 0) {
      return res.status(404).json({ message: "No User found" });
    }
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { name, email, role, password } = req.body;

    const users = await prisma.user.create({
      data: {
        name,
        email,
        role,
        password,
      },
    });
    res.status(201).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const deleteUserById = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await prisma.user.delete({
      where: { id: user.id },
    });

    res.status(200).json({ message: `User ${user.name} deleted` });
  } catch (error) {
    next(error);
  }
};

export const updateUserByAuth = async (req, res, next) => {
  const { userId } = req.params;
  const { name, email, role, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email !== existingUser.email) {
      return res
        .status(400)
        .json({ message: "Email does not match the existing user's email" });
    }

    if (password !== existingUser.password) {
      return res.status(400).json({
        message: "Password does not match the existing user's password",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        name,
        email,
        role,
        password,
      },
    });

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
};
