import { Prisma } from '@prisma/client'

const CONNECTION_CODES = new Set([
  'P1000',
  'P1001',
  'P1002',
  'P1003',
  'P1011',
  'P1017',
])

export function isPrismaConnectionError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientInitializationError) return true

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return CONNECTION_CODES.has(error.code)
  }

  if (error instanceof Error) {
    const msg = error.message.toLowerCase()
    return (
      msg.includes('authentication failed') ||
      msg.includes('credentials') ||
      msg.includes('econnrefused') ||
      msg.includes('can\'t reach database') ||
      msg.includes('connection')
    )
  }

  return false
}
