import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  try {
    await prisma.$connect()
    console.log('Successfully connected to the database')
    const user = await prisma.user.findFirst()
    console.log('Successfully queried the database:', user)
  } catch (error) {
    console.error('Error connecting to the database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()