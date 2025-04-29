"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  Truck,
  Package,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Calendar,
  ChevronDown,
  ArrowUpRight,
  Store,
  MapPin,
  ShoppingBag,
  AlertCircle,
  X,
  ExternalLink,
  Info,
  Star,
  IndianRupee,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

// Mock order data
const orders = [
  {
    id: "ORD-4529871",
    date: "2023-05-10",
    total: 2150,
    status: "delivered",
    estimatedDelivery: "2023-05-14",
    actualDelivery: "2023-05-13",
    trackingId: "KKM-TRK-74529",
    paymentMethod: "Credit Card",
    cardLast4: "4242",
    items: [
      { id: 1, name: "Brass Diya Set", qty: 2, price: 650, image: "/products/brass-diya.jpg" },
      { id: 2, name: "Sandalwood Incense", qty: 1, price: 350, image: "/products/incense.jpg" },
      { id: 3, name: "Ganesh Murti", qty: 1, price: 1150, image: "/products/ganesh-murti.jpg" },
    ],
    address: "42 Lotus Garden, Sector 18, Noida, UP - 201301",
    customer: {
      name: "Rahul Sharma",
      phone: "+91 98765 43210",
      email: "rahul.sharma@example.com"
    },
    timeline: [
      { status: "Order Placed", date: "2023-05-10", completed: true, description: "Your order has been received" },
      { status: "Order Confirmed", date: "2023-05-10", completed: true, description: "Payment confirmed and order verified" },
      { status: "Shipped", date: "2023-05-11", completed: true, description: "Your order has been shipped from our darkstore" },
      { status: "Out for Delivery", date: "2023-05-13", completed: true, description: "Your package is out for delivery" },
      { status: "Delivered", date: "2023-05-13", completed: true, description: "Your package has been delivered" },
    ],
    darkstore: {
      name: "Krishna Temple Store",
      location: "Sector 18, Noida",
      rating: 4.8
    }
  },
  {
    id: "ORD-7651239",
    date: "2023-05-18",
    total: 3450,
    status: "out-for-delivery",
    estimatedDelivery: "2023-05-21",
    trackingId: "KKM-TRK-96442",
    paymentMethod: "UPI",
    upiId: "user@upi",
    items: [
      { id: 1, name: "Satyanarayan Pooja Kit", qty: 1, price: 1850, image: "/products/pooja-kit.jpg" },
      { id: 2, name: "Silver Kalash", qty: 1, price: 1600, image: "/products/kalash.jpg" },
    ],
    address: "78 Divine Apartments, MG Road, Bangalore - 560001",
    customer: {
      name: "Priya Patel",
      phone: "+91 87654 32109",
      email: "priya.patel@example.com"
    },
    timeline: [
      { status: "Order Placed", date: "2023-05-18", completed: true, description: "Your order has been received" },
      { status: "Order Confirmed", date: "2023-05-18", completed: true, description: "Payment confirmed and order verified" },
      { status: "Shipped", date: "2023-05-19", completed: true, description: "Your order has been shipped from our darkstore" },
      { status: "Out for Delivery", date: "2023-05-21", completed: true, description: "Your package is out for delivery" },
      { status: "Delivered", date: "", completed: false, description: "Awaiting delivery" },
    ],
    darkstore: {
      name: "Ganesha Darkstore",
      location: "Koramangala, Bangalore",
      rating: 4.7
    }
  },
  {
    id: "ORD-3982156",
    date: "2023-05-20",
    total: 4200,
    status: "shipped",
    estimatedDelivery: "2023-05-24",
    trackingId: "KKM-TRK-12783",
    paymentMethod: "Cash on Delivery",
    items: [
      { id: 1, name: "Navgraha Pooja Kit", qty: 1, price: 2450, image: "/products/navgraha-kit.jpg" },
      { id: 2, name: "Dhoop Stand", qty: 1, price: 550, image: "/products/dhoop-stand.jpg" },
      { id: 3, name: "Kumkum Set", qty: 1, price: 1200, image: "/products/kumkum-set.jpg" },
    ],
    address: "156 Harmony Heights, Powai, Mumbai - 400076",
    customer: {
      name: "Anil Kumar",
      phone: "+91 76543 21098",
      email: "anil.kumar@example.com"
    },
    timeline: [
      { status: "Order Placed", date: "2023-05-20", completed: true, description: "Your order has been received" },
      { status: "Order Confirmed", date: "2023-05-20", completed: true, description: "Order verified and processing started" },
      { status: "Shipped", date: "2023-05-22", completed: true, description: "Your order has been shipped from our darkstore" },
      { status: "Out for Delivery", date: "", completed: false, description: "Waiting to be dispatched for delivery" },
      { status: "Delivered", date: "", completed: false, description: "Awaiting delivery" },
    ],
    darkstore: {
      name: "Mahalaxmi Darkstore",
      location: "Andheri, Mumbai",
      rating: 4.9
    }
  },
  {
    id: "ORD-1294567",
    date: "2023-05-21",
    total: 1850,
    status: "processing",
    estimatedDelivery: "2023-05-25",
    trackingId: "KKM-TRK-35791",
    paymentMethod: "Wallet",
    items: [
      { id: 1, name: "Durga Idol", qty: 1, price: 1350, image: "/products/durga-idol.jpg" },
      { id: 2, name: "Coconut Set", qty: 1, price: 500, image: "/products/coconut-set.jpg" },
    ],
    address: "23 Divine Valley, Varanasi, UP - 221001",
    customer: {
      name: "Sunita Verma",
      phone: "+91 65432 10987",
      email: "sunita.verma@example.com"
    },
    timeline: [
      { status: "Order Placed", date: "2023-05-21", completed: true, description: "Your order has been received" },
      { status: "Order Confirmed", date: "2023-05-22", completed: true, description: "Payment confirmed and order verified" },
      { status: "Shipped", date: "", completed: false, description: "Your order is being prepared for shipping" },
      { status: "Out for Delivery", date: "", completed: false, description: "Waiting to be dispatched for delivery" },
      { status: "Delivered", date: "", completed: false, description: "Awaiting delivery" },
    ],
    darkstore: {
      name: "Kashi Vishwanath Store",
      location: "Dashashwamedh, Varanasi",
      rating: 4.6
    }
  }
];

// Helper function to get status color
const getStatusColor = (status) => {
  switch(status) {
    case "delivered":
      return "bg-green-500/10 text-green-600 border-green-500/20";
    case "shipped":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    case "out-for-delivery":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case "processing":
      return "bg-purple-500/10 text-purple-600 border-purple-500/20";
    case "cancelled":
      return "bg-red-500/10 text-red-600 border-red-500/20";
    default:
      return "bg-secondary";
  }
};

// Helper function to get friendly status text
const getStatusText = (status) => {
  switch(status) {
    case "out-for-delivery": return "Out for Delivery";
    default: return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

// Calculate progress percentage based on status
const getProgressPercentage = (order) => {
  const totalSteps = order.timeline.length;
  const completedSteps = order.timeline.filter(step => step.completed).length;
  return (completedSteps / totalSteps) * 100;
};

// Component for Order Tracking Modal
const OrderTrackingModal = ({ order, onClose }) => {
    const progressPercentage = getProgressPercentage(order);
    
    return (
        <div className="space-y-6">
            <div className="bg-secondary/10 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Delivery Status</h3>
                    <Badge variant="outline" className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                    </Badge>
                </div>
                
                <Progress value={progressPercentage} className="h-2 mb-2" />
                
                <div className="text-sm flex justify-between">
                    <span>Order Placed</span>
                    <span>Delivered</span>
                </div>
            </div>
            
            {/* Order Timeline */}
            <div className="relative">
                {/* Progress line */}
                <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-secondary/50"></div>
                
                {/* Timeline steps */}
                <div className="space-y-8">
                    {order.timeline.map((step, index) => (
                        <div key={index} className="relative flex gap-4">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center z-10
                                ${step.completed ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                                {step.completed ? (
                                    <CheckCircle className="h-4 w-4" />
                                ) : (
                                    <Clock className="h-4 w-4" />
                                )}
                            </div>
                            <div>
                                <p className="font-medium">{step.status}</p>
                                {step.date ? (
                                    <p className="text-sm text-muted-foreground">
                                        {format(new Date(step.date), 'dd MMMM yyyy')}
                                    </p>
                                ) : (
                                    <p className="text-sm text-muted-foreground">Pending</p>
                                )}
                                <p className="text-sm">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="bg-secondary/10 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                    <Truck className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">Delivery Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground mb-1">Tracking ID</p>
                        <p className="font-semibold">{order.trackingId}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground mb-1">Estimated Delivery</p>
                        <p className="font-semibold">{format(new Date(order.estimatedDelivery), 'dd MMMM yyyy')}</p>
                    </div>
                </div>
                <div className="mt-4">
                    <p className="text-muted-foreground mb-1">Shipping Address</p>
                    <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                        <p>{order.address}</p>
                    </div>
                </div>
            </div>
            {/* <Button variant="outline" onClick={onClose}>
                Close
            </Button> */}
        </div>
    );
};

// Component for Order Details Modal
const OrderDetailsModal = ({ order, onClose }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">{order.id}</h3>
                    <p className="text-sm text-muted-foreground">
                        Placed on {format(new Date(order.date), 'dd MMMM yyyy')}
                    </p>
                </div>
                <Badge variant="outline" className={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                </Badge>
            </div>
            
            <Separator />
            
            {/* Order Items */}
            <div>
                <h3 className="text-base font-medium mb-3">Items ({order.items.length})</h3>
                <div className="space-y-3">
                    {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                            <div className="h-20 w-20 rounded-md bg-secondary/20 relative overflow-hidden">
                                <Image 
                                    src={item.image}
                                    alt={item.name} 
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium">{item.name}</h4>
                                <div className="flex justify-between items-center mt-1 text-sm">
                                    <p>Qty: {item.qty}</p>
                                    <p className="font-semibold">₹{item.price}</p>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Item Subtotal: ₹{item.price * item.qty}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <Separator />
            
            {/* Order Summary */}
            <div className="space-y-2">
                <h3 className="text-base font-medium">Order Summary</h3>
                
                <div className="bg-secondary/10 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between text-sm">
                        <span>Items Subtotal:</span>
                        <span>₹{order.items.reduce((acc, item) => acc + (item.price * item.qty), 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Shipping Fee:</span>
                        <span>₹{order.total - order.items.reduce((acc, item) => acc + (item.price * item.qty), 0)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                        <span>Total:</span>
                        <span>₹{order.total}</span>
                    </div>
                </div>
            </div>
            
            <Separator />
            
            {/* Customer Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-base font-medium mb-2">Customer Information</h3>
                    <div className="space-y-2 text-sm">
                        <p><span className="text-muted-foreground">Name:</span> {order.customer.name}</p>
                        <p><span className="text-muted-foreground">Email:</span> {order.customer.email}</p>
                        <p><span className="text-muted-foreground">Phone:</span> {order.customer.phone}</p>
                    </div>
                </div>
                
                <div>
                    <h3 className="text-base font-medium mb-2">Payment Information</h3>
                    <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{order.paymentMethod}</span>
                    </div>
                    {order.cardLast4 && (
                        <p className="text-xs text-muted-foreground">Card ending in {order.cardLast4}</p>
                    )}
                    {order.upiId && (
                        <p className="text-xs text-muted-foreground">UPI ID: {order.upiId}</p>
                    )}
                </div>
            </div>
            
            <div className="bg-secondary/10 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                    <Store className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">Darkstore Information</h3>
                </div>
                <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-secondary/30 flex items-center justify-center">
                        <Store className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-sm">
                        <p className="font-medium">{order.darkstore.name}</p>
                        <p className="text-muted-foreground">{order.darkstore.location}</p>
                        <div className="flex items-center mt-1">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-4 w-4 ${
                                            i < Math.floor(order.darkstore.rating)
                                                ? "text-yellow-500 fill-current"
                                                : "text-muted-foreground"
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs ml-1 text-muted-foreground">
                                {order.darkstore.rating}/5
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {/* <Button variant="outline" onClick={onClose}>
                Close
            </Button> */}
        </div>
    );
};

export default function OrderPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(orders[1]); // Default to the out-for-delivery order
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [orderForModal, setOrderForModal] = useState(null);
  
  // Filter orders based on search and tab
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === "all") return matchesSearch;
    return order.status === activeTab && matchesSearch;
  });
  
  // Get current active order (for detailed view)
  const activeOrders = orders.filter(order => 
    order.status === "processing" || 
    order.status === "shipped" || 
    order.status === "out-for-delivery"
  );
  
  // Open tracking modal
  const openTrackingModal = (order) => {
    setOrderForModal(order);
    setIsTrackingModalOpen(true);
  };
  
  // Open details modal
  const openDetailsModal = (order) => {
    setOrderForModal(order);
    setIsDetailsModalOpen(true);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
      transition={{ duration: 0.5 }}
      className="container py-8 px-4 max-w-7xl"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your samagri and pooja bookings</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              className="pl-9 w-[200px] md:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setActiveTab("all")}>
                All Orders
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("delivered")}>
                Delivered
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("out-for-delivery")}>
                Out for Delivery
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("shipped")}>
                Shipped
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("processing")}>
                Processing
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Active Order Tracking Section */}
      {activeOrders.length > 0 && (
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="show"
          className="mb-10"
        >
          <Card className="border shadow-sm overflow-hidden">
            <CardHeader className="bg-secondary/20 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Current Order Status</CardTitle>
                <Select 
                  value={selectedOrder.id} 
                  onValueChange={(value) => setSelectedOrder(orders.find(o => o.id === value))}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select order" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeOrders.map((order) => (
                      <SelectItem key={order.id} value={order.id}>
                        {order.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <CardDescription className="flex items-center justify-between">
                <span>Order placed on {format(new Date(selectedOrder.date), 'dd MMMM yyyy')}</span>
                <Badge variant="outline" className={`${getStatusColor(selectedOrder.status)}`}>
                  {getStatusText(selectedOrder.status)}
                </Badge>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Order Number</p>
                    <p className="font-semibold">{selectedOrder.id}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Tracking ID</p>
                    <p className="font-semibold">{selectedOrder.trackingId}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Total Amount</p>
                    <p className="font-semibold">₹{selectedOrder.total}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Estimated Delivery</p>
                    <p className="font-semibold">{format(new Date(selectedOrder.estimatedDelivery), 'dd MMMM yyyy')}</p>
                  </div>
                </div>
                
                <Separator />
                
                {/* Order Timeline */}
                <div>
                  <h3 className="text-lg font-medium mb-6">Delivery Progress</h3>
                  
                  <div className="relative">
                    {/* Progress line */}
                    <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-secondary/50"></div>
                    
                    {/* Timeline steps */}
                    <div className="space-y-8">
                      {selectedOrder.timeline.map((step, index) => (
                        <div key={index} className="relative flex gap-4">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center z-10
                            ${step.completed ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                            {step.completed ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <Clock className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{step.status}</p>
                            {step.date ? (
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(step.date), 'dd MMMM yyyy')}
                              </p>
                            ) : (
                              <p className="text-sm text-muted-foreground">Pending</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Order Items */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Order Items</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="h-16 w-16 rounded-md bg-secondary/20 relative overflow-hidden">
                          <Image 
                            src={item.image}
                            alt={item.name} 
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <div className="flex justify-between items-center mt-1 text-sm">
                            <p>Qty: {item.qty}</p>
                            <p className="font-semibold">₹{item.price}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                {/* Shipping Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Delivery Address</h3>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                      <p>{selectedOrder.address}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Shipping From</h3>
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-secondary/30 flex items-center justify-center">
                        <Store className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">{selectedOrder.darkstore.name}</p>
                        <p className="text-muted-foreground">{selectedOrder.darkstore.location}</p>
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(selectedOrder.darkstore.rating)
                                    ? "text-yellow-500 fill-current"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs ml-1 text-muted-foreground">
                            {selectedOrder.darkstore.rating}/5
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="bg-secondary/10 py-4 flex justify-between">
              <Button variant="outline" size="sm">
                <AlertCircle className="h-4 w-4 mr-2" />
                Report Issue
              </Button>
              <Button variant="outline" size="sm">
                Cancel Order
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
      
      {/* Order History */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Order History</h2>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList className="grid grid-cols-5 w-[400px]">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="out-for-delivery">Delivering</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <motion.div key={order.id} variants={itemVariants}>
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-2/3 p-5">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <Badge variant="outline" className="bg-secondary/20 mb-2">
                                {order.id}
                              </Badge>
                              <p className="text-sm text-muted-foreground">
                                Ordered on {format(new Date(order.date), 'dd MMM yyyy')}
                              </p>
                            </div>
                            <Badge variant="outline" className={getStatusColor(order.status)}>
                              {getStatusText(order.status)}
                            </Badge>
                          </div>
                          
                          <div className="flex gap-3 flex-wrap mb-4">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center gap-2 bg-secondary/10 px-2 py-1 rounded-md">
                                <div className="h-6 w-6 relative rounded-sm overflow-hidden">
                                  <Image 
                                    src={item.image}
                                    alt={item.name} 
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <span className="text-sm">{item.name} × {item.qty}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex items-start gap-2 text-sm">
                            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                            <span className="leading-tight text-muted-foreground">{order.address}</span>
                          </div>
                        </div>
                        
                        <Separator orientation="vertical" className="hidden md:block" />
                        
                        <div className="md:w-1/3 bg-muted/20 md:bg-transparent p-5 flex flex-col justify-center gap-3">
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-center md:text-left">Order total</div>
                            <div className="text-2xl font-bold text-center md:text-left">₹{order.total}</div>
                            {order.status !== "delivered" && order.estimatedDelivery && (
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <Calendar className="h-3.5 w-3.5 mr-1" />
                                <span>Est. delivery by {format(new Date(order.estimatedDelivery), 'dd MMM')}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button onClick={() => openTrackingModal(order)} className="w-full">
                                  <Truck className="h-4 w-4 mr-2" />
                                  Track Order
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Track Order {order.id}</DialogTitle>
                                  <DialogDescription>
                                    Real-time tracking information for your order
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="py-2">
                                  <OrderTrackingModal order={order} onClose={() => setIsTrackingModalOpen(false)} />
                                </div>
                                {/* <DialogFooter className="mt-6">
                                  <Button variant="outline" onClick={() => setIsTrackingModalOpen(false)}>
                                    Close
                                  </Button>
                                </DialogFooter> */}
                              </DialogContent>
                            </Dialog>
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" onClick={() => openDetailsModal(order)} className="w-full">
                                  <Info className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Order Details</DialogTitle>
                                  <DialogDescription>
                                    Detailed information about your order
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="py-2">
                                  <OrderDetailsModal order={order} onClose={() => setIsDetailsModalOpen(false)} />
                                </div>
                                {/* <DialogFooter className="mt-6">
                                  <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>
                                    Close
                                  </Button>
                                </DialogFooter> */}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <motion.div variants={itemVariants} className="text-center py-16">
                <div className="h-32 w-32 rounded-full bg-secondary/30 flex items-center justify-center mb-8 mx-auto">
                  <ShoppingBag className="h-16 w-16 text-muted-foreground opacity-70" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3">No orders found</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                  {searchQuery 
                    ? `No orders matching "${searchQuery}" were found.`
                    : activeTab === "all" 
                      ? "You haven't placed any orders yet."
                      : `You don't have any ${activeTab} orders.`}
                </p>
                {activeTab === "all" && !searchQuery && (
                  <Link href="/shop">
                    <Button>
                      Browse Products
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Create some image files for products in the public folder */}
      {/* These don't appear in the code but are referenced by path */}
      {/* 
        /public/products/brass-diya.jpg
        /public/products/incense.jpg
        /public/products/ganesh-murti.jpg
        /public/products/pooja-kit.jpg
        /public/products/kalash.jpg
        /public/products/navgraha-kit.jpg
        /public/products/dhoop-stand.jpg
        /public/products/kumkum-set.jpg
        /public/products/durga-idol.jpg
        /public/products/coconut-set.jpg
      */}
    </motion.div>
  );
}
