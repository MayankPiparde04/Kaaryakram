"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Package, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Phone, 
  User, 
  Truck,
  Route,
  Star,
  Search,
  CircleDollarSign,
  Navigation,
  ArrowRight,
  ArrowUpRight,
  Filter,
  ChevronDown,
  Map,
  MenuSquare
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"
import MapComponent from "@/components/delivery-map" // This would be your map component

// Sample data for assigned deliveries
const assignedDeliveries = [
  {
    id: 1,
    orderNumber: "ORD-2025-001",
    items: ["Ghee Diya", "Kumkum", "Incense Sticks"],
    customer: "Rahul Sharma",
    phone: "+91 98765 43210",
    address: "123 Devotee Street, Mumbai",
    date: "2025-04-25",
    time: "10:00 AM - 12:00 PM",
    status: "assigned",
  },
  {
    id: 2,
    orderNumber: "ORD-2025-002",
    items: ["Coconut", "Flowers", "Camphor"],
    customer: "Priya Patel",
    phone: "+91 87654 32109",
    address: "456 New Home Avenue, Delhi",
    date: "2025-04-26",
    time: "02:00 PM - 04:00 PM",
    status: "assigned",
  },
  {
    id: 3,
    orderNumber: "ORD-2025-003",
    items: ["Basic Pooja Kit", "Flowers"],
    customer: "Amit Kumar",
    phone: "+91 76543 21098",
    address: "789 Temple Road, Bangalore",
    date: "2025-04-27",
    time: "09:00 AM - 11:00 AM",
    status: "assigned",
  },
]

// Sample data for completed deliveries
const completedDeliveries = [
  {
    id: 4,
    orderNumber: "ORD-2025-004",
    items: ["Premium Pooja Kit"],
    customer: "Sunita Verma",
    phone: "+91 65432 10987",
    address: "321 Prosperity Lane, Chennai",
    date: "2025-04-15",
    time: "11:00 AM - 01:00 PM",
    status: "completed",
  },
  {
    id: 5,
    orderNumber: "ORD-2025-005",
    items: ["Incense Sticks", "Camphor", "Coconut"],
    customer: "Vikram Singh",
    phone: "+91 54321 09876",
    address: "654 Celestial Road, Hyderabad",
    date: "2025-04-10",
    time: "03:00 PM - 05:00 PM",
    status: "completed",
  },
]

export default function DeliveryDashboardPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("assigned")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState("date-asc")
  const [isMapView, setIsMapView] = useState(false)
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [deliveryProgress, setDeliveryProgress] = useState(0)

  // Redirect if not logged in
  // if (!user) {
  //   router.push("/login")
  //   return null
  // }

  // // Redirect if not a delivery partner
  // if (user.role !== "Delivery") {
  //   router.push("/")
  //   return null
  // }

  // Filter deliveries based on search query
  const filteredAssignedDeliveries = assignedDeliveries.filter(delivery => 
    delivery.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    delivery.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    delivery.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCompletedDeliveries = completedDeliveries.filter(delivery => 
    delivery.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    delivery.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    delivery.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort deliveries
  const sortDeliveries = (deliveries: any[]) => {
    return [...deliveries].sort((a, b) => {
      switch (sortOrder) {
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "customer-asc":
          return a.customer.localeCompare(b.customer);
        case "customer-desc":
          return b.customer.localeCompare(a.customer);
        default:
          return 0;
      }
    });
  };

  const sortedAssignedDeliveries = sortDeliveries(filteredAssignedDeliveries);
  const sortedCompletedDeliveries = sortDeliveries(filteredCompletedDeliveries);

  const markAsDelivered = (deliveryId: number) => {
    // Simulate progress
    setDeliveryProgress(0);
    const interval = setInterval(() => {
      setDeliveryProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Show toast after progress is complete
          toast({
            title: "Delivery marked as completed",
            description: "The delivery has been marked as completed successfully.",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  }

  const viewDeliveryDetails = (delivery: any) => {
    setSelectedDelivery(delivery);
    setShowDetailsDialog(true);
  }

  // Calculate statistics
  const todaysDeliveries = assignedDeliveries.filter(d => 
    new Date(d.date).toDateString() === new Date().toDateString()
  ).length;
  
  const weeklyEarnings = 1250; // In a real app, calculate this from completed deliveries
  const monthlyEarnings = 5400; // In a real app, calculate this from completed deliveries
  const totalDistance = 45; // In a real app, calculate this from completed deliveries
  
  // Simulate delivery locations for the map
  const deliveryLocations = assignedDeliveries.map(delivery => ({
    id: delivery.id,
    orderNumber: delivery.orderNumber,
    customer: delivery.customer,
    location: { lat: 18.52 + Math.random() * 0.1, lng: 73.85 + Math.random() * 0.1 } // Random locations near Pune
  }));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container py-8 px-4 max-w-7xl"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Delivery Partner Dashboard</h1>
          <p className="text-muted-foreground">Manage your deliveries efficiently</p>
        </div>
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button 
            variant={isMapView ? "outline" : "default"}
            size="sm"
            onClick={() => setIsMapView(false)}
            className="flex items-center gap-2"
          >
            <MenuSquare className="h-4 w-4" />
            List View
          </Button>
          <Button 
            variant={isMapView ? "default" : "outline"}
            size="sm"
            onClick={() => setIsMapView(true)}
            className="flex items-center gap-2"
          >
            <Map className="h-4 w-4" />
            Map View
          </Button>
        </motion.div>
      </div>

      {/* Profile Card */}
      <div className="mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary">
                  <AvatarImage src="/avatar-placeholder.png" />
                  <AvatarFallback>DP</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-bold text-xl">{user?.name || "Delivery Partner"}</h2>
                  <p className="text-muted-foreground text-sm">Active Since April 2025</p>
                </div>
              </div>
              <Separator orientation="vertical" className="h-12 hidden md:block" />
              <div className="flex items-center gap-6 flex-wrap justify-center md:justify-start">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Star className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Rating</p>
                    <p className="font-medium">4.8/5</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Route className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Distance</p>
                    <p className="font-medium">{totalDistance} km</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Deliveries</p>
                    <p className="font-medium">{completedDeliveries.length}</p>
                  </div>
                </div>
              </div>
              <div className="ml-auto hidden md:block">
                <Button size="sm">
                  View Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-background rounded-full p-2">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex items-center text-xs text-primary">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>+3</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold">{todaysDeliveries}</h3>
                <p className="text-sm text-muted-foreground">Today's Deliveries</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-blue-500/20 to-blue-500/5 p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-background rounded-full p-2">
                    <Package className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex items-center text-xs text-blue-500">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>+5</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold">{assignedDeliveries.length}</h3>
                <p className="text-sm text-muted-foreground">Pending Deliveries</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-green-500/20 to-green-500/5 p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-background rounded-full p-2">
                    <CircleDollarSign className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex items-center text-xs text-green-500">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>+₹850</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold">₹{weeklyEarnings}</h3>
                <p className="text-sm text-muted-foreground">Weekly Earnings</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-amber-500/20 to-amber-500/5 p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-background rounded-full p-2">
                    <Navigation className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="flex items-center text-xs text-amber-500">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>+8 km</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold">15 km</h3>
                <p className="text-sm text-muted-foreground">Today's Distance</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Map View */}
      {isMapView && (
        <div className="mb-8">
          <Card className="overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle className="text-xl">Delivery Map</CardTitle>
              <CardDescription>
                View all your assigned delivery locations
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="border rounded-lg bg-slate-50 dark:bg-slate-900 h-[400px] flex items-center justify-center">
                {/* This would be your actual map component */}
                <div className="text-center">
                  <Map className="h-16 w-16 text-muted-foreground opacity-20 mx-auto mb-4" />
                  <p className="font-medium text-lg">Map Integration</p>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    In a real implementation, this would show a map with delivery locations.
                    You could use libraries like Google Maps, Leaflet, or MapBox.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Deliveries List View */}
      <Card>
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Delivery Assignments</CardTitle>
              <CardDescription>Manage your assigned deliveries</CardDescription>
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search deliveries..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex-shrink-0">
                    <Filter className="h-4 w-4 mr-2" />
                    Sort
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortOrder("date-asc")}>
                    Date (Earliest first)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder("date-desc")}>
                    Date (Latest first)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder("customer-asc")}>
                    Customer (A-Z)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder("customer-desc")}>
                    Customer (Z-A)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="assigned" className="relative">
                Assigned
                {assignedDeliveries.length > 0 && (
                  <span className="ml-2 w-5 h-5 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
                    {assignedDeliveries.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            {/* Assigned Deliveries */}
            <TabsContent value="assigned" className="space-y-4">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                {sortedAssignedDeliveries.length > 0 ? (
                  sortedAssignedDeliveries.map((delivery) => (
                    <motion.div 
                      key={delivery.id}
                      variants={itemVariants}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            <div className="md:w-2/3 p-5">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <Badge variant="outline" className="bg-primary/10 mb-2">
                                    {delivery.orderNumber}
                                  </Badge>
                                  <h3 className="font-medium text-lg flex items-center gap-2">
                                    {delivery.customer}
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20">
                                            Priority
                                          </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>This delivery has priority status</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </h3>
                                </div>
                                <Badge variant="secondary">
                                  {new Date(delivery.date).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div className="flex items-start gap-2 text-sm">
                                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                  <span className="text-sm leading-tight">{delivery.address}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span>{delivery.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span>{delivery.date}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span>{delivery.time}</span>
                                </div>
                              </div>

                              <div className="bg-secondary/20 rounded-lg p-3">
                                <div className="text-sm font-medium mb-1">Items ({delivery.items.length})</div>
                                <div className="flex flex-wrap gap-2">
                                  {delivery.items.map((item, idx) => (
                                    <Badge key={idx} variant="outline" className="bg-background">
                                      {item}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <Separator orientation="vertical" className="hidden md:block" />
                            <div className="flex flex-col justify-center gap-3 p-5 md:w-1/3 bg-muted/20 md:bg-transparent">
                              <div className="text-sm font-medium text-center md:text-left">Delivery status</div>
                              {deliveryProgress > 0 && delivery.id === selectedDelivery?.id ? (
                                <div className="space-y-2">
                                  <Progress value={deliveryProgress} className="h-2" />
                                  <p className="text-xs text-center text-muted-foreground">
                                    {deliveryProgress < 100 ? 'Processing...' : 'Completed!'}
                                  </p>
                                </div>
                              ) : (
                                <div className="flex flex-col gap-2">
                                  <Button 
                                    onClick={() => {
                                      setSelectedDelivery(delivery);
                                      markAsDelivered(delivery.id);
                                    }}
                                    className="w-full"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Mark as Delivered
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    className="w-full"
                                    onClick={() => viewDeliveryDetails(delivery)}
                                  >
                                    View Details
                                  </Button>
                                  <Button variant="ghost" size="sm" className="w-full">
                                    Get Directions
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <h3 className="text-lg font-medium mb-1">No assigned deliveries</h3>
                    <p className="text-muted-foreground">
                      {searchQuery ? 'No deliveries match your search criteria' : 'Check back soon for new delivery assignments'}
                    </p>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            {/* Completed Deliveries */}
            <TabsContent value="completed" className="space-y-4">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                {sortedCompletedDeliveries.length > 0 ? (
                  sortedCompletedDeliveries.map((delivery) => (
                    <motion.div 
                      key={delivery.id}
                      variants={itemVariants}
                    >
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <Badge variant="outline" className="bg-secondary/30 mb-2">
                                    {delivery.orderNumber}
                                  </Badge>
                                  <h3 className="font-medium">{delivery.customer}</h3>
                                </div>
                                <Badge variant="success" className="bg-green-500/10 text-green-600 border-green-500/20">
                                  Completed
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex items-start gap-2 text-sm">
                                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                  <span className="text-sm leading-tight">{delivery.address}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span>{delivery.date}</span>
                                </div>
                              </div>
                              <div>
                                <div className="text-sm">
                                  <span className="font-medium">Items: </span>
                                  <span className="text-muted-foreground">{delivery.items.join(", ")}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => viewDeliveryDetails(delivery)}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <h3 className="text-lg font-medium mb-1">No completed deliveries</h3>
                    <p className="text-muted-foreground">
                      {searchQuery ? 'No completed deliveries match your search criteria' : 'Complete an assigned delivery to see it here'}
                    </p>
                  </div>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {activeTab === "assigned" ? sortedAssignedDeliveries.length : sortedCompletedDeliveries.length} deliveries found
          </div>
          <Button variant="ghost" size="sm" className="gap-1">
            View All <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      {/* Delivery Details Dialog */}
      {selectedDelivery && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Delivery Details</DialogTitle>
              <DialogDescription>
                Details for order {selectedDelivery.orderNumber}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-primary/10">
                  {selectedDelivery.orderNumber}
                </Badge>
                <Badge variant={selectedDelivery.status === "completed" ? "success" : "outline"} className={
                  selectedDelivery.status === "completed" ? "bg-green-500/10 text-green-600 border-green-500/20" : ""
                }>
                  {selectedDelivery.status === "completed" ? "Completed" : "Assigned"}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <p className="font-medium">{selectedDelivery.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedDelivery.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{selectedDelivery.date}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{selectedDelivery.address}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Time Window</p>
                  <p className="font-medium">{selectedDelivery.time}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Items</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedDelivery.items.map((item: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="bg-secondary/10">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Mini map preview */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Location</p>
                  <div className="border rounded-lg h-[200px] bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                    <Map className="h-8 w-8 text-muted-foreground opacity-20" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 sm:flex-row justify-end">
              {selectedDelivery.status !== "completed" && (
                <Button 
                  onClick={() => {
                    markAsDelivered(selectedDelivery.id);
                    setShowDetailsDialog(false);
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Delivered
                </Button>
              )}
              <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  )
}
