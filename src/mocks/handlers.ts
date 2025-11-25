import { http, HttpResponse, delay } from 'msw';
import {
  generateMockProducts,
  generateMockStockLevels,
  generateMockWorkflowTasks,
  generateMockNotifications,
} from './generators';
import {
  generateMockActivity,
  generateRevenueChartData,
  generateProductionChartData,
  generateInventoryByCategory,
  generateSparklineData,
} from './generators/activity';
import {
  generateMockInsights,
  generateMockAnomalies,
  generateFormSuggestions,
  generateDuplicateCandidates,
  generateRelatedProducts,
  generateCommandSuggestions,
  generateRecentActions,
  generateDemandForecast,
} from './generators/ai';
import {
  generateMockWarehouses,
  generateMockZones,
  generateMockBins,
  generateMockTransfers,
  generateMockWarehouseActivity,
  generateMockCategories,
  generateMockProductMovements,
  generateMockWarehouseCapacity,
  generateMockWarehouseComparison,
  generateMockStockMovements,
} from './generators/warehouses';
import {
  generateMockAnalytics,
  generateMockForecasting,
  generateMockReports,
  generateMockCertificates,
} from './generators/analytics';
import {
  generateMockWorkOrders,
  generateMockWorkOrderOperations,
  generateMockWorkOrderMaterials,
  generateMockBOMs,
  generateMockBOMComponents,
  generateMockBOMOperations,
  generateMockWorkCenters,
  generateMockManufacturingActivity,
  generateMockProductionSchedule,
  generateMockProductionMetrics,
  generateMockBOMComparison,
} from './generators/manufacturing';
import {
  generateMockInspections,
  generateMockChecklist,
  generateMockDefects,
  generateMockNCRs,
  generateMockQualityMetrics,
  generateMockCertificate,
  generateMockInspectionEvents,
} from './generators/quality';
import {
  generateMockWorkflows,
  generateMockWorkflowTemplates,
  generateMockWorkflowVersions,
  generateMockWorkflowInstances,
  generateMockNodePalette,
  generateMockWorkflowValidation,
} from './generators/workflow';
import {
  generateMockTasks,
  generateMockTaskStats,
  generateMockBulkActionResult,
  generateMockNotificationPreferences,
  generateMockNotificationHistory,
} from './generators/tasks';
import {
  generateMockRoles,
  generateMockPermissionModules,
  generateMockAuditLogs,
  generateMockSessions,
  generateMockSecuritySettings,
  generateMockTwoFactorSetup,
  generateMockSecurityStats,
  generateMockRoleUsers,
} from './generators/security';

// Simulated user data for demo
const demoUser = {
  id: 'demo-user-001',
  email: 'demo@manufacturing-erp.com',
  name: 'Demo User',
  avatar: null,
  phone: '+1 555-0123',
  isActive: true,
  lastLoginAt: new Date().toISOString(),
  preferences: {
    theme: 'system' as const,
    language: 'en',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    notifications: {
      email: true,
      push: true,
      inApp: true,
      sound: false,
    },
  },
};

const demoCompanies = [
  {
    id: 'company-001',
    companyId: 'company-001',
    companyName: 'Demo Manufacturing Co.',
    companyCode: 'DEMO',
    role: 'ADMIN' as const,
    permissions: ['all'],
    isDefault: true,
  },
  {
    id: 'company-002',
    companyId: 'company-002',
    companyName: 'Secondary Warehouse Inc.',
    companyCode: 'SEC',
    role: 'MANAGER' as const,
    permissions: ['inventory.read', 'inventory.write', 'reports.read'],
    isDefault: false,
  },
];

export const handlers = [
  // ==================== AUTHENTICATION ====================

  // Send OTP
  http.post('/api/v1/auth/send-otp', async ({ request }) => {
    await delay(500);
    const body = await request.json() as { email: string };

    return HttpResponse.json({
      success: true,
      data: {
        message: 'OTP sent successfully',
        email: body.email,
        expiresIn: 300, // 5 minutes
      },
    });
  }),

  // Verify OTP and Login
  http.post('/api/v1/auth/verify-otp', async ({ request }) => {
    await delay(500);
    const body = await request.json() as { email: string; otp: string };

    // In demo mode, accept any 6-digit OTP
    if (body.otp.length !== 6) {
      return HttpResponse.json(
        {
          success: false,
          message: 'Invalid OTP',
          errors: [{ code: 'INVALID_OTP', message: 'OTP must be 6 digits' }],
        },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: {
        user: { ...demoUser, email: body.email },
        accessToken: 'demo-access-token-' + Date.now(),
        refreshToken: 'demo-refresh-token-' + Date.now(),
        permissions: ['all'],
        companies: demoCompanies,
      },
    });
  }),

  // Refresh Token
  http.post('/api/v1/auth/refresh', async () => {
    await delay(300);
    return HttpResponse.json({
      success: true,
      data: {
        accessToken: 'demo-access-token-' + Date.now(),
        refreshToken: 'demo-refresh-token-' + Date.now(),
      },
    });
  }),

  // Logout
  http.post('/api/v1/auth/logout', async () => {
    await delay(200);
    return HttpResponse.json({
      success: true,
      data: { message: 'Logged out successfully' },
    });
  }),

  // Get Current User
  http.get('/api/v1/auth/me', async () => {
    await delay(300);
    return HttpResponse.json({
      success: true,
      data: {
        user: demoUser,
        companies: demoCompanies,
      },
    });
  }),

  // ==================== PRODUCTS ====================

  // Get Products List
  http.get('/api/v1/products', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const search = url.searchParams.get('search') || '';

    let products = generateMockProducts(150);

    // Filter by search
    if (search) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.sku.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = products.length;
    const startIndex = (page - 1) * limit;
    const paginatedProducts = products.slice(startIndex, startIndex + limit);

    return HttpResponse.json({
      success: true,
      data: {
        items: paginatedProducts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  }),

  // Get Single Product
  http.get('/api/v1/products/:id', async ({ params }) => {
    await delay(200);
    const product = generateMockProducts(1)[0];
    product.id = params.id as string;

    return HttpResponse.json({
      success: true,
      data: product,
    });
  }),

  // Create Product
  http.post('/api/v1/products', async ({ request }) => {
    await delay(500);
    const body = await request.json() as Record<string, unknown>;

    return HttpResponse.json({
      success: true,
      data: {
        ...body,
        id: 'prod-' + Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  // ==================== INVENTORY ====================

  // Get Stock Levels
  http.get('/api/v1/inventory/stock-levels', async () => {
    await delay(200);
    return HttpResponse.json({
      success: true,
      data: generateMockStockLevels(),
    });
  }),

  // Get Stock Movements
  http.get('/api/v1/inventory/movements', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const type = url.searchParams.get('type');
    const status = url.searchParams.get('status');

    let movements = generateMockStockMovements(100);

    if (type) {
      movements = movements.filter(m => m.type === type);
    }
    if (status) {
      movements = movements.filter(m => m.status === status);
    }

    const total = movements.length;
    const startIndex = (page - 1) * limit;
    const paginatedMovements = movements.slice(startIndex, startIndex + limit);

    return HttpResponse.json({
      success: true,
      data: {
        items: paginatedMovements,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  }),

  // ==================== WORKFLOWS ====================

  // Get Workflow Tasks
  http.get('/api/v1/workflows/tasks', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');

    return HttpResponse.json({
      success: true,
      data: {
        items: generateMockWorkflowTasks(limit),
        pagination: {
          page: 1,
          limit,
          total: 50,
          totalPages: 5,
        },
      },
    });
  }),

  // ==================== NOTIFICATIONS ====================

  // Get Notifications
  http.get('/api/v1/notifications', async () => {
    await delay(200);
    return HttpResponse.json({
      success: true,
      data: generateMockNotifications(),
    });
  }),

  // Mark Notification as Read
  http.patch('/api/v1/notifications/:id/read', async ({ params }) => {
    await delay(200);
    return HttpResponse.json({
      success: true,
      data: { id: params.id, read: true },
    });
  }),

  // ==================== AI PREDICTIONS ====================

  // Demand Forecast
  http.post('/api/v1/ai/demand-forecast', async () => {
    await delay(800); // AI calls take longer
    return HttpResponse.json({
      success: true,
      data: {
        predictions: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
          predicted: Math.floor(Math.random() * 100) + 50,
          lower: Math.floor(Math.random() * 50) + 30,
          upper: Math.floor(Math.random() * 50) + 100,
        })),
        confidence: 0.87,
        modelVersion: 'v2.1.0',
      },
    });
  }),

  // ==================== DASHBOARD ====================

  // Get Dashboard Stats
  http.get('/api/v1/dashboard/stats', async () => {
    await delay(400);
    return HttpResponse.json({
      success: true,
      data: {
        // KPI Cards
        totalProducts: 1250,
        lowStockItems: 23,
        pendingOrders: 45,
        activeWorkOrders: 12,
        // Metric Cards
        todayRevenue: 45678.90,
        monthlyGrowth: 12.5,
        qualityScore: 98.2,
        onTimeDelivery: 96.8,
        // Trends & Sparklines
        trends: {
          products: { change: 5.2, direction: 'up' as const },
          lowStock: { change: -3, direction: 'down' as const },
          orders: { change: 12, direction: 'up' as const },
          workOrders: { change: 0, direction: 'stable' as const },
        },
        sparklines: {
          products: generateSparklineData('up'),
          lowStock: generateSparklineData('down'),
          orders: generateSparklineData('up'),
          workOrders: generateSparklineData('stable'),
          revenue: generateSparklineData('up'),
        },
        // Chart Data
        charts: {
          revenue: generateRevenueChartData(),
          production: generateProductionChartData(),
          inventory: generateInventoryByCategory(),
        },
      },
    });
  }),

  // Get Dashboard Activity Feed
  http.get('/api/v1/dashboard/activity', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');

    return HttpResponse.json({
      success: true,
      data: {
        items: generateMockActivity(limit),
      },
    });
  }),

  // ==================== AI ENDPOINTS ====================

  // Get AI Insights
  http.get('/api/v1/ai/insights', async ({ request }) => {
    await delay(500);
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '6');
    const moduleFilter = url.searchParams.get('module');

    let insights = generateMockInsights(limit);
    if (moduleFilter) {
      insights = insights.filter((i) => i.module === moduleFilter);
    }

    return HttpResponse.json({
      success: true,
      data: {
        items: insights,
        summary: {
          total: insights.length,
          critical: insights.filter((i) => i.severity === 'critical').length,
          high: insights.filter((i) => i.severity === 'high').length,
          actionable: insights.filter((i) => i.actionable).length,
        },
      },
    });
  }),

  // Get AI Anomalies
  http.get('/api/v1/ai/anomalies', async ({ request }) => {
    await delay(400);
    const url = new URL(request.url);
    const entityType = url.searchParams.get('entityType');

    let anomalies = generateMockAnomalies(15);
    if (entityType) {
      anomalies = anomalies.filter((a) => a.entityType === entityType);
    }

    return HttpResponse.json({
      success: true,
      data: {
        items: anomalies,
        summary: {
          total: anomalies.length,
          critical: anomalies.filter((a) => a.score >= 80).length,
          resolved: anomalies.filter((a) => a.resolved).length,
        },
      },
    });
  }),

  // Get Demand Forecast (enhanced)
  http.post('/api/v1/ai/demand-forecast', async ({ request }) => {
    await delay(800);
    const body = (await request.json()) as { productId?: string; days?: number };
    const days = body.days || 30;

    return HttpResponse.json({
      success: true,
      data: {
        predictions: generateDemandForecast(days),
        confidence: 87,
        modelVersion: 'v2.1.0',
        generatedAt: new Date().toISOString(),
      },
    });
  }),

  // Smart Form Suggestions
  http.post('/api/v1/ai/smart-form', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { field: string; context?: Record<string, unknown> };

    return HttpResponse.json({
      success: true,
      data: {
        suggestions: generateFormSuggestions(body.field),
        duplicates: generateDuplicateCandidates(),
        relatedProducts: generateRelatedProducts(),
      },
    });
  }),

  // Command Bar Suggestions
  http.get('/api/v1/ai/command-suggestions', async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const query = url.searchParams.get('q') || '';

    return HttpResponse.json({
      success: true,
      data: {
        suggestions: generateCommandSuggestions(query),
        recentActions: generateRecentActions(),
      },
    });
  }),

  // ==================== WAREHOUSES ====================

  // Get Warehouses List
  http.get('/api/v1/warehouses', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    const warehouses = generateMockWarehouses(10);
    const total = warehouses.length;
    const startIndex = (page - 1) * limit;
    const paginatedWarehouses = warehouses.slice(startIndex, startIndex + limit);

    return HttpResponse.json({
      success: true,
      data: {
        items: paginatedWarehouses,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  }),

  // Get Single Warehouse
  http.get('/api/v1/warehouses/:id', async ({ params }) => {
    await delay(200);
    const warehouse = generateMockWarehouses(1)[0];
    warehouse.id = params.id as string;

    return HttpResponse.json({
      success: true,
      data: warehouse,
    });
  }),

  // Get Warehouse Zones
  http.get('/api/v1/warehouses/:id/zones', async ({ params }) => {
    await delay(200);
    return HttpResponse.json({
      success: true,
      data: generateMockZones(params.id as string, 5),
    });
  }),

  // Get Warehouse Bins
  http.get('/api/v1/warehouses/:warehouseId/zones/:zoneId/bins', async ({ params }) => {
    await delay(200);
    return HttpResponse.json({
      success: true,
      data: generateMockBins(params.zoneId as string, 20),
    });
  }),

  // Get Warehouse Activity
  http.get('/api/v1/warehouses/:id/activity', async ({ params, request }) => {
    await delay(200);
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');

    return HttpResponse.json({
      success: true,
      data: {
        items: generateMockWarehouseActivity(params.id as string, limit),
      },
    });
  }),

  // Create/Update Warehouse
  http.post('/api/v1/warehouses', async ({ request }) => {
    await delay(500);
    const body = await request.json() as Record<string, unknown>;

    return HttpResponse.json({
      success: true,
      data: {
        ...body,
        id: 'wh-' + Date.now(),
        createdAt: new Date().toISOString(),
      },
    });
  }),

  // Get All Warehouse Zones (aggregate)
  http.get('/api/v1/warehouses/zones', async () => {
    await delay(300);
    const warehouses = generateMockWarehouses(5);
    const allZones = warehouses.flatMap(wh =>
      wh.zones.map(zone => ({
        ...zone,
        warehouseId: wh.id,
        warehouseName: wh.name,
      }))
    );

    return HttpResponse.json({
      success: true,
      data: {
        items: allZones,
        total: allZones.length,
      },
    });
  }),

  // Get Warehouse Capacity Overview
  http.get('/api/v1/warehouses/capacity', async () => {
    await delay(300);
    const capacity = generateMockWarehouseCapacity();
    const totalCapacity = capacity.reduce((sum, wh) => sum + wh.totalCapacity, 0);
    const totalUsed = capacity.reduce((sum, wh) => sum + wh.usedCapacity, 0);
    const totalAlerts = capacity.reduce((sum, wh) => sum + wh.alerts.length, 0);

    return HttpResponse.json({
      success: true,
      data: {
        summary: {
          totalCapacity,
          totalUsed,
          totalAvailable: totalCapacity - totalUsed,
          overallUtilization: Math.round((totalUsed / totalCapacity) * 100),
          alertCount: totalAlerts,
        },
        warehouses: capacity,
      },
    });
  }),

  // Get Warehouse Comparison
  http.get('/api/v1/warehouses/comparison', async () => {
    await delay(400);
    return HttpResponse.json({
      success: true,
      data: generateMockWarehouseComparison(),
    });
  }),

  // ==================== STOCK TRANSFERS ====================

  // Get Stock Transfers
  http.get('/api/v1/stock-transfers', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    let transfers = generateMockTransfers(15);
    if (status) {
      transfers = transfers.filter((t) => t.status === status);
    }

    return HttpResponse.json({
      success: true,
      data: {
        items: transfers,
        pagination: { page: 1, limit: 20, total: transfers.length, totalPages: 1 },
      },
    });
  }),

  // Create Stock Transfer
  http.post('/api/v1/stock-transfers', async ({ request }) => {
    await delay(500);
    const body = await request.json() as Record<string, unknown>;

    return HttpResponse.json({
      success: true,
      data: {
        ...body,
        id: 'tf-' + Date.now(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
    });
  }),

  // ==================== PRODUCT CATEGORIES ====================

  // Get Product Categories
  http.get('/api/v1/product-categories', async () => {
    await delay(200);
    return HttpResponse.json({
      success: true,
      data: generateMockCategories(),
    });
  }),

  // ==================== ENHANCED PRODUCTS ====================

  // Get Product Movements/History
  http.get('/api/v1/products/:id/movements', async ({ params, request }) => {
    await delay(300);
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');

    return HttpResponse.json({
      success: true,
      data: {
        items: generateMockProductMovements(params.id as string, limit),
      },
    });
  }),

  // Get Product Analytics
  http.get('/api/v1/products/:id/analytics', async ({ params }) => {
    await delay(400);
    return HttpResponse.json({
      success: true,
      data: {
        consumption: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
          quantity: Math.floor(Math.random() * 50) + 10,
        })).reverse(),
        turnover: { current: 8.5, previous: 7.2, change: 18 },
        daysOfStock: 45,
        reorderSuggestion: 150,
        anomalyScore: Math.floor(Math.random() * 100),
      },
    });
  }),

  // Bulk Product Import
  http.post('/api/v1/products/import', async ({ request }) => {
    await delay(1000);
    const body = await request.json() as { products: unknown[] };

    return HttpResponse.json({
      success: true,
      data: {
        imported: body.products?.length || 0,
        failed: 0,
        errors: [],
        summary: {
          total: body.products?.length || 0,
          created: body.products?.length || 0,
          updated: 0,
          skipped: 0,
        },
      },
    });
  }),

  // Update Product Stock
  http.patch('/api/v1/products/:id/stock', async ({ params, request }) => {
    await delay(300);
    const body = await request.json() as Record<string, unknown>;

    return HttpResponse.json({
      success: true,
      data: {
        productId: params.id,
        ...body,
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  // ==================== MANUFACTURING ====================

  // Get Work Orders List
  http.get('/api/v1/work-orders', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const status = url.searchParams.get('status');
    const priority = url.searchParams.get('priority');

    let workOrders = generateMockWorkOrders(50);

    if (status) {
      workOrders = workOrders.filter((wo) => wo.status === status);
    }
    if (priority) {
      workOrders = workOrders.filter((wo) => wo.priority === priority);
    }

    const total = workOrders.length;
    const startIndex = (page - 1) * limit;
    const paginatedWorkOrders = workOrders.slice(startIndex, startIndex + limit);

    return HttpResponse.json({
      success: true,
      data: {
        items: paginatedWorkOrders,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  }),

  // Get Single Work Order
  http.get('/api/v1/work-orders/:id', async ({ params }) => {
    await delay(200);
    const workOrder = generateMockWorkOrders(1)[0];
    workOrder.id = params.id as string;

    return HttpResponse.json({
      success: true,
      data: workOrder,
    });
  }),

  // Create Work Order
  http.post('/api/v1/work-orders', async ({ request }) => {
    await delay(500);
    const body = await request.json() as Record<string, unknown>;

    return HttpResponse.json({
      success: true,
      data: {
        ...body,
        id: 'wo-' + Date.now(),
        workOrderNumber: `WO-${String(Date.now()).slice(-5)}`,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  // Update Work Order
  http.patch('/api/v1/work-orders/:id', async ({ params, request }) => {
    await delay(300);
    const body = await request.json() as Record<string, unknown>;

    return HttpResponse.json({
      success: true,
      data: {
        id: params.id,
        ...body,
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  // Update Work Order Status
  http.patch('/api/v1/work-orders/:id/status', async ({ params, request }) => {
    await delay(300);
    const body = await request.json() as { status: string };

    return HttpResponse.json({
      success: true,
      data: {
        id: params.id,
        status: body.status,
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  // Get Work Order Operations
  http.get('/api/v1/work-orders/:id/operations', async ({ params }) => {
    await delay(200);
    return HttpResponse.json({
      success: true,
      data: generateMockWorkOrderOperations(params.id as string, 5),
    });
  }),

  // Update Operation Status
  http.patch('/api/v1/work-orders/:woId/operations/:opId/status', async ({ params, request }) => {
    await delay(300);
    const body = await request.json() as { status: string };

    return HttpResponse.json({
      success: true,
      data: {
        id: params.opId,
        workOrderId: params.woId,
        status: body.status,
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  // Get Work Order Materials
  http.get('/api/v1/work-orders/:id/materials', async ({ params }) => {
    await delay(200);
    return HttpResponse.json({
      success: true,
      data: generateMockWorkOrderMaterials(params.id as string, 6),
    });
  }),

  // Issue Materials to Work Order
  http.post('/api/v1/work-orders/:id/materials/issue', async ({ params, request }) => {
    await delay(400);
    const body = await request.json() as { materials: Array<{ productId: string; quantity: number }> };

    return HttpResponse.json({
      success: true,
      data: {
        workOrderId: params.id,
        issuedMaterials: body.materials,
        issuedAt: new Date().toISOString(),
      },
    });
  }),

  // ==================== BILL OF MATERIALS ====================

  // Get BOMs List
  http.get('/api/v1/boms', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const status = url.searchParams.get('status');

    let boms = generateMockBOMs(30);

    if (status) {
      boms = boms.filter((bom) => bom.status === status);
    }

    const total = boms.length;
    const startIndex = (page - 1) * limit;
    const paginatedBOMs = boms.slice(startIndex, startIndex + limit);

    return HttpResponse.json({
      success: true,
      data: {
        items: paginatedBOMs,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  }),

  // Get Single BOM
  http.get('/api/v1/boms/:id', async ({ params }) => {
    await delay(200);
    const bom = generateMockBOMs(1)[0];
    bom.id = params.id as string;

    return HttpResponse.json({
      success: true,
      data: bom,
    });
  }),

  // Create BOM
  http.post('/api/v1/boms', async ({ request }) => {
    await delay(500);
    const body = await request.json() as Record<string, unknown>;

    return HttpResponse.json({
      success: true,
      data: {
        ...body,
        id: 'bom-' + Date.now(),
        bomNumber: `BOM-${String(Date.now()).slice(-4)}`,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  // Update BOM
  http.patch('/api/v1/boms/:id', async ({ params, request }) => {
    await delay(300);
    const body = await request.json() as Record<string, unknown>;

    return HttpResponse.json({
      success: true,
      data: {
        id: params.id,
        ...body,
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  // Get BOM Components
  http.get('/api/v1/boms/:id/components', async ({ params }) => {
    await delay(200);
    return HttpResponse.json({
      success: true,
      data: generateMockBOMComponents(params.id as string, 8),
    });
  }),

  // Get BOM Operations
  http.get('/api/v1/boms/:id/operations', async ({ params }) => {
    await delay(200);
    return HttpResponse.json({
      success: true,
      data: generateMockBOMOperations(params.id as string, 4),
    });
  }),

  // Compare BOMs
  http.get('/api/v1/boms/compare', async () => {
    await delay(400);
    return HttpResponse.json({
      success: true,
      data: generateMockBOMComparison(),
    });
  }),

  // Clone BOM
  http.post('/api/v1/boms/:id/clone', async ({ params }) => {
    await delay(500);
    const bom = generateMockBOMs(1)[0];
    bom.id = 'bom-' + Date.now();
    bom.bomNumber = `BOM-${String(Date.now()).slice(-4)}`;
    bom.version = '1.0';
    bom.status = 'draft';

    return HttpResponse.json({
      success: true,
      data: bom,
    });
  }),

  // ==================== WORK CENTERS ====================

  // Get Work Centers List
  http.get('/api/v1/work-centers', async () => {
    await delay(200);
    return HttpResponse.json({
      success: true,
      data: generateMockWorkCenters(8),
    });
  }),

  // Get Single Work Center
  http.get('/api/v1/work-centers/:id', async ({ params }) => {
    await delay(200);
    const workCenter = generateMockWorkCenters(1)[0];
    workCenter.id = params.id as string;

    return HttpResponse.json({
      success: true,
      data: workCenter,
    });
  }),

  // Get Work Center Schedule
  http.get('/api/v1/work-centers/:id/schedule', async ({ params }) => {
    await delay(300);
    const schedule = generateMockProductionSchedule(10);
    schedule.forEach((item) => {
      item.workCenterId = params.id as string;
    });

    return HttpResponse.json({
      success: true,
      data: schedule,
    });
  }),

  // Update Work Center Status
  http.patch('/api/v1/work-centers/:id/status', async ({ params, request }) => {
    await delay(300);
    const body = await request.json() as { status: string };

    return HttpResponse.json({
      success: true,
      data: {
        id: params.id,
        status: body.status,
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  // ==================== PRODUCTION ====================

  // Get Production Schedule
  http.get('/api/v1/production/schedule', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const workCenterId = url.searchParams.get('workCenterId');

    let schedule = generateMockProductionSchedule(30);
    if (workCenterId) {
      schedule = schedule.filter((s) => s.workCenterId === workCenterId);
    }

    return HttpResponse.json({
      success: true,
      data: schedule,
    });
  }),

  // Get Production Metrics
  http.get('/api/v1/production/metrics', async () => {
    await delay(300);
    return HttpResponse.json({
      success: true,
      data: generateMockProductionMetrics(),
    });
  }),

  // Get Manufacturing Activity
  http.get('/api/v1/manufacturing/activity', async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '30');

    return HttpResponse.json({
      success: true,
      data: {
        items: generateMockManufacturingActivity(limit),
      },
    });
  }),

  // Get Manufacturing Dashboard Stats
  http.get('/api/v1/manufacturing/dashboard', async () => {
    await delay(400);
    const metrics = generateMockProductionMetrics();
    const workOrders = generateMockWorkOrders(5);
    const activity = generateMockManufacturingActivity(10);

    return HttpResponse.json({
      success: true,
      data: {
        metrics,
        recentWorkOrders: workOrders,
        recentActivity: activity,
        workCenterUtilization: generateMockWorkCenters(8).map((wc) => ({
          id: wc.id,
          name: wc.name,
          utilization: wc.utilizationPercent,
          status: wc.status,
        })),
      },
    });
  }),

  // ==================== QUALITY ====================

  // Get Quality Inspections
  http.get('/api/v1/quality/inspections', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const status = url.searchParams.get('status');
    const type = url.searchParams.get('type');

    let inspections = generateMockInspections(50);

    if (status) {
      inspections = inspections.filter((i) => i.status === status);
    }
    if (type) {
      inspections = inspections.filter((i) => i.type === type);
    }

    const total = inspections.length;
    const startIndex = (page - 1) * limit;
    const paginatedInspections = inspections.slice(startIndex, startIndex + limit);

    return HttpResponse.json({
      success: true,
      data: {
        items: paginatedInspections,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  }),

  // Get Single Inspection
  http.get('/api/v1/quality/inspections/:id', async ({ params }) => {
    await delay(200);
    const inspection = generateMockInspections(1)[0];
    inspection.id = params.id as string;

    return HttpResponse.json({
      success: true,
      data: inspection,
    });
  }),

  // Create Inspection
  http.post('/api/v1/quality/inspections', async ({ request }) => {
    await delay(500);
    const body = await request.json() as Record<string, unknown>;

    return HttpResponse.json({
      success: true,
      data: {
        ...body,
        id: 'ins-' + Date.now(),
        inspectionNumber: `INS-${String(Date.now()).slice(-5)}`,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
      },
    });
  }),

  // Update Inspection Checklist
  http.patch('/api/v1/quality/inspections/:id/checklist', async ({ params, request }) => {
    await delay(300);
    const body = await request.json();

    return HttpResponse.json({
      success: true,
      data: {
        id: params.id,
        checklist: body,
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  // Get Inspection Events/History
  http.get('/api/v1/quality/inspections/:id/events', async ({ params }) => {
    await delay(200);
    return HttpResponse.json({
      success: true,
      data: generateMockInspectionEvents(params.id as string, 6),
    });
  }),

  // Get Defects
  http.get('/api/v1/quality/defects', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const severity = url.searchParams.get('severity');
    const status = url.searchParams.get('status');

    let defects = generateMockDefects(30);

    if (severity) {
      defects = defects.filter((d) => d.severity === severity);
    }
    if (status) {
      defects = defects.filter((d) => d.status === status);
    }

    return HttpResponse.json({
      success: true,
      data: {
        items: defects,
        pagination: { page: 1, limit: 30, total: defects.length, totalPages: 1 },
      },
    });
  }),

  // Create Defect
  http.post('/api/v1/quality/defects', async ({ request }) => {
    await delay(500);
    const body = await request.json() as Record<string, unknown>;

    return HttpResponse.json({
      success: true,
      data: {
        ...body,
        id: 'def-' + Date.now(),
        defectNumber: `DEF-${String(Date.now()).slice(-5)}`,
        status: 'open',
        createdAt: new Date().toISOString(),
      },
    });
  }),

  // Get NCRs
  http.get('/api/v1/quality/ncrs', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const priority = url.searchParams.get('priority');

    let ncrs = generateMockNCRs(20);

    if (status) {
      ncrs = ncrs.filter((n) => n.status === status);
    }
    if (priority) {
      ncrs = ncrs.filter((n) => n.priority === priority);
    }

    return HttpResponse.json({
      success: true,
      data: {
        items: ncrs,
        pagination: { page: 1, limit: 20, total: ncrs.length, totalPages: 1 },
      },
    });
  }),

  // Get Single NCR
  http.get('/api/v1/quality/ncrs/:id', async ({ params }) => {
    await delay(200);
    const ncr = generateMockNCRs(1)[0];
    ncr.id = params.id as string;

    return HttpResponse.json({
      success: true,
      data: ncr,
    });
  }),

  // Create NCR
  http.post('/api/v1/quality/ncrs', async ({ request }) => {
    await delay(500);
    const body = await request.json() as Record<string, unknown>;

    return HttpResponse.json({
      success: true,
      data: {
        ...body,
        id: 'ncr-' + Date.now(),
        ncrNumber: `NCR-${String(Date.now()).slice(-5)}`,
        status: 'open',
        createdAt: new Date().toISOString(),
      },
    });
  }),

  // Get Quality Metrics
  http.get('/api/v1/quality/metrics', async () => {
    await delay(400);
    return HttpResponse.json({
      success: true,
      data: generateMockQualityMetrics(),
    });
  }),

  // Get Certificates List
  http.get('/api/v1/quality/certificates', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const status = url.searchParams.get('status');
    const type = url.searchParams.get('type');

    let certificates = generateMockCertificates(50);

    if (status) {
      certificates = certificates.filter(c => c.status === status);
    }
    if (type) {
      certificates = certificates.filter(c => c.type === type);
    }

    const total = certificates.length;
    const startIndex = (page - 1) * limit;
    const paginatedCerts = certificates.slice(startIndex, startIndex + limit);

    return HttpResponse.json({
      success: true,
      data: {
        items: paginatedCerts,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  }),

  // Generate Certificate
  http.post('/api/v1/quality/certificates', async ({ request }) => {
    await delay(600);
    const body = await request.json() as { inspectionId: string };

    return HttpResponse.json({
      success: true,
      data: generateMockCertificate(body.inspectionId),
    });
  }),

  // ==================== WORKFLOWS ====================

  // Get Workflows
  http.get('/api/v1/workflows', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const type = url.searchParams.get('type');

    let workflows = generateMockWorkflows(15);

    if (status) {
      workflows = workflows.filter((w) => w.status === status);
    }
    if (type) {
      workflows = workflows.filter((w) => w.type === type);
    }

    return HttpResponse.json({
      success: true,
      data: {
        items: workflows,
        pagination: { page: 1, limit: 20, total: workflows.length, totalPages: 1 },
      },
    });
  }),

  // Get Single Workflow
  http.get('/api/v1/workflows/:id', async ({ params }) => {
    await delay(200);
    const workflow = generateMockWorkflows(1)[0];
    workflow.id = params.id as string;

    return HttpResponse.json({
      success: true,
      data: workflow,
    });
  }),

  // Create Workflow
  http.post('/api/v1/workflows', async ({ request }) => {
    await delay(500);
    const body = await request.json() as Record<string, unknown>;

    return HttpResponse.json({
      success: true,
      data: {
        ...body,
        id: 'wf-' + Date.now(),
        version: '1.0',
        status: 'draft',
        createdAt: new Date().toISOString(),
      },
    });
  }),

  // Update Workflow
  http.patch('/api/v1/workflows/:id', async ({ params, request }) => {
    await delay(300);
    const body = await request.json() as Record<string, unknown>;

    return HttpResponse.json({
      success: true,
      data: {
        id: params.id,
        ...body,
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  // Get Workflow Versions
  http.get('/api/v1/workflows/:id/versions', async ({ params }) => {
    await delay(200);
    return HttpResponse.json({
      success: true,
      data: generateMockWorkflowVersions(params.id as string, 5),
    });
  }),

  // Publish Workflow
  http.post('/api/v1/workflows/:id/publish', async ({ params }) => {
    await delay(400);
    return HttpResponse.json({
      success: true,
      data: {
        id: params.id,
        status: 'active',
        publishedAt: new Date().toISOString(),
      },
    });
  }),

  // Validate Workflow
  http.post('/api/v1/workflows/:id/validate', async () => {
    await delay(300);
    return HttpResponse.json({
      success: true,
      data: generateMockWorkflowValidation(false),
    });
  }),

  // Get Workflow Templates
  http.get('/api/v1/workflows/templates', async () => {
    await delay(300);
    return HttpResponse.json({
      success: true,
      data: generateMockWorkflowTemplates(),
    });
  }),

  // Get Node Palette
  http.get('/api/v1/workflows/nodes/palette', async () => {
    await delay(200);
    return HttpResponse.json({
      success: true,
      data: generateMockNodePalette(),
    });
  }),

  // Get Workflow Instances
  http.get('/api/v1/workflows/instances', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    let instances = generateMockWorkflowInstances(20);

    if (status) {
      instances = instances.filter((i) => i.status === status);
    }

    return HttpResponse.json({
      success: true,
      data: {
        items: instances,
        pagination: { page: 1, limit: 20, total: instances.length, totalPages: 1 },
      },
    });
  }),

  // ==================== TASKS ====================

  // Get Tasks
  http.get('/api/v1/tasks', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const status = url.searchParams.get('status');
    const priority = url.searchParams.get('priority');
    const moduleFilter = url.searchParams.get('module');

    let tasks = generateMockTasks(100);

    if (status) {
      tasks = tasks.filter((t) => t.status === status);
    }
    if (priority) {
      tasks = tasks.filter((t) => t.priority === priority);
    }
    if (moduleFilter) {
      tasks = tasks.filter((t) => t.module === moduleFilter);
    }

    const total = tasks.length;
    const startIndex = (page - 1) * limit;
    const paginatedTasks = tasks.slice(startIndex, startIndex + limit);

    return HttpResponse.json({
      success: true,
      data: {
        items: paginatedTasks,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  }),

  // Get Single Task
  http.get('/api/v1/tasks/:id', async ({ params }) => {
    await delay(200);
    const task = generateMockTasks(1)[0];
    task.id = params.id as string;

    return HttpResponse.json({
      success: true,
      data: task,
    });
  }),

  // Update Task (Approve/Reject)
  http.patch('/api/v1/tasks/:id', async ({ params, request }) => {
    await delay(300);
    const body = await request.json() as Record<string, unknown>;

    return HttpResponse.json({
      success: true,
      data: {
        id: params.id,
        ...body,
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  // Delegate Task
  http.post('/api/v1/tasks/:id/delegate', async ({ params, request }) => {
    await delay(400);
    const body = await request.json() as { delegateToId: string; delegateToName: string; reason?: string };

    return HttpResponse.json({
      success: true,
      data: {
        id: params.id,
        status: 'delegated',
        delegatedTo: body.delegateToName,
        delegatedAt: new Date().toISOString(),
      },
    });
  }),

  // Add Task Comment
  http.post('/api/v1/tasks/:id/comments', async ({ params, request }) => {
    await delay(300);
    const body = await request.json() as { content: string };

    return HttpResponse.json({
      success: true,
      data: {
        id: 'comment-' + Date.now(),
        taskId: params.id,
        content: body.content,
        userName: demoUser.name,
        createdAt: new Date().toISOString(),
      },
    });
  }),

  // Get Task Stats
  http.get('/api/v1/tasks/stats', async () => {
    await delay(300);
    return HttpResponse.json({
      success: true,
      data: generateMockTaskStats(),
    });
  }),

  // Bulk Task Action
  http.post('/api/v1/tasks/bulk', async ({ request }) => {
    await delay(500);
    const body = await request.json() as { taskIds: string[]; action: string };

    return HttpResponse.json({
      success: true,
      data: generateMockBulkActionResult(body.taskIds),
    });
  }),

  // ==================== NOTIFICATIONS ====================

  // Get Notification Preferences
  http.get('/api/v1/notifications/preferences', async () => {
    await delay(200);
    return HttpResponse.json({
      success: true,
      data: generateMockNotificationPreferences(demoUser.id),
    });
  }),

  // Update Notification Preferences
  http.patch('/api/v1/notifications/preferences', async ({ request }) => {
    await delay(300);
    const body = await request.json() as Record<string, unknown>;

    return HttpResponse.json({
      success: true,
      data: {
        ...body,
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  // Get Notification History
  http.get('/api/v1/notifications/history', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const type = url.searchParams.get('type');

    let notifications = generateMockNotificationHistory(100);

    if (type) {
      notifications = notifications.filter((n) => n.type === type);
    }

    const total = notifications.length;
    const startIndex = (page - 1) * limit;
    const paginatedNotifications = notifications.slice(startIndex, startIndex + limit);

    return HttpResponse.json({
      success: true,
      data: {
        items: paginatedNotifications,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  }),

  // Mark All Notifications as Read
  http.post('/api/v1/notifications/mark-all-read', async () => {
    await delay(300);
    return HttpResponse.json({
      success: true,
      data: { message: 'All notifications marked as read' },
    });
  }),

  // ==================== SECURITY ====================

  // Get Roles
  http.get('/api/v1/security/roles', async () => {
    await delay(300);
    return HttpResponse.json({
      success: true,
      data: generateMockRoles(),
    });
  }),

  // Get Single Role
  http.get('/api/v1/security/roles/:id', async ({ params }) => {
    await delay(200);
    const roles = generateMockRoles();
    const role = roles[0];
    role.id = params.id as string;

    return HttpResponse.json({
      success: true,
      data: role,
    });
  }),

  // Create Role
  http.post('/api/v1/security/roles', async ({ request }) => {
    await delay(500);
    const body = await request.json() as Record<string, unknown>;

    return HttpResponse.json({
      success: true,
      data: {
        ...body,
        id: 'role-' + Date.now(),
        type: 'custom',
        createdAt: new Date().toISOString(),
      },
    });
  }),

  // Update Role
  http.patch('/api/v1/security/roles/:id', async ({ params, request }) => {
    await delay(300);
    const body = await request.json() as Record<string, unknown>;

    return HttpResponse.json({
      success: true,
      data: {
        id: params.id,
        ...body,
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  // Get Role Users
  http.get('/api/v1/security/roles/:id/users', async ({ params }) => {
    await delay(200);
    return HttpResponse.json({
      success: true,
      data: generateMockRoleUsers(params.id as string, 10),
    });
  }),

  // Get Permission Modules
  http.get('/api/v1/security/permissions/modules', async () => {
    await delay(200);
    return HttpResponse.json({
      success: true,
      data: generateMockPermissionModules(),
    });
  }),

  // Get Audit Logs
  http.get('/api/v1/security/audit-logs', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const userId = url.searchParams.get('userId');
    const moduleFilter = url.searchParams.get('module');
    const action = url.searchParams.get('action');

    let logs = generateMockAuditLogs(200);

    if (userId) {
      logs = logs.filter((l) => l.userId === userId);
    }
    if (moduleFilter) {
      logs = logs.filter((l) => l.module === moduleFilter);
    }
    if (action) {
      logs = logs.filter((l) => l.action === action);
    }

    const total = logs.length;
    const startIndex = (page - 1) * limit;
    const paginatedLogs = logs.slice(startIndex, startIndex + limit);

    return HttpResponse.json({
      success: true,
      data: {
        items: paginatedLogs,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  }),

  // Get User Sessions
  http.get('/api/v1/security/sessions', async () => {
    await delay(200);
    return HttpResponse.json({
      success: true,
      data: generateMockSessions(demoUser.id),
    });
  }),

  // Revoke Session
  http.delete('/api/v1/security/sessions/:id', async ({ params }) => {
    await delay(300);
    return HttpResponse.json({
      success: true,
      data: {
        id: params.id,
        revoked: true,
        revokedAt: new Date().toISOString(),
      },
    });
  }),

  // Get Security Settings
  http.get('/api/v1/security/settings', async () => {
    await delay(200);
    return HttpResponse.json({
      success: true,
      data: generateMockSecuritySettings(demoUser.id),
    });
  }),

  // Update Security Settings
  http.patch('/api/v1/security/settings', async ({ request }) => {
    await delay(300);
    const body = await request.json() as Record<string, unknown>;

    return HttpResponse.json({
      success: true,
      data: {
        ...body,
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  // Setup Two-Factor Auth
  http.post('/api/v1/security/2fa/setup', async () => {
    await delay(400);
    return HttpResponse.json({
      success: true,
      data: generateMockTwoFactorSetup(),
    });
  }),

  // Verify Two-Factor Auth
  http.post('/api/v1/security/2fa/verify', async ({ request }) => {
    await delay(300);
    const body = await request.json() as { code: string };

    // Accept any 6-digit code in demo mode
    if (body.code.length === 6) {
      return HttpResponse.json({
        success: true,
        data: {
          verified: true,
          verifiedAt: new Date().toISOString(),
        },
      });
    }

    return HttpResponse.json(
      { success: false, message: 'Invalid code' },
      { status: 400 }
    );
  }),

  // Disable Two-Factor Auth
  http.post('/api/v1/security/2fa/disable', async () => {
    await delay(300);
    return HttpResponse.json({
      success: true,
      data: {
        disabled: true,
        disabledAt: new Date().toISOString(),
      },
    });
  }),

  // Get Security Stats
  http.get('/api/v1/security/stats', async () => {
    await delay(300);
    return HttpResponse.json({
      success: true,
      data: generateMockSecurityStats(),
    });
  }),

  // ==================== ANALYTICS ====================

  // Get Analytics Dashboard
  http.get('/api/v1/analytics', async () => {
    await delay(400);
    return HttpResponse.json({
      success: true,
      data: generateMockAnalytics(),
    });
  }),

  // Get Analytics KPIs
  http.get('/api/v1/analytics/kpis', async () => {
    await delay(300);
    const analytics = generateMockAnalytics();
    return HttpResponse.json({
      success: true,
      data: analytics.kpis,
    });
  }),

  // Get Analytics Charts
  http.get('/api/v1/analytics/charts', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const chartType = url.searchParams.get('type');

    const analytics = generateMockAnalytics();
    const charts = analytics.charts;

    if (chartType && chartType in charts) {
      return HttpResponse.json({
        success: true,
        data: charts[chartType as keyof typeof charts],
      });
    }

    return HttpResponse.json({
      success: true,
      data: charts,
    });
  }),

  // Get Forecasting Data
  http.get('/api/v1/analytics/forecasting', async () => {
    await delay(500);
    return HttpResponse.json({
      success: true,
      data: generateMockForecasting(),
    });
  }),

  // ==================== REPORTS ====================

  // Get Reports
  http.get('/api/v1/reports', async () => {
    await delay(300);
    return HttpResponse.json({
      success: true,
      data: generateMockReports(),
    });
  }),

  // Get Report by Type
  http.get('/api/v1/reports/:type', async ({ params, request }) => {
    await delay(400);
    const url = new URL(request.url);
    const period = url.searchParams.get('period') || 'month';

    // Generate mock report data based on type
    const analytics = generateMockAnalytics();

    return HttpResponse.json({
      success: true,
      data: {
        type: params.type,
        period,
        generatedAt: new Date().toISOString(),
        data: analytics,
      },
    });
  }),

  // Generate Report
  http.post('/api/v1/reports/:type/generate', async ({ params, request }) => {
    await delay(800);
    const body = await request.json() as { format?: string; dateRange?: { start: string; end: string } };

    return HttpResponse.json({
      success: true,
      data: {
        reportId: 'rpt-' + Date.now(),
        type: params.type,
        format: body.format || 'pdf',
        status: 'completed',
        downloadUrl: `/api/v1/reports/download/rpt-${Date.now()}`,
        generatedAt: new Date().toISOString(),
      },
    });
  }),

  // Download Report
  http.get('/api/v1/reports/download/:id', async () => {
    await delay(200);
    // In real implementation, this would return the actual file
    return HttpResponse.json({
      success: true,
      data: {
        message: 'Report download initiated',
      },
    });
  }),
];
