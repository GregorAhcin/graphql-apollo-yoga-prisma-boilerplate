import prisma from '../../src/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userOne = {
    input: {
        name: "Tatjana",
        email: "tatjana@test.si",
        password: bcrypt.hashSync("tatjana")
    },
    output: undefined,
    token: undefined
}

const userTwo = {
    input: {
        name: "Janez",
        email: "janez@test.si",
        password: bcrypt.hashSync("janezjanez")
    },
    output: undefined,
    token: undefined
}

const seedDatabase = async () => {

    // Clear database
    await prisma.mutation.deleteManyUsers()

    // Seed user to database

    userOne.output = await prisma.mutation.createUser({
        data: userOne.input
    })

    userOne.token = await jwt.sign({
        userId: userOne.output.id
    }, process.env.TOKEN_SECRET)


    userTwo.output = await prisma.mutation.createUser({
        data: userTwo.input
    })

    userTwo.token = await jwt.sign({
        userId: userTwo.output.id
    }, process.env.TOKEN_SECRET)
}

export {
    seedDatabase as
    default, userOne, userTwo
}