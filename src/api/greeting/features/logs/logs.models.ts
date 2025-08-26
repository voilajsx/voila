import { PrismaClient } from '../../prisma/generated/client/index.js';

const prisma = new PrismaClient();

export interface CreateGreetingLogData {
  endpoint: string;
  message: string;
  userName?: string;
  userId?: string;
  userRole?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface GreetingLogFilters {
  page?: number;
  limit?: number;
  endpoint?: string;
  userId?: string;
}

export class GreetingLogModel {
  static async create(data: CreateGreetingLogData) {
    return await prisma.greetingLog.create({
      data,
    });
  }

  static async findMany(filters: GreetingLogFilters = {}) {
    const { page = 1, limit = 10, endpoint, userId } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (endpoint) where.endpoint = endpoint;
    if (userId) where.userId = userId;

    return await prisma.greetingLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        endpoint: true,
        message: true,
        userName: true,
        userId: true,
        userRole: true,
        ipAddress: true,
        createdAt: true,
      },
    });
  }

  static async count(filters: GreetingLogFilters = {}) {
    const { endpoint, userId } = filters;
    
    const where: any = {};
    if (endpoint) where.endpoint = endpoint;
    if (userId) where.userId = userId;

    return await prisma.greetingLog.count({ where });
  }

  static async findById(id: string) {
    return await prisma.greetingLog.findUnique({
      where: { id },
    });
  }

  static async deleteById(id: string) {
    return await prisma.greetingLog.delete({
      where: { id },
    });
  }

  static async deleteMany() {
    return await prisma.greetingLog.deleteMany({});
  }

  static async findByEndpoint(endpoint: string, limit: number = 10) {
    return await prisma.greetingLog.findMany({
      where: { endpoint },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  static async findByUserId(userId: string, limit: number = 10) {
    return await prisma.greetingLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}