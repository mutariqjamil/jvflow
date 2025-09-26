import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Progress } from '../ui/progress'
import { 
  Package, 
  Plus, 
  AlertTriangle,
  TrendingDown,
  Truck,
  Eye
} from 'lucide-react'
import { useInternationalization } from '../providers/InternationalizationProvider'

// Mock data
const mockMaterials = [
  {
    id: '1',
    name: 'Cement',
    category: 'Building Materials',
    quantity: 150,
    unit: 'bags',
    unitCost: 25,
    totalValue: 3750,
    supplier: 'ABC Construction Supply',
    stockLevel: 'adequate',
    reorderLevel: 50,
    lastUpdated: '2025-01-15'
  },
  {
    id: '2',
    name: 'Steel Rods',
    category: 'Construction Steel',
    quantity: 25,
    unit: 'tons',
    unitCost: 800,
    totalValue: 20000,
    supplier: 'Steel Works Ltd',
    stockLevel: 'low',
    reorderLevel: 10,
    lastUpdated: '2025-01-14'
  },
  {
    id: '3',
    name: 'Bricks',
    category: 'Building Materials',
    quantity: 50000,
    unit: 'pieces',
    unitCost: 0.5,
    totalValue: 25000,
    supplier: 'Local Brick Works',
    stockLevel: 'adequate',
    reorderLevel: 20000,
    lastUpdated: '2025-01-13'
  },
  {
    id: '4',
    name: 'Paint',
    category: 'Finishing Materials',
    quantity: 8,
    unit: 'gallons',
    unitCost: 45,
    totalValue: 360,
    supplier: 'Premium Paints Co',
    stockLevel: 'critical',
    reorderLevel: 15,
    lastUpdated: '2025-01-12'
  }
]

const categoryData = [
  { name: 'Building Materials', count: 125, value: 85000 },
  { name: 'Construction Steel', count: 45, value: 120000 },
  { name: 'Finishing Materials', count: 78, value: 35000 },
  { name: 'Electrical', count: 92, value: 28000 },
  { name: 'Plumbing', count: 67, value: 22000 }
]

export function MaterialManagementDashboard() {
  const { t, formatCurrency } = useInternationalization()
  
  const totalMaterials = mockMaterials.length
  const lowStockItems = mockMaterials.filter(m => m.stockLevel === 'low' || m.stockLevel === 'critical').length
  const totalValue = mockMaterials.reduce((sum, m) => sum + m.totalValue, 0)
  const materialsConsumed = 45

  const getStockLevelColor = (level: string) => {
    switch (level) {
      case 'adequate': return 'bg-green-100 text-green-800'
      case 'low': return 'bg-orange-100 text-orange-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStockIcon = (level: string) => {
    switch (level) {
      case 'adequate': return <Package className="h-4 w-4" />
      case 'low': return <TrendingDown className="h-4 w-4" />
      case 'critical': return <AlertTriangle className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('materials.title')}</h1>
          <p className="text-muted-foreground">
            {t('materials.description')}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Truck className="h-4 w-4 mr-2" />
            {t('materials.createPO')}
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t('materials.addMaterial')}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('materials.totalMaterials')}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMaterials}</div>
            <p className="text-xs text-muted-foreground">
              {categoryData.length} {t('materials.categoriesManaged')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('materials.lowStock')}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems}</div>
            <p className="text-xs text-orange-600">
              {t('materials.itemsNeedReorder')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('materials.totalValue')}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-green-600">
              +8% {t('overview.thisMonth')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('materials.thisMonth')}</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materialsConsumed}</div>
            <p className="text-xs text-muted-foreground">
              {t('materials.materialsUsed')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Categories Overview */}
      <Card>
        <CardHeader>
          <CardTitle>{t('materials.categories')}</CardTitle>
          <CardDescription>
            {t('materials.categoriesManaged')} - {categoryData.length} {t('materials.categories').toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryData.map((category, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">{t('materials.quantity')}</div>
                      <div className="font-medium">{category.count} items</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">{t('materials.totalValue')}</div>
                      <div className="font-medium">{formatCurrency(category.value)}</div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">{t('materials.stockLevel')}</div>
                  <Progress value={(category.count / 150) * 100} className="w-20 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Materials Inventory */}
      <Card>
        <CardHeader>
          <CardTitle>{t('materials.totalMaterials')}</CardTitle>
          <CardDescription>
            {t('materials.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('bookings.name')}</TableHead>
                <TableHead>{t('materials.category')}</TableHead>
                <TableHead>{t('materials.quantity')}</TableHead>
                <TableHead>{t('materials.unitCost')}</TableHead>
                <TableHead>{t('materials.totalValue')}</TableHead>
                <TableHead>{t('materials.supplier')}</TableHead>
                <TableHead>{t('materials.stockLevel')}</TableHead>
                <TableHead>{t('materials.lastUpdated')}</TableHead>
                <TableHead>{t('bookings.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMaterials.map((material) => (
                <TableRow key={material.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{material.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{material.category}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{material.quantity.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{material.unit}</div>
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(material.unitCost)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(material.totalValue)}</TableCell>
                  <TableCell className="text-sm">{material.supplier}</TableCell>
                  <TableCell>
                    <Badge className={getStockLevelColor(material.stockLevel)}>
                      <span className="flex items-center gap-1">
                        {getStockIcon(material.stockLevel)}
                        {material.stockLevel}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {material.lastUpdated}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      {t('materials.viewDetails')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}