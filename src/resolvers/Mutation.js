import {
  hashPassword,
  verifyPassword
} from '../utils/password'
import getUserId from '../utils/getUserId'
import generateToken from '../utils/generateToken'

const Mutation = {
  async loginUser(parent, args, {
    prisma
  }, info) {
    const user = await prisma.query.user({
      where: {
        email: args.data.email
      }
    })
    if (!user) {
      throw new Error("Unable to login.")
    }
    const match = await verifyPassword(args.data.password, user.password)
    if (!match) {
      throw new Error("Unable to login.")
    }

    return {
      user,
      token: generateToken(user.id)
    }
  },

  async createUser(parent, args, {
    prisma
  }, info) {
    const emailTaken = await prisma.exists.User({
      email: args.data.email
    })

    if (emailTaken) {
      throw new Error("Email already used.")
    }

    const hashedPassword = await hashPassword(args.data.password)

    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password: hashedPassword
      }
    })

    return {
      user,
      token: generateToken(user.id)
    }
  },

  async deleteUser(parent, args, {
    prisma,
    request
  }, info) {
    const userId = getUserId(request)

    const userExists = await prisma.exists.User({
      id: userId
    })

    if (!userExists) {
      throw new Error('User not found.')
    }
    return prisma.mutation.deleteUser({
      where: {
        id: userId
      }
    }, info)
  },

  async updateUser(parent, args, {
    prisma,
    request
  }, info) {
    const userId = getUserId(request)

    if (typeof args.data.newPassword === 'string') {
      args.data.password = await hashPassword(args.data.newPassword)
      delete args.data.newPassword
    }
    return prisma.mutation.updateUser({
      where: {
        id: userId
      },
      data: args.data
    }, info)
  }
}


export {
  Mutation as
  default
}