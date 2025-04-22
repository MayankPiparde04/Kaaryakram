"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Users, 
  ShoppingBag, 
  Package, 
  UserCheck, 
  UserX, 
  Clock, 
  ChevronDown, 
  Search, 
  Eye, 
  Check, 
  X,
  BarChart3,
  PieChart,
  BoxSelect,
  ArrowUpRight,
  ArrowDownRight,
  Filter
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"

// Sample data for role applications
const roleApplications = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 98765 43210",
    role: "Pandit",
    experience: "10 years",
    specialization: "Vedic Rituals",
    date: "2025-04-15",
    status: "pending",
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya@example.com",
    phone: "+91 87654 32109",
    role: "Delivery",
    vehicleType: "Motorcycle",
    experience: "3 years",
    date: "2025-04-16",
    status: "pending",
  },
  {
    id: 3,
    name: "Amit Kumar",
    email: "amit@example.com",
    phone: "+91 76543 21098",
    role: "Darkstore",
    storeName: "Divine Supplies",
    location: "Mumbai",
    date: "2025-04-17",
    status: "pending",
  },
  {
    id: 4,
    name: "Sunita Verma",
    email: "sunita@example.com",
    phone: "+91 65432 10987",
    role: "Pandit",
    experience: "15 years",
    specialization: "Jyotish",
    date: "2025-04-10",
    status: "approved",
  },
  {
    id: 5,
    name: "Vikram Singh",
    email: "vikram@example.com",
    phone: "+91 54321 09876",
    role: "Delivery",
    vehicleType: "Scooter",
    experience: "2 years",
    date: "2025-04-12",
    status: "rejected",
  },
]

// Sample data for users
const users = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 98765 43210",
    role: null,
    joinDate: "2025-03-15",
    orders: 0,
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya@example.com",
    phone: "+91 87654 32109",
    role: null,
    joinDate: "2025-03-20",
    orders: 2,
  },
  {
    id: 3,
    name: "Amit Kumar",
    email: "amit@example.com",
    phone: "+91 76543 21098",
    role: null,
    joinDate: "2025-03-25",
    orders: 1,
  },
  {
    id: 4,
    name: "Sunita Verma",
    email: "sunita@example.com",
    phone: "+91 65432 10987",
    role: "Pandit",
    joinDate: "2025-03-10",
    orders: 0,
  },
  {
    id: 5,
    name: "Vikram Singh",
    email: "vikram@example.com",
    phone: "+91 54321 09876",
    role: "Delivery",
    joinDate: "2025-03-12",
    orders: 0,
  },
  {
    id: 6,
    name: "Deepak Gupta",
    email: "deepak@example.com",
    phone: "+91 43210 98765",
    role: "Darkstore",
    joinDate: "2025-03-05",
    orders: 0,
  },
  {
    id: 7,
    name: "Ananya Reddy",
    email: "ananya@example.com",
    phone: "+91 32109 87654",
    role: null,
    joinDate: "2025-04-01",
    orders: 3,
  },
]

// Sample data for orders
const orders = [
  {
    id: 1,
    orderNumber: "ORD-2025-001",
    customer: "Ananya Reddy",
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
    customer: "Ananya Reddy",
    items: ["Premium Pooja Kit"],
    total: 2999,
    status: "Delivered",
    date: "2025-04-18",
  },
  {
    id: 5,
    orderNumber: "ORD-2025-005",
    customer: "Ananya Reddy",
    items: ["Incense Sticks", "Camphor", "Coconut"],
    total: 357,
    status: "Delivered",
    date: "2025-04-17",
  },
  {
    id: 6,
    orderNumber: "ORD-2025-006",
    customer: "Priya Patel",
    items: ["Flowers", "Kumkum"],
    total: 348,
    status: "Processing",
    date: "2025-04-21",
  },
]

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("applications")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  // Redirect if not logged in
  // if (!user) {
  //   router.push("/login")
  //   return null
  // }

  // // Redirect if not an admin
  // if (!user.isAdmin) {
  //   router.push("/")
  //   return null
  // }

  // Filter applications based on search query and filters
  const filteredApplications = roleApplications.filter(
    (app) => {
      // Filter by search query
      const matchesSearch = 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.role.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by status
      const matchesStatus = statusFilter === "all" || app.status === statusFilter;
      
      // Filter by role
      const matchesRole = roleFilter === "all" || app.role === roleFilter;
      
      return matchesSearch && matchesStatus && matchesRole;
    }
  )

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.role && user.role.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Filter orders based on search query
  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleApplicationAction = (applicationId: number, action: string) => {
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Find the application by ID
      const application = roleApplications.find((app) => app.id === applicationId)

      if (application) {
        // Update the status of the application (in a real app, you'd send this to a server)
        application.status = action === "approve" ? "approved" : "rejected"

        // Show a toast notification
        toast({
          title: `Application ${action === "approve" ? "Approved" : "Rejected"}`,
          description: `Application from ${application.name} has been ${action === "approve" ? "approved" : "rejected"}.`,
        })

        // Close the dialog
        setIsApplicationDialogOpen(false)
        setIsLoading(false);
      }
    }, 600);
  }
  
  // Count statistics
  const stats = {
    totalUsers: users.length,
    totalOrders: orders.length,
    pendingApplications: roleApplications.filter(app => app.status === "pending").length,
    totalRevenue: orders.reduce((total, order) => total + order.total, 0)
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-10 px-4 max-w-7xl"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your platform data and users</p>
        </div>
        <div className="flex items-center gap-4">
          <Select defaultValue="today">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button>
            <BarChart3 className="h-4 w-4 mr-2" />
            Reports
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Users</p>
                  <h3 className="text-3xl font-bold mt-2">{stats.totalUsers}</h3>
                  <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600">
                    <ArrowUpRight className="h-3 w-3" />
                    <span>+12% from last month</span>
                  </div>
                </div>
                <div className="rounded-full bg-primary/10 p-2">
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Orders</p>
                  <h3 className="text-3xl font-bold mt-2">{stats.totalOrders}</h3>
                  <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600">
                    <ArrowUpRight className="h-3 w-3" />
                    <span>+5% from last month</span>
                  </div>
                </div>
                <div className="rounded-full bg-orange-500/10 p-2">
                  <ShoppingBag className="h-8 w-8 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Revenue</p>
                  <h3 className="text-3xl font-bold mt-2">₹{stats.totalRevenue}</h3>
                  <div className="flex items-center gap-1 mt-2 text-xs text-destructive">
                    <ArrowDownRight className="h-3 w-3" />
                    <span>-2% from last month</span>
                  </div>
                </div>
                <div className="rounded-full bg-emerald-500/10 p-2">
                  <PieChart className="h-8 w-8 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Pending Applications</p>
                  <h3 className="text-3xl font-bold mt-2">{stats.pendingApplications}</h3>
                  <div className="flex items-center gap-1 mt-2 text-xs text-amber-500">
                    <Clock className="h-3 w-3" />
                    <span>Requires attention</span>
                  </div>
                </div>
                <div className="rounded-full bg-blue-500/10 p-2">
                  <BoxSelect className="h-8 w-8 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-5">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="overflow-x-auto">
            <TabsTrigger value="applications" className="relative">
              Role Applications
              {stats.pendingApplications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
                  {stats.pendingApplications}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="applications">
          <Card>
            <CardHeader className="pb-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">Role Applications</CardTitle>
                  <CardDescription>
                    Manage applications for Pandit, Delivery Partner and Darkstore Owner roles
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search applications..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4"
                    />
                  </div>
                  <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-1">
                          <Filter className="h-4 w-4 mr-1" />
                          Filter
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setStatusFilter("all")} className="cursor-pointer">
                          <span className={statusFilter === "all" ? "font-medium" : ""}>All</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("pending")} className="cursor-pointer">
                          <span className={statusFilter === "pending" ? "font-medium" : ""}>Pending</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("approved")} className="cursor-pointer">
                          <span className={statusFilter === "approved" ? "font-medium" : ""}>Approved</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("rejected")} className="cursor-pointer">
                          <span className={statusFilter === "rejected" ? "font-medium" : ""}>Rejected</span>
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setRoleFilter("all")} className="cursor-pointer">
                          <span className={roleFilter === "all" ? "font-medium" : ""}>All</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setRoleFilter("Pandit")} className="cursor-pointer">
                          <span className={roleFilter === "Pandit" ? "font-medium" : ""}>Pandit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setRoleFilter("Delivery")} className="cursor-pointer">
                          <span className={roleFilter === "Delivery" ? "font-medium" : ""}>Delivery</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setRoleFilter("Darkstore")} className="cursor-pointer">
                          <span className={roleFilter === "Darkstore" ? "font-medium" : ""}>Darkstore</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Applicant</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No applications found matching your criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredApplications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {application.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{application.name}</p>
                                <p className="text-muted-foreground text-sm">{application.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-normal">
                              {application.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{application.date}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                application.status === "approved"
                                  ? "success"
                                  : application.status === "rejected"
                                    ? "destructive"
                                    : "outline"
                              }
                              className="flex w-fit items-center gap-1"
                            >
                              {application.status === "approved" ? (
                                <UserCheck className="h-3 w-3" />
                              ) : application.status === "rejected" ? (
                                <UserX className="h-3 w-3" />
                              ) : (
                                <Clock className="h-3 w-3" />
                              )}
                              <span className="capitalize">{application.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedApplication(application)}>
                                  <Eye className="h-3 w-3 mr-1" /> View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[525px]">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <Badge variant="outline">{application?.role}</Badge>
                                    Role Application
                                  </DialogTitle>
                                  <DialogDescription>
                                    Review all information for this role application
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="py-6">
                                  <div className="flex items-center gap-4 mb-6">
                                    <Avatar className="h-16 w-16">
                                      <AvatarFallback className="bg-primary/10 text-primary text-lg">
                                        {selectedApplication?.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h3 className="font-bold text-xl">{selectedApplication?.name}</h3>
                                      <p className="text-muted-foreground">{selectedApplication?.email}</p>
                                    </div>
                                  </div>
                                
                                  <Separator className="my-6" />
                                
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4">
                                      <div>
                                        <p className="text-sm text-muted-foreground">Phone</p>
                                        <p className="font-medium">{selectedApplication?.phone}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-muted-foreground">Applied On</p>
                                        <p className="font-medium">{selectedApplication?.date}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-muted-foreground">Status</p>
                                        <Badge
                                          variant={
                                            selectedApplication?.status === "approved"
                                              ? "success"
                                              : selectedApplication?.status === "rejected"
                                                ? "destructive"
                                                : "outline"
                                          }
                                          className="mt-1"
                                        >
                                          <span className="capitalize">{selectedApplication?.status}</span>
                                        </Badge>
                                      </div>
                                    </div>
                                    
                                    {selectedApplication?.role === "Pandit" && (
                                      <>
                                        <Separator />
                                        <div>
                                          <h4 className="font-medium mb-2">Pandit Details</h4>
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <p className="text-sm text-muted-foreground">Experience</p>
                                              <p>{selectedApplication?.experience}</p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-muted-foreground">Specialization</p>
                                              <p>{selectedApplication?.specialization}</p>
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                    
                                    {selectedApplication?.role === "Delivery" && (
                                      <>
                                        <Separator />
                                        <div>
                                          <h4 className="font-medium mb-2">Delivery Partner Details</h4>
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <p className="text-sm text-muted-foreground">Vehicle Type</p>
                                              <p>{selectedApplication?.vehicleType}</p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-muted-foreground">Experience</p>
                                              <p>{selectedApplication?.experience}</p>
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                    
                                    {selectedApplication?.role === "Darkstore" && (
                                      <>
                                        <Separator />
                                        <div>
                                          <h4 className="font-medium mb-2">Darkstore Details</h4>
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <p className="text-sm text-muted-foreground">Store Name</p>
                                              <p>{selectedApplication?.storeName}</p>
                                            </div>
                                            <div>
                                              <p className="text-sm text-muted-foreground">Location</p>
                                              <p>{selectedApplication?.location}</p>
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                                
                                <DialogFooter className="flex-col sm:flex-row gap-2">
                                  {selectedApplication?.status === "pending" && (
                                    <>
                                      <Button
                                        variant="destructive"
                                        onClick={() => handleApplicationAction(selectedApplication.id, "reject")}
                                        disabled={isLoading}
                                        className="gap-1"
                                      >
                                        {isLoading ? (
                                          <><span className="animate-spin h-4 w-4 border-2 border-r-transparent rounded-full mr-2"></span>Processing</>
                                        ) : (
                                          <><X className="h-4 w-4 mr-1" /> Reject</>
                                        )}
                                      </Button>
                                      <Button
                                        onClick={() => handleApplicationAction(selectedApplication.id, "approve")}
                                        disabled={isLoading}
                                        className="gap-1"
                                      >
                                        {isLoading ? (
                                          <><span className="animate-spin h-4 w-4 border-2 border-r-transparent rounded-full mr-2"></span>Processing</>
                                        ) : (
                                          <><Check className="h-4 w-4 mr-1" /> Approve</>
                                        )}
                                      </Button>
                                    </>
                                  )}
                                  <Button type="button" variant="outline" onClick={() => setIsApplicationDialogOpen(false)}>
                                    Close
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredApplications.length} applications
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader className="pb-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">Users</CardTitle>
                  <CardDescription>
                    Manage all registered users on your platform
                  </CardDescription>
                </div>
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">User</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-muted-foreground text-sm">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>
                          {user.role ? (
                            <Badge variant="outline" className="font-normal">
                              {user.role}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">Customer</span>
                          )}
                        </TableCell>
                        <TableCell>{user.joinDate}</TableCell>
                        <TableCell>{user.orders}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" /> 
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredUsers.length} users
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader className="pb-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">Orders</CardTitle>
                  <CardDescription>
                    View and manage all customer orders
                  </CardDescription>
                </div>
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead className="hidden md:table-cell">Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {order.items.map((item, index) => (
                              <Badge key={index} variant="secondary" className="font-normal">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>₹{order.total}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.status === "Delivered"
                                ? "success"
                                : order.status === "Processing"
                                  ? "outline"
                                  : "secondary"
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" /> 
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredOrders.length} orders
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Products</CardTitle>
              <CardDescription>Manage product inventory and listings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-3">
                  <Package className="h-16 w-16 mx-auto text-muted-foreground opacity-20" />
                  <h3 className="text-xl font-medium">Products management coming soon</h3>
                  <p className="text-muted-foreground max-w-md">
                    This section is currently in development. Check back soon for updates.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Analytics</CardTitle>
              <CardDescription>Platform performance metrics and reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-3">
                  <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground opacity-20" />
                  <h3 className="text-xl font-medium">Analytics coming soon</h3>
                  <p className="text-muted-foreground max-w-md">
                    Our analytics dashboard is currently in development. Check back soon for detailed reports.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
