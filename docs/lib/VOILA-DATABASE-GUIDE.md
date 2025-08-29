# Voila Framework - Database Guide & Prisma Integration

**Complete guide to per-app database management with Prisma in Voila Framework.**

## Philosophy

**Per-App Database Isolation** - Each Voila app has its own isolated Prisma setup with dedicated schema, migrations, and generated client, while sharing the same database instance for simplified infrastructure.

**Contract Integration** - Database models and operations integrate seamlessly with Voila's contract system for type safety and validation.

## Architecture Overview

### Per-App Structure
```
src/api/
├── myapp/
│   ├── prisma/
│   │   ├── schema.prisma          # App-specific schema
│   │   ├── migrations/            # Migration files
│   │   └── generated/client/      # Generated Prisma client
│   ├── .env.example              # Database config template
│   └── features/
│       └── users/
│           ├── users.index.ts    # Contract with database operations
│           ├── users.services.ts # Service using Prisma client
│           └── users.types.ts    # Database types from Prisma
```

### Benefits
- ✅ **Isolated Schemas** - Each app has independent database schema
- ✅ **Separate Migrations** - App-specific migration history and management
- ✅ **Type Safety** - Generated clients provide TypeScript types per app
- ✅ **Clean Architecture** - Database concerns isolated per application
- ✅ **Shared Infrastructure** - Single database instance, multiple schemas

## Prisma Commands

All Prisma operations are managed through the unified `voila-prisma` script with per-app isolation.

### Core Commands
```bash
npm run prisma <command> <app-name> [-- prisma-args]
```

### Command Reference

#### Initialize Prisma for App
```bash
npm run prisma init myapp                         # Initialize Prisma setup
npm run prisma init myapp -- --overwrite          # Reinitialize (overwrites existing)
```

#### Schema Management
```bash
npm run prisma db:format myapp                    # Format schema file
npm run prisma db:validate myapp                  # Validate schema syntax
```

#### Client Generation
```bash
npm run prisma db:generate myapp                  # Generate Prisma client
```

#### Database Migrations
```bash
npm run prisma db:migrate myapp -- --name initial     # Create initial migration
npm run prisma db:migrate myapp -- --name add_users   # Create named migration
npm run prisma db:push myapp                          # Push without migration (development)
npm run prisma db:reset myapp                         # Reset database (destructive)
```

#### Development Tools
```bash
npm run prisma db:studio myapp                    # Open Prisma Studio GUI
npm run prisma db:seed myapp                      # Run database seed
```

#### Production Deployment
```bash
npm run prisma db:deploy myapp                    # Deploy migrations (production)
```

## Setup Workflow

### 1. Initialize Prisma for New App
```bash
# Create app structure first
npm run generate app:api ecommerce

# Initialize Prisma setup
npm run prisma init ecommerce
```

**What gets created:**
```
src/api/ecommerce/
├── prisma/
│   ├── schema.prisma          # Generic schema with dummy models
│   └── migrations/            # Empty migrations directory
└── .env.example              # Database configuration template
```

### 2. Configure Database Connection
Add to your root `.env` file:
```bash
# Database Configuration (shared across all apps)
DATABASE_URL="postgresql://username:password@localhost:5432/voila_development"

# Optional: Multi-tenancy support
# VOILA_DB_TENANT=auto
```

### 3. Customize Schema
Edit `src/api/ecommerce/prisma/schema.prisma`:
```prisma
// Remove dummy models and add your business models
generator client {
  provider = "prisma-client-js"
  output   = "./generated/client"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Your actual business models
model Product {
  id          String   @id @default(uuid())
  name        String
  description String?
  price       Decimal
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  @@map("ecommerce_products")  // Table prefix with app name
}

model Order {
  id        String   @id @default(uuid())
  total     Decimal
  status    String
  productId String   @map("product_id")
  product   Product  @relation(fields: [productId], references: [id])
  createdAt DateTime @default(now()) @map("created_at")
  
  @@map("ecommerce_orders")
}
```

### 4. Create Initial Migration
```bash
npm run prisma db:migrate ecommerce -- --name initial
```

### 5. Generate Client
```bash
npm run prisma db:generate ecommerce
```

## Integration with Voila Contracts

### Contract Definition with Database
```typescript
// src/api/ecommerce/features/products/products.index.ts
import type { VoilaFeatureContract } from '@/lib/contracts.js';
import { createFeatureContract } from '@/lib/contracts.js';

export const ProductsContract: VoilaFeatureContract = createFeatureContract({
  name: 'products',
  app: 'ecommerce',
  description: 'Product management with database operations',
  validation: 'essential',

  api: {
    basePath: '/api/ecommerce/products',
    endpoints: [
      {
        method: 'GET',
        path: '/',
        handler: 'ProductsService.getProducts',
        summary: 'Get all products with pagination',
        auth: { type: 'public' }
      },
      {
        method: 'POST',
        path: '/',
        handler: 'ProductsService.createProduct',
        summary: 'Create new product',
        requestSchema: 'CreateProductSchema',
        responseSchema: 'ProductResponse',
        auth: { type: 'private' }
      }
    ]
  },

  dependencies: {
    files: {
      "products.services.ts": {
        appkit: ["util", "logger", "error", "security"],
        external: ["express"],
        relative: ["./products.types", "../../prisma/generated/client"]
      }
    }
  },

  services: {
    provides: ['ProductsService'],
    consumes: []
  },

  events: {
    emits: [{
      namespace: 'ecommerce_products',
      event: 'product.created',
      payload: 'ProductCreatedData',
      description: 'Emitted when new product is created'
    }],
    listens: []
  },

  tests: [
    'should create product with valid data',
    'should retrieve products with pagination',
    'should handle database errors gracefully',
    'should validate product data before saving'
  ]
});

export default ProductsContract;
```

### Service Implementation with Prisma
```typescript
// src/api/ecommerce/features/products/products.services.ts
import { Request, Response } from 'express';
import { utilClass } from '@voilajsx/appkit/util';
import { loggerClass } from '@voilajsx/appkit/logger';
import { errorClass } from '@voilajsx/appkit/error';
import { securityClass } from '@voilajsx/appkit/security';

// Import app-specific Prisma client
import { PrismaClient } from '../../prisma/generated/client/index.js';
import { CreateProductSchema, ProductResponse } from './products.types.js';

const utils = utilClass.get();
const log = loggerClass.get('products.service');
const err = errorClass.get();
const secure = securityClass.get();

// Initialize Prisma client for this app
const prisma = new PrismaClient();

export class ProductsService {
  /**
   * Get all products with pagination
   */
  static async getProducts(req: Request, res: Response): Promise<void> {
    const requestId = utils.uuid();
    
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      
      log.info('Fetching products', { requestId, page, limit });
      
      const [products, total] = await Promise.all([
        prisma.product.findMany({
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.product.count()
      ]);
      
      const response: ProductResponse = {
        success: true,
        data: {
          products,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        },
        requestId,
        timestamp: new Date().toISOString()
      };
      
      log.info('Products fetched successfully', { requestId, count: products.length });
      res.json(response);
      
    } catch (error: any) {
      log.error('Failed to fetch products', { requestId, error: error.message });
      throw err.system('Database operation failed', error);
    }
  }

  /**
   * Create new product
   */
  static async createProduct(req: Request, res: Response): Promise<void> {
    const requestId = utils.uuid();
    
    try {
      // Validate and sanitize input
      const validated = CreateProductSchema.parse(req.body);
      const sanitized = secure.input(validated);
      
      log.info('Creating product', { requestId, name: sanitized.name });
      
      const product = await prisma.product.create({
        data: {
          id: utils.uuid(),
          name: sanitized.name,
          description: sanitized.description,
          price: sanitized.price
        }
      });
      
      // Emit event for other features
      // (Event emission would be implemented here)
      
      const response: ProductResponse = {
        success: true,
        data: { product },
        requestId,
        timestamp: new Date().toISOString()
      };
      
      log.info('Product created successfully', { requestId, productId: product.id });
      res.json(response);
      
    } catch (error: any) {
      log.error('Failed to create product', { requestId, error: error.message });
      
      if (error.code === 'P2002') { // Unique constraint violation
        throw err.business('Product already exists', error);
      }
      
      throw err.system('Database operation failed', error);
    }
  }

  /**
   * Cleanup database connection
   */
  static async disconnect(): Promise<void> {
    await prisma.$disconnect();
  }
}

// Cleanup on process exit
process.on('beforeExit', async () => {
  await ProductsService.disconnect();
});
```

### Type Definitions with Prisma Types
```typescript
// src/api/ecommerce/features/products/products.types.ts
import { z } from 'zod';
import type { Product } from '../../prisma/generated/client/index.js';

// Request validation schemas
export const CreateProductSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  price: z.number().positive()
});

export const UpdateProductSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional()
});

// Response types using Prisma-generated types
export interface ProductResponse {
  success: boolean;
  data: {
    product?: Product;
    products?: Product[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
  requestId: string;
  timestamp: string;
}

// Event payload types
export interface ProductCreatedData {
  productId: string;
  name: string;
  price: number;
  createdAt: string;
}

// Inferred types
export type CreateProductData = z.infer<typeof CreateProductSchema>;
export type UpdateProductData = z.infer<typeof UpdateProductSchema>;

// Re-export Prisma types for external use
export type { Product } from '../../prisma/generated/client/index.js';
```

## Development Workflow

### Daily Development
```bash
# 1. Modify schema as needed
vim src/api/ecommerce/prisma/schema.prisma

# 2. Create migration for changes
npm run prisma db:migrate ecommerce -- --name add_category

# 3. Regenerate client with new types
npm run prisma db:generate ecommerce

# 4. Update service code to use new types
# 5. Test changes
npm run test app:api ecommerce
```

### Schema Evolution
```bash
# Add new field to existing model
npm run prisma db:migrate ecommerce -- --name add_product_category

# Create new model
npm run prisma db:migrate ecommerce -- --name add_inventory_model

# Always regenerate client after schema changes
npm run prisma db:generate ecommerce
```

### Database Seeding
```typescript
// src/api/ecommerce/prisma/seed.ts
import { PrismaClient } from './generated/client/index.js';

const prisma = new PrismaClient();

async function main() {
  // Create sample products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Sample Product 1',
        description: 'A great product for testing',
        price: 29.99
      }
    }),
    prisma.product.create({
      data: {
        name: 'Sample Product 2',
        description: 'Another testing product',
        price: 49.99
      }
    })
  ]);
  
  console.log('Seeded products:', products.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Run seeding:
```bash
npm run prisma db:seed ecommerce
```

## Multi-App Database Management

### Separate Apps, Shared Database
```bash
# Initialize multiple apps with isolated schemas
npm run prisma init ecommerce      # ecommerce_* tables
npm run prisma init userauth       # userauth_* tables  
npm run prisma init analytics      # analytics_* tables
```

### Table Naming Convention
Each app prefixes tables with app name to avoid conflicts:
```prisma
// ecommerce app
model Product {
  @@map("ecommerce_products")
}

model Order {
  @@map("ecommerce_orders")
}

// userauth app  
model User {
  @@map("userauth_users")
}

model Session {
  @@map("userauth_sessions")
}
```

### Cross-App Data Access
```typescript
// When one app needs data from another app's tables
import { PrismaClient as EcommercePrisma } from '../ecommerce/prisma/generated/client/index.js';
import { PrismaClient as UserAuthPrisma } from '../userauth/prisma/generated/client/index.js';

const ecommercePrisma = new EcommercePrisma();
const userAuthPrisma = new UserAuthPrisma();

// Access user data from ecommerce service
const user = await userAuthPrisma.user.findUnique({
  where: { id: userId }
});
```

## Production Deployment

### Migration Deployment
```bash
# Deploy migrations to production (non-interactive)
npm run prisma db:deploy ecommerce

# Check migration status
npm run prisma migrate status ecommerce
```

### Environment Configuration
```bash
# Production environment variables
DATABASE_URL="postgresql://user:pass@prod-db:5432/voila_production"
VOILA_DB_TENANT=production

# Staging environment
DATABASE_URL="postgresql://user:pass@staging-db:5432/voila_staging"  
VOILA_DB_TENANT=staging
```

### Database Backup Strategy
```bash
# Backup before deployments
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# App-specific table backup
pg_dump $DATABASE_URL -t 'ecommerce_*' > ecommerce_backup.sql
```

## Testing with Database

### Test Database Setup
```bash
# Use separate test database
DATABASE_URL="postgresql://user:pass@localhost:5432/voila_test"

# Reset test database before tests
npm run prisma db:push ecommerce -- --force-reset
```

### Service Testing
```typescript
// src/api/ecommerce/features/products/products.test.ts
import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { PrismaClient } from '../../prisma/generated/client/index.js';
import { ProductsService } from './products.services.js';

const prisma = new PrismaClient();

describe('ProductsService', () => {
  beforeEach(async () => {
    // Clean database before each test
    await prisma.product.deleteMany();
  });

  afterEach(async () => {
    // Clean up after each test
    await prisma.product.deleteMany();
  });

  it('should create product successfully', async () => {
    const productData = {
      name: 'Test Product',
      description: 'Test Description',
      price: 29.99
    };

    const req = { body: productData } as any;
    const res = {
      json: jest.fn(),
      status: jest.fn()
    } as any;

    await ProductsService.createProduct(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          product: expect.objectContaining({
            name: 'Test Product'
          })
        })
      })
    );

    // Verify in database
    const products = await prisma.product.findMany();
    expect(products).toHaveLength(1);
    expect(products[0].name).toBe('Test Product');
  });
});
```

## Best Practices

### Schema Design
- **Consistent Naming**: Use snake_case for database fields, camelCase in TypeScript
- **Table Prefixing**: Always prefix tables with app name (`appname_tablename`)
- **UUID Primary Keys**: Use UUIDs for better scalability and security
- **Timestamps**: Include `createdAt` and `updatedAt` on all models
- **Relationships**: Define explicit relationships between models

### Type Safety
- **Always Regenerate**: Run `db:generate` after schema changes
- **Import Types**: Use Prisma-generated types in your service interfaces
- **Validation**: Use Zod schemas for request validation alongside Prisma types
- **Error Handling**: Handle Prisma-specific errors (P2002, P2025, etc.)

### Performance
- **Connection Pooling**: Configure appropriate connection pool sizes
- **Indexes**: Add database indexes for frequently queried fields
- **Pagination**: Always paginate large result sets
- **Select Specific Fields**: Use `select` to fetch only needed fields
- **Batch Operations**: Use `createMany` and `updateMany` for bulk operations

### Security
- **Input Sanitization**: Always sanitize user input before database operations
- **SQL Injection**: Prisma prevents SQL injection, but validate input types
- **Access Control**: Implement proper authorization before database operations
- **Sensitive Data**: Never log sensitive database information

## Troubleshooting

### Common Prisma Issues
```bash
# Schema validation failed
Error: Unknown type "Strig" (did you mean "String"?)
Fix: Check schema syntax and field types

# Migration failed
Error: Migration failed to apply cleanly
Fix: Review migration file and database state
Fix: Use --force-reset for development database

# Client generation failed  
Error: Prisma client generation failed
Fix: Check schema syntax
Fix: Ensure all dependencies are installed
Fix: Delete generated folder and regenerate

# Connection issues
Error: Can't connect to database
Fix: Verify DATABASE_URL in .env
Fix: Check database server is running
Fix: Verify credentials and database exists
```

### App-Specific Issues
```bash
# App not found
Error: App 'myapp' not found
Fix: Ensure app directory exists: src/api/myapp/
Fix: Check app name spelling
Fix: Generate app first: npm run generate app:api myapp

# Prisma not initialized
Error: Prisma not set up for app 'myapp'
Fix: Run: npm run prisma init myapp
Fix: Check if prisma directory exists

# Client import failed
Error: Cannot find module '../../prisma/generated/client'
Fix: Run: npm run prisma db:generate myapp
Fix: Check import path in service files
Fix: Verify client was generated in correct location
```

### Performance Issues
```bash
# Slow queries
Issue: Database queries are slow
Fix: Add indexes to frequently queried fields
Fix: Use select to fetch only needed fields  
Fix: Implement proper pagination

# Connection pool exhausted
Issue: Database connection errors under load
Fix: Configure connection pool limits
Fix: Implement connection cleanup
Fix: Use connection pooling in production
```

---

**The Result**: A robust, type-safe database layer that integrates seamlessly with Voila's contract system while maintaining per-app isolation and enterprise-grade performance.