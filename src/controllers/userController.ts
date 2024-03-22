import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import * as joi from 'joi'

// สร้าง instance ของ PrismaClient
const prisma = new PrismaClient()

// Interface สำหรับรับ request body จาก client
interface UserInput {
  email: string
  firstName: string
  lastName: string
  social: {
    facebook?: string
    twitter?: string
    github?: string
    website?: string
  }
}

// Create a new user
// POST /users
const createUser = async (req: Request, res: Response) => {
  const userInput: UserInput = req.body
  //console.log(userInput)

  // Validate the requese body
  const schema = joi.object({
    email: joi.string().email().required(),
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    social: joi.object({
      facebook: joi.string().uri(),
      twitter: joi.string().uri(),
      github: joi.string().uri(),
      website: joi.string().uri()
    })
  })

  // IF the requese body is invalid, return 400 Bad Request
  const { error } = schema.validate(userInput);
  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }

  // Create a new user
  try {
    const user = await prisma.user.create({
      data: {
        email: userInput.email,
        firstName: userInput.firstName,
        lastName: userInput.lastName,
        social: userInput.social
      }
    })
    res.json(user);
  } catch (e) {
    console.error((e as Error).message)
    res.status(500).json({ error: 'Failed to create user' })
  }
}

const getUsers = async (_: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  }
  catch (e) {
    console.error((e as Error).message)
    res.status(500).json({ error: 'Failed to get users' })
  }
}

const getUserById = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      }
    })
    if (!user) {
      console.log(user);
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  }
  catch (e) {
    console.error((e as Error).message)
    res.status(500).json({ error: 'Failed to get users' })
  }
}

const updateUser = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);
  const userInput: UserInput = req.body;

  // Validate the requese body
  const schema = joi.object({
    email: joi.string().email(),
    firstName: joi.string(),
    lastName: joi.string(),
    social: joi.object({
      facebook: joi.string().uri(),
      twitter: joi.string().uri(),
      github: joi.string().uri(),
      website: joi.string().uri()
    })
  })

  // IF the requese body is invalid, return 400 Bad Request
  const { error } = schema.validate(userInput);
  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }

  try {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: userInput,
    })
    res.json(user);
  } catch (e) {
    console.error((e as Error).message);
    res.status(500).json({ error: "Failed to update user" })
  }
}

const deleteUser = async (req:Request,res: Response) =>{
  const userId = parseInt(req.params.userId);
  try{
    await prisma.user.delete({
      where:{
        id:userId
      }
    })
    res.json({ message:"Delete user : " + userId + " successfully"});
  }catch(e){
    console.error((e as Error).message);
    res.status(500).json({ error : "Failed to delete user"})
  }
}

export { createUser, getUsers, getUserById, updateUser, deleteUser}