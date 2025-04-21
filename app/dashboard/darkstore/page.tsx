"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Package, ShoppingBag, BarChart3, Plus, Pencil, Trash2, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

  // Redirect if not logged in
  if (!user) {
    router.push("/login")
    return null
  }

  // Redirect if not a darkstore owner
  if (user.role !== "Darkstore") {
    router.push("/")
    return null
  }

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

  const deleteItem = (itemId: number) => {
    toast({
      title: "Item deleted",
      description: "The item has been deleted successfully.",
    })
  }

  const deletePackage = (packageId: number) => {
    toast({
      title: "Package deleted",
      description: "The package has been deleted successfully.",
    })
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Darkstore Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Stats Cards */}
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-3xl font-bold">{inventoryItems.length}</h3>
            <p className="text-sm text-muted-foreground">Inventory Items</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center mb-2">
              <ShoppingBag className="h-6 w-6 text-secondary-foreground" />
            </div>
            <h3 className="text-3xl font-bold">{packages.length}</h3>
            <p className="text-sm text-muted-foreground">Packages</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-3xl font-bold">{orders.length}</h3>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Darkstore Management</CardTitle>
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
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Inventory Item</DialogTitle>
                      <DialogDescription>Add a new item to your inventory</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="name" className="text-right">
                          Name
                        </label>
                        <Input id="name" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="category" className="text-right">
                          Category
                        </label>
                        <Select>
                          <SelectTrigger className="col-span-3">
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
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="price" className="text-right">
                          Price (₹)
                        </label>
                        <Input id="price" type="number" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="stock" className="text-right">
                          Stock
                        </label>
                        <Input id="stock" type="number" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="image" className="text-right">
                          Image
                        </label>
                        <Input id="image" type="file" className="col-span-3" />
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
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Package</DialogTitle>
                      <DialogDescription>Create a new package with multiple items</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="package-name" className="text-right">
                          Name
                        </label>
                        <Input id="package-name" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="description" className="text-right">
                          Description
                        </label>
                        <Input id="description" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="package-price" className="text-right">
                          Price (₹)
                        </label>
                        <Input id="package-price" type="number" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="items" className="text-right">
                          Items
                        </label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select items" />
                          </SelectTrigger>
                          <SelectContent>
                            {inventoryItems.map((item) => (
                              <SelectItem key={item.id} value={item.id.toString()}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="package-image" className="text-right">
                          Image
                        </label>
                        <Input id="package-image" type="file" className="col-span-3" />
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="packages">Packages</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
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
                            className="rounded-md"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="text-right">₹{item.price}</TableCell>
                        <TableCell className="text-right">{item.stock}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredInventory.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No items found
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
                            className="rounded-md"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{pkg.name}</TableCell>
                        <TableCell>{pkg.description}</TableCell>
                        <TableCell>{pkg.items.length} items</TableCell>
                        <TableCell className="text-right">₹{pkg.price}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => deletePackage(pkg.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredPackages.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No packages found
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.items.join(", ")}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.status === "Processing"
                                ? "outline"
                                : order.status === "Shipped"
                                  ? "secondary"
                                  : "default"
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">₹{order.total}</TableCell>
                      </TableRow>
                    ))}
                    {filteredOrders.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No orders found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
