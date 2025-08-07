import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const createCast = async (fid: bigint, timestamp: Date, body: any) => {
  return await prisma.cast.create({
    data: {
      fid,
      timestamp,
      body
    }
  })
}

export const upsertCast = async (fid: bigint, timestamp: Date, body: any) => {
  return await prisma.cast.upsert({
    where: { fid_timestamp: { fid, timestamp } },
    update: { body },
    create: {
      fid,
      timestamp,
      body
    }
  })
}

export const getCastByFid = async (fid: bigint) => {
  return await prisma.cast.findMany({
    where: { fid },
    orderBy: { timestamp: 'desc' }
  })
}

export const disconnect = () => prisma.$disconnect() 