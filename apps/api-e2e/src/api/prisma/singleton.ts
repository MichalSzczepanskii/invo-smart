import { PrismaClient } from '@prisma/client';

import prisma from './prisma-client';
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';

jest.mock('./prisma-client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
