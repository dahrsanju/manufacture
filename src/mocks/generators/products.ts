import { faker } from '@faker-js/faker';
import type { Product, StockLevel } from '@/types';

export interface MockProduct extends Omit<Product, 'stockLevels'> {
  status: 'active' | 'low_stock' | 'out_of_stock';
}

const categories = ['Electronics', 'Components', 'Raw Materials', 'Finished Goods', 'Packaging'];
const units = ['PC', 'KG', 'L', 'M', 'BOX', 'SET'];

export const generateMockProduct = (index: number): MockProduct => {
  const price = faker.number.float({ min: 10, max: 500, fractionDigits: 2 });
  const cost = price * faker.number.float({ min: 0.4, max: 0.7, fractionDigits: 2 });
  const stockLevel = faker.number.int({ min: 0, max: 200 });
  const reorderPoint = faker.number.int({ min: 10, max: 50 });

  return {
    id: faker.string.uuid(),
    sku: `SKU-${String(index + 1).padStart(5, '0')}`,
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    category: faker.helpers.arrayElement(categories),
    brand: faker.company.name(),
    barcode: faker.string.numeric(13),
    price,
    cost,
    currency: 'USD',
    taxRate: faker.helpers.arrayElement([0, 5, 10, 15, 20]),
    unit: faker.helpers.arrayElement(units),
    minStock: faker.number.int({ min: 5, max: 20 }),
    maxStock: faker.number.int({ min: 200, max: 500 }),
    reorderPoint,
    leadTime: faker.number.int({ min: 1, max: 14 }),
    weight: faker.number.float({ min: 0.1, max: 50, fractionDigits: 2 }),
    dimensions: {
      length: faker.number.int({ min: 5, max: 100 }),
      width: faker.number.int({ min: 5, max: 100 }),
      height: faker.number.int({ min: 5, max: 50 }),
      unit: 'cm',
    },
    images: [],
    tags: faker.helpers.arrayElements(['bestseller', 'new', 'sale', 'featured', 'limited'], { min: 0, max: 3 }),
    isActive: faker.datatype.boolean({ probability: 0.9 }),
    isStockable: true,
    status: stockLevel === 0 ? 'out_of_stock' : stockLevel < reorderPoint ? 'low_stock' : 'active',
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  };
};

export const generateMockProducts = (count: number): MockProduct[] => {
  return Array.from({ length: count }, (_, i) => generateMockProduct(i));
};

export const generateMockStockLevels = (): StockLevel[] => {
  return Array.from({ length: faker.number.int({ min: 5, max: 15 }) }, () => ({
    id: faker.string.uuid(),
    productId: faker.string.uuid(),
    warehouseId: faker.string.uuid(),
    warehouseName: faker.helpers.arrayElement(['Main Warehouse', 'Secondary Warehouse', 'Transit Hub']),
    quantity: faker.number.int({ min: 0, max: 200 }),
    reserved: faker.number.int({ min: 0, max: 50 }),
    available: faker.number.int({ min: 0, max: 150 }),
    location: `${faker.helpers.arrayElement(['A', 'B', 'C', 'D'])}-${faker.number.int({ min: 1, max: 20 })}-${faker.number.int({ min: 1, max: 5 })}`,
    zone: faker.helpers.arrayElement(['Receiving', 'Storage', 'Picking', 'Shipping']),
  }));
};
