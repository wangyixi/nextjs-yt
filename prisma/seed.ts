import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Hash the password before storing
  const hashedPassword = await bcrypt.hash('12345678', 10)
  
  await prisma.user.create({
    data: {
      email: "test1@test.com",
      name: "Test User1",
      password: hashedPassword
    }
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })