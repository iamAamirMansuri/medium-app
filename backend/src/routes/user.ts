import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'

const userRouter = new Hono()

userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
      const body = await c.req.json();
      try {
          const user = await prisma.user.create({
              data: {
                  username: body.username,
                  password: body.password,
          name: body.name
              }
          });
      const payload = {
        sub: user.id,
        role: 'admin',
        exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
      }
      const secret = c.env.mySecretKey
      const token = await sign(payload, secret)
          return c.json({
        message: 'User created successfully',
        token
      })
      } catch(e) {
          c.status(403)
      return c.json({ error: "Something went wrong!" })
      }
  })
  
  userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
      const body = await c.req.json();
      try {
          const user = await prisma.user.findFirst({
              where: {
                  username: body.username,
                  password: body.password,
              }
          });
      if(!user) {
        c.status(403)
        return c.json({ error: "Invalid credentials" })
      }
      const payload = {
        sub: user.id,
        role: 'admin',
        exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
      }
          const secret = c.env.mySecretKey
      const token = await sign(payload, secret)
          return c.json({
        message: 'Welcome back!',
        token
      })
      } catch(e) {
          c.status(403)
      return c.json({ error: "Something went wrong!" })
      }
  })

export default userRouter