import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@lien.com' },
    update: {},
    create: {
      email: 'admin@lien.com',
      passwordHash: adminPassword,
      nickname: 'Admin',
      role: 'ADMIN',
      verificationStatus: 'APPROVED',
      verifiedAt: new Date(),
    },
  })

  console.log('✅ Created admin user:', admin.email)

  // Create Sample Cast
  const castPassword = await bcrypt.hash('cast123', 10)

  const cast = await prisma.user.upsert({
    where: { email: 'sakura@example.com' },
    update: {},
    create: {
      email: 'sakura@example.com',
      passwordHash: castPassword,
      nickname: 'Sakura',
      role: 'CAST',
      verificationStatus: 'APPROVED',
      verifiedAt: new Date(),
      cast: {
        create: {
          age: 24,
          location: 'Tokyo, Roppongi',
          languages: ['ja', 'en'],
          interests: ['fashion', 'travel', 'art'],
          bodyMeasurements: '165cm / 48kg',
          bio: 'Passionate about art and elegance. I love exploring new cultures and fashion trends.',
          tierClassification: 'HIGH_CLASS',
          isActive: true,
          isFeatured: true,
          approvedAt: new Date(),
        },
      },
    },
  })

  console.log('✅ Created sample cast:', cast.email)

  // Create Sample Member
  const memberPassword = await bcrypt.hash('member123', 10)

  const member = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      passwordHash: memberPassword,
      nickname: 'John',
      role: 'MEMBER',
      verificationStatus: 'APPROVED',
      verifiedAt: new Date(),
      member: {
        create: {
          tier: 'PREMIUM',
          isPaid: true,
          approvedAt: new Date(),
        },
      },
    },
  })

  console.log('✅ Created sample member:', member.email)

  console.log('\n🎉 Seed completed successfully!')
  console.log('\n📝 Test Credentials:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Admin:  admin@lien.com / admin123')
  console.log('Cast:   sakura@example.com / cast123')
  console.log('Member: john@example.com / member123')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
