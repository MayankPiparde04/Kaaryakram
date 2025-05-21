"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { 
  Package, 
  ShoppingBag, 
  BarChart3, 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  ChevronDown, 
  Check, 
  ArrowUpRight, 
  TrendingUp,
  CalendarRange,
  Clock,
  Truck,
  CheckCircle2,
  Filter,
  Eye,
  Settings,
  Inbox
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"

// Sample data for inventory
const inventoryItems = [
  {
    id: 1,
    name: "Ghee Diya",
    category: "Pooja Items",
    price: 199,
    stock: 45,
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 2,
    name: "Kumkum",
    category: "Pooja Items",
    price: 99,
    stock: 78,
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 3,
    name: "Incense Sticks",
    category: "Pooja Items",
    price: 149,
    stock: 120,
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 4,
    name: "Camphor",
    category: "Pooja Items",
    price: 129,
    stock: 65,
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 5,
    name: "Flowers",
    category: "Offerings",
    price: 249,
    stock: 30,
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 6,
    name: "Coconut",
    category: "Offerings",
    price: 79,
    stock: 50,
    image: "/placeholder.svg?height=50&width=50",
  },
]

// Sample data for packages
const packages = [
  {
    id: 1,
    name: "Basic Pooja Kit",
    description: "Essential items for daily worship",
    price: 999,
    items: ["Ghee Diya", "Kumkum", "Incense Sticks", "Camphor"],
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 2,
    name: "Festival Package",
    description: "Complete package for festival celebrations",
    price: 1999,
    items: ["Ghee Diya", "Kumkum", "Incense Sticks", "Camphor", "Flowers", "Coconut"],
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 3,
    name: "Premium Pooja Kit",
    description: "Premium quality items for special occasions",
    price: 2999,
    items: ["Ghee Diya", "Kumkum", "Incense Sticks", "Camphor", "Flowers", "Coconut"],
    image: "/placeholder.svg?height=50&width=50",
  },
]

// Sample data for orders
const orders = [
  {
    id: 1,
    orderNumber: "ORD-2025-001",
    customer: "Rahul Sharma",
    items: ["Ghee Diya", "Kumkum", "Incense Sticks"],
    total: 447,
    status: "Processing",
    date: "2025-04-21",
  },
  {
    id: 2,
    orderNumber: "ORD-2025-002",
    customer: "Priya Patel",
    items: ["Basic Pooja Kit"],
    total: 999,
    status: "Shipped",
    date: "2025-04-20",
  },
  {
    id: 3,
    orderNumber: "ORD-2025-003",
    customer: "Amit Kumar",
    items: ["Coconut", "Flowers"],
    total: 328,
    status: "Delivered",
    date: "2025-04-19",
  },
  {
    id: 4,
    orderNumber: "ORD-2025-004",
    customer: "Sunita Verma",
    items: ["Premium Pooja Kit"],
    total: 2999,
    status: "Delivered",
    date: "2025-04-18",
  },
  {
    id: 5,
    orderNumber: "ORD-2025-005",
    customer: "Vikram Singh",
    items: ["Incense Sticks", "Camphor", "Coconut"],
    total: 357,
    status: "Delivered",
    date: "2025-04-17",
  },
]

export default function DarkstoreDashboardPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("inventory")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false)
  const [isAddPackageDialogOpen, setIsAddPackageDialogOpen] = useState(false)
  const [selectedItemToDelete, setSelectedItemToDelete] = useState<number | null>(null)
  const [selectedPackageToDelete, setSelectedPackageToDelete] = useState<number | null>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [timeFilter, setTimeFilter] = useState("week")

  // Redirect if not logged in
  // if (!user) {
  //   router.push("/login")
  //   return null
  // }

  // // Redirect if not a darkstore owner
  // if (user.role !== "Darkstore") {
  //   router.push("/")
  //   return null
  // }

  // Filter inventory items based on search query
  const filteredInventory = inventoryItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filter packages based on search query
  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filter orders based on search query
  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.status.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const lowStockItems = inventoryItems.filter(item => item.stock < 30).length;
  const pendingOrders = orders.filter(order => order.status === "Processing").length;
  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);

  const addInventoryItem = () => {
    toast({
      title: "Item added",
      description: "The inventory item has been added successfully.",
    })
    setIsAddItemDialogOpen(false)
  }

  const addPackage = () => {
    toast({
      title: "Package added",
      description: "The package has been added successfully.",
    })
    setIsAddPackageDialogOpen(false)
  }

  const confirmDelete = (type: 'item' | 'package') => {
    if (type === 'item' && selectedItemToDelete) {
      toast({
        title: "Item deleted",
        description: "The item has been deleted successfully.",
      })
    } else if (type === 'package' && selectedPackageToDelete) {
      toast({
        title: "Package deleted",
        description: "The package has been deleted successfully.",
      })
    }
    setIsDeleteConfirmOpen(false)
    setSelectedItemToDelete(null)
    setSelectedPackageToDelete(null)
  }

  const updateOrderStatus = (orderId: number, newStatus: string) => {
    toast({
      title: "Order updated",
      description: `Order status changed to ${newStatus}.`,
    })
  }

  // Stats for simplified charts
  const monthlySales = [4200, 5800, 6300, 7500, 9200, 8400, 9800, 10500, 12000, 11300, 10800, 12500];
  const mostSoldCategories = [
    { name: "Pooja Items", percentage: 45 },
    { name: "Offerings", percentage: 30 },
    { name: "Idols", percentage: 15 },
    { name: "Books", percentage: 10 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container py-8 px-4 max-w-7xl"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Warehouse Dashboard</h1>
          <p className="text-muted-foreground">Manage your inventory, packages, and orders</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Enhanced Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-background rounded-full p-2">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex items-center text-xs text-primary">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>+14%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Inventory Items</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold">{inventoryItems.length}</h3>
                    <p className="text-xs text-muted-foreground">items</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-muted/30 text-xs border-t flex items-center justify-between">
                <span className="text-amber-600 font-medium flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {lowStockItems} low stock items
                </span>
                <Button variant="ghost" size="sm" className="h-7 text-xs">View</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-blue-500/20 to-blue-500/5 p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-background rounded-full p-2">
                    <ShoppingBag className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex items-center text-xs text-blue-500">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>+8%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Packages</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold">{packages.length}</h3>
                    <p className="text-xs text-muted-foreground">bundles</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-muted/30 text-xs border-t flex items-center justify-between">
                <span className="text-blue-500 font-medium flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Popular: {packages[0].name}
                </span>
                <Button variant="ghost" size="sm" className="h-7 text-xs">View</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-amber-500/20 to-amber-500/5 p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-background rounded-full p-2">
                    <Inbox className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="flex items-center text-xs text-amber-500">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>+12%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Orders</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold">{orders.length}</h3>
                    <p className="text-xs text-muted-foreground">total</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-muted/30 text-xs border-t flex items-center justify-between">
                <span className="text-amber-600 font-medium flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {pendingOrders} pending orders
                </span>
                <Button variant="ghost" size="sm" className="h-7 text-xs">View</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-green-500/20 to-green-500/5 p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-background rounded-full p-2">
                    <BarChart3 className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex items-center text-xs text-green-500">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>+23%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Revenue</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold">₹{totalRevenue}</h3>
                    <p className="text-xs text-muted-foreground">total</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-muted/30 text-xs border-t flex items-center justify-between">
                <span className="text-green-500 font-medium flex items-center">
                  <CalendarRange className="h-3 w-3 mr-1" />
                  This {timeFilter}
                </span>
                <Button variant="ghost" size="sm" className="h-7 text-xs">View</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Revenue and Category Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Monthly Revenue</CardTitle>
            <CardDescription>Revenue trends over time</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[240px] w-full relative mt-4">
              <div className="absolute bottom-0 left-0 right-0 flex items-end h-[200px] gap-1 px-2">
                {monthlySales.map((sale, index) => {
                  const height = (sale / Math.max(...monthlySales)) * 100;
                  return (
                    <motion.div 
                      key={index}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="bg-primary/80 hover:bg-primary flex-1 rounded-t group relative"
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background border shadow-sm rounded px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        ₹{sale}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-border"></div>
              <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-1 text-xs text-muted-foreground">
                <span>Jan</span>
                <span>Dec</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Top Categories</CardTitle>
            <CardDescription>Most sold product categories</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-6 mt-4">
              {mostSoldCategories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className="text-sm">{category.percentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary overflow-hidden rounded-full">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${category.percentage}%` }}
                      transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                      className={`h-full rounded-full ${
                        index === 0 ? "bg-primary" : 
                        index === 1 ? "bg-blue-500" : 
                        index === 2 ? "bg-amber-500" : 
                        "bg-green-500"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Warehouse Management</CardTitle>
              <CardDescription>Manage your inventory, packages, and orders</CardDescription>
            </div>
            <div className="flex gap-2">
              {activeTab === "inventory" && (
                <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                      <DialogTitle>Add Inventory Item</DialogTitle>
                      <DialogDescription>Add a new item to your inventory</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                      <div className="flex items-center justify-center">
                        <div className="border-2 border-dashed rounded-lg p-4 w-32 h-32 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors">
                          <Plus className="h-8 w-8 mb-2 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Upload Image</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">
                            Name
                          </label>
                          <Input id="name" placeholder="Item name" />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="category" className="text-sm font-medium">
                            Category
                          </label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pooja-items">Pooja Items</SelectItem>
                              <SelectItem value="offerings">Offerings</SelectItem>
                              <SelectItem value="idols">Idols & Statues</SelectItem>
                              <SelectItem value="books">Religious Books</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="price" className="text-sm font-medium">
                            Price (₹)
                          </label>
                          <Input id="price" type="number" placeholder="0.00" />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="stock" className="text-sm font-medium">
                            Stock
                          </label>
                          <Input id="stock" type="number" placeholder="0" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-medium">
                          Description
                        </label>
                        <Input id="description" placeholder="Item description" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="featured" />
                        <label htmlFor="featured" className="text-sm font-medium">
                          Feature this item
                        </label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddItemDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addInventoryItem}>Add Item</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {activeTab === "packages" && (
                <Dialog open={isAddPackageDialogOpen} onOpenChange={setIsAddPackageDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Package
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                      <DialogTitle>Add Package</DialogTitle>
                      <DialogDescription>Create a new package with multiple items</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                      <div className="flex items-center justify-center">
                        <div className="border-2 border-dashed rounded-lg p-4 w-32 h-32 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors">
                          <Plus className="h-8 w-8 mb-2 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Upload Image</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="package-name" className="text-sm font-medium">
                            Name
                          </label>
                          <Input id="package-name" placeholder="Package name" />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="package-price" className="text-sm font-medium">
                            Price (₹)
                          </label>
                          <Input id="package-price" type="number" placeholder="0.00" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-medium">
                          Description
                        </label>
                        <Input id="description" placeholder="Package description" />
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-2">
                          Select Items
                        </label>
                        <div className="border rounded-md p-4 max-h-[200px] overflow-y-auto">
                          <div className="space-y-2">
                            {inventoryItems.map((item) => (
                              <div key={item.id} className="flex items-center space-x-2">
                                <input type="checkbox" id={`item-${item.id}`} className="rounded" />
                                <label htmlFor={`item-${item.id}`} className="text-sm flex items-center gap-2">
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={24}
                                    height={24}
                                    className="rounded"
                                  />
                                  <span>{item.name}</span>
                                  <span className="text-muted-foreground text-xs">₹{item.price}</span>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="discount" />
                        <label htmlFor="discount" className="text-sm font-medium">
                          Offer discount on this package
                        </label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddPackageDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addPackage}>Add Package</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          <div className="relative mt-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${activeTab}...`}
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {activeTab === "inventory" && (
                <Select defaultValue={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="pooja-items">Pooja Items</SelectItem>
                    <SelectItem value="offerings">Offerings</SelectItem>
                    <SelectItem value="idols">Idols & Statues</SelectItem>
                    <SelectItem value="books">Religious Books</SelectItem>
                  </SelectContent>
                </Select>
              )}
              
              {activeTab === "orders" && (
                <Select defaultValue={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1">
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                    <ChevronDown className="h-3 w-3 ml-1 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Check className="h-4 w-4 mr-2 opacity-50" />
                    Newest first
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Check className="h-4 w-4 mr-2 opacity-0" />
                    Oldest first
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Check className="h-4 w-4 mr-2 opacity-0" />
                    Price: Low to High
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Check className="h-4 w-4 mr-2 opacity-0" />
                    Price: High to Low
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 w-full md:w-auto">
              <TabsTrigger value="inventory" className="flex-1 md:flex-none">
                Inventory
              </TabsTrigger>
              <TabsTrigger value="packages" className="flex-1 md:flex-none">
                Packages
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex-1 md:flex-none">
                <div className="flex items-center">
                  Orders
                  {pendingOrders > 0 && (
                    <span className="ml-1.5 w-5 h-5 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
                      {pendingOrders}
                    </span>
                  )}
                </div>
              </TabsTrigger>
            </TabsList>

            {/* Inventory Tab */}
            <TabsContent value="inventory">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={40}
                            height={40}
                            className="rounded-md object-cover border"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal">
                            {item.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">₹{item.price}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className={item.stock < 30 ? "text-destructive" : ""}>
                              {item.stock}
                            </span>
                            {item.stock < 30 && (
                              <Badge variant="destructive" className="text-xs">Low</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View details</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit item</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the
                                    item from your inventory.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => confirmDelete('item')}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredInventory.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10">
                          <div className="flex flex-col items-center justify-center text-center">
                            <Package className="h-10 w-10 text-muted-foreground mb-3" />
                            <h3 className="text-lg font-medium">No items found</h3>
                            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                              We couldn't find any inventory items matching your criteria.
                            </p>
                            <Button onClick={() => setIsAddItemDialogOpen(true)}>
                              <Plus className="h-4 w-4 mr-2" />
                              Add New Item
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Packages Tab */}
            <TabsContent value="packages">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPackages.map((pkg) => (
                      <TableRow key={pkg.id}>
                        <TableCell>
                          <Image
                            src={pkg.image || "/placeholder.svg"}
                            alt={pkg.name}
                            width={40}
                            height={40}
                            className="rounded-md object-cover border"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{pkg.name}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{pkg.description}</TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className="cursor-default">
                                <span className="flex items-center">
                                  <span className="font-medium">{pkg.items.length}</span>
                                  <span className="text-xs text-muted-foreground ml-1">items</span>
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <ul className="list-disc list-inside text-sm">
                                  {pkg.items.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                  ))}
                                </ul>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell className="text-right">₹{pkg.price}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View details</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit package</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the
                                    package from your store.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => confirmDelete('package')}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredPackages.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10">
                          <div className="flex flex-col items-center justify-center text-center">
                            <ShoppingBag className="h-10 w-10 text-muted-foreground mb-3" />
                            <h3 className="text-lg font-medium">No packages found</h3>
                            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                              We couldn't find any packages matching your criteria.
                            </p>
                            <Button onClick={() => setIsAddPackageDialogOpen(true)}>
                              <Plus className="h-4 w-4 mr-2" />
                              Add New Package
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <span>{order.orderNumber}</span>
                            {order.status === "Processing" && (
                              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {order.customer.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            {order.customer}
                          </div>
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="flex flex-wrap gap-1 max-w-[150px]">
                                  {order.items.length > 1 ? (
                                    <Badge variant="secondary" className="font-normal whitespace-nowrap">
                                      {order.items[0]} +{order.items.length-1} more
                                    </Badge>
                                  ) : (
                                    <Badge variant="secondary" className="font-normal">
                                      {order.items[0]}
                                    </Badge>
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <ul className="list-disc list-inside text-sm">
                                  {order.items.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                  ))}
                                </ul>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <Select 
                            defaultValue={order.status} 
                            onValueChange={(value) => updateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger className="h-8 w-[130px]">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Processing">
                                <div className="flex items-center">
                                  <Clock className="mr-2 h-4 w-4 text-amber-500" />
                                  Processing
                                </div>
                              </SelectItem>
                              <SelectItem value="Shipped">
                                <div className="flex items-center">
                                  <Truck className="mr-2 h-4 w-4 text-blue-500" />
                                  Shipped
                                </div>
                              </SelectItem>
                              <SelectItem value="Delivered">
                                <div className="flex items-center">
                                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                                  Delivered
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right font-medium">₹{order.total}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" /> 
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredOrders.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10">
                          <div className="flex flex-col items-center justify-center text-center">
                            <Inbox className="h-10 w-10 text-muted-foreground mb-3" />
                            <h3 className="text-lg font-medium">No orders found</h3>
                            <p className="text-sm text-muted-foreground max-w-xs">
                              We couldn't find any orders matching your criteria.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredInventory.length} items in {activeTab}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
