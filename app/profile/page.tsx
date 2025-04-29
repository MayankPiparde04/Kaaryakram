"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  MapPin,
  CreditCard,
  Bell,
  Settings,
  Clock,
  LogOut,
  CheckCircle2,
  Edit,
  Trash2,
  PlusCircle,
  Package,
  ChevronRight,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";

// Mock data
const userData = {
  name: "Rahul Sharma",
  email: "rahul.sharma@example.com",
  phone: "+91 98765 43210",
  image: "/placeholder.svg?height=100&width=100&text=RS",
  joinDate: "2023-01-15",
};

const addresses = [
  {
    id: 1,
    type: "Home",
    default: true,
    fullName: "Rahul Sharma",
    phone: "+91 98765 43210",
    address: "42 Lotus Garden, Sector 18",
    city: "Noida",
    state: "Uttar Pradesh",
    pincode: "201301",
  },
  {
    id: 2,
    type: "Office",
    default: false,
    fullName: "Rahul Sharma",
    phone: "+91 98765 43210",
    address: "103 Tech Park, Sector 62",
    city: "Noida",
    state: "Uttar Pradesh",
    pincode: "201309",
  },
];

const paymentMethods = [
  {
    id: 1,
    type: "card",
    default: true,
    name: "HDFC Bank Credit Card",
    cardNumber: "•••• •••• •••• 4242",
    expiryDate: "12/25",
  },
  {
    id: 2,
    type: "upi",
    default: false,
    name: "UPI",
    upiId: "rahul@upi",
  },
];

const recentOrders = [
  {
    id: "ORD-7651239",
    date: "2023-05-18",
    total: 3450,
    status: "delivered",
    items: [
      { id: 1, name: "Satyanarayan Pooja Kit", qty: 1 },
      { id: 2, name: "Silver Kalash", qty: 1 },
    ],
    deliveryDate: "2023-05-21",
  },
  {
    id: "ORD-3982156",
    date: "2023-05-20",
    total: 4200,
    status: "shipped",
    items: [
      { id: 1, name: "Navgraha Pooja Kit", qty: 1 },
      { id: 2, name: "Dhoop Stand", qty: 1 },
      { id: 3, name: "Kumkum Set", qty: 1 },
    ],
    deliveryDate: "2023-05-24",
  },
  {
    id: "ORD-1294567",
    date: "2023-05-21",
    total: 1850,
    status: "processing",
    items: [
      { id: 1, name: "Durga Idol", qty: 1 },
      { id: 2, name: "Coconut Set", qty: 1 },
    ],
    deliveryDate: "2023-05-25",
  },
];

// Status utilities
const getStatusColor = (status) => {
  switch (status) {
    case "delivered":
      return "text-green-600 bg-green-50 dark:bg-green-900/20";
    case "shipped":
      return "text-blue-600 bg-blue-50 dark:bg-blue-900/20";
    case "out-for-delivery":
      return "text-amber-600 bg-amber-50 dark:bg-amber-900/20";
    case "processing":
      return "text-purple-600 bg-purple-50 dark:bg-purple-900/20";
    case "cancelled":
      return "text-red-600 bg-red-50 dark:bg-red-900/20";
    default:
      return "text-muted-foreground bg-muted";
  }
};

const getStatusText = (status) => {
  switch (status) {
    case "delivered":
      return "Delivered";
    case "shipped":
      return "Shipped";
    case "out-for-delivery":
      return "Out for Delivery";
    case "processing":
      return "Processing";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [profileData, setProfileData] = useState({ ...userData });
  const { toast } = useToast();

  // Handle profile update
  const handleProfileUpdate = () => {
    setIsEditingProfile(false);
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  // Handle address operations
  const handleAddAddress = () => {
    setIsAddingAddress(false);
    toast({
      title: "Address added",
      description: "Your new address has been added successfully.",
    });
  };

  const handleDeleteAddress = (id) => {
    toast({
      title: "Address removed",
      description: "The address has been removed from your profile.",
      variant: "destructive",
    });
  };

  const handleSetDefaultAddress = (id) => {
    toast({
      title: "Default address updated",
      description: "Your default address has been updated successfully.",
    });
  };

  // Handle payment methods operations
  const handleAddPaymentMethod = () => {
    setIsAddingPayment(false);
    toast({
      title: "Payment method added",
      description: "Your new payment method has been added successfully.",
    });
  };

  const handleDeletePaymentMethod = (id) => {
    toast({
      title: "Payment method removed",
      description: "The payment method has been removed from your profile.",
      variant: "destructive",
    });
  };

  const handleSetDefaultPaymentMethod = (id) => {
    toast({
      title: "Default payment method updated",
      description: "Your default payment method has been updated successfully.",
    });
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
          <h1 className="text-3xl font-bold mb-1">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your account information, addresses, and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* User Profile Summary Card */}
        <Card className="lg:col-span-4">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage src={userData.image} alt={userData.name} />
                <AvatarFallback>{userData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              
              <div className="space-y-1 text-center md:text-left">
                <h2 className="text-2xl font-bold">{userData.name}</h2>
                <p className="text-muted-foreground">{userData.email}</p>
                <p className="text-muted-foreground">{userData.phone}</p>
                <p className="text-sm text-muted-foreground">
                  Member since {format(new Date(userData.joinDate), 'dd MMMM yyyy')}
                </p>
              </div>
              
              <div className="md:ml-auto">
                <Button variant="outline" onClick={() => setIsEditingProfile(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Navigation */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardContent className="p-4">
              <Tabs
                defaultValue="personal"
                orientation="vertical"
                className="w-full"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="w-full flex flex-col h-auto space-y-1">
                  <TabsTrigger value="personal" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    Personal Information
                  </TabsTrigger>
                  <TabsTrigger value="addresses" className="w-full justify-start">
                    <MapPin className="mr-2 h-4 w-4" />
                    Addresses
                  </TabsTrigger>
                  <TabsTrigger value="orders" className="w-full justify-start">
                    <Package className="mr-2 h-4 w-4" />
                    Orders
                  </TabsTrigger>
                  <TabsTrigger value="payments" className="w-full justify-start">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Payment Methods
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="w-full justify-start">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Separator className="my-4" />
              
              <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {/* Personal Information Tab */}
            {activeTab === "personal" && (
              <motion.div
                key="personal"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Personal Information
                    </CardTitle>
                    <CardDescription>
                      Manage your personal details and contact information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      <div>
                        <Label className="text-muted-foreground">Full Name</Label>
                        <p className="font-medium">{profileData.name}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Email Address</Label>
                        <p className="font-medium">{profileData.email}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Phone Number</Label>
                        <p className="font-medium">{profileData.phone}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Member Since</Label>
                        <p className="font-medium">
                          {format(new Date(profileData.joinDate), 'dd MMMM yyyy')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditingProfile(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Information
                    </Button>
                  </CardFooter>
                </Card>

                <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Edit Profile Information</DialogTitle>
                      <DialogDescription>
                        Update your personal details below
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          defaultValue={profileData.name}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email"
                          defaultValue={profileData.email}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          defaultValue={profileData.phone}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleProfileUpdate}>Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </motion.div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <motion.div
                key="addresses"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Manage Addresses
                    </CardTitle>
                    <CardDescription>
                      Add, edit, or remove your delivery addresses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <motion.div 
                          key={address.id}
                          variants={itemVariants}
                          className="border rounded-lg p-4 relative"
                        >
                          <div className="flex justify-between">
                            <div className="flex items-center gap-2">
                              <Badge className={address.default ? "bg-primary" : "bg-secondary"}>
                                {address.type}
                              </Badge>
                              {address.default && (
                                <Badge variant="outline" className="text-primary border-primary">
                                  Default
                                </Badge>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDeleteAddress(address.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="mt-2 space-y-1">
                            <p className="font-medium">{address.fullName}</p>
                            <p>{address.address}</p>
                            <p>{address.city}, {address.state} - {address.pincode}</p>
                            <p>Phone: {address.phone}</p>
                          </div>
                          {!address.default && (
                            <div className="mt-3">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleSetDefaultAddress(address.id)}
                              >
                                Set as Default
                              </Button>
                            </div>
                          )}
                        </motion.div>
                      ))}

                      <Button 
                        variant="outline" 
                        className="w-full border-dashed"
                        onClick={() => setIsAddingAddress(true)}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add New Address
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
                  <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                      <DialogTitle>Add New Address</DialogTitle>
                      <DialogDescription>
                        Enter the details for your new delivery address
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="address-type">Address Type</Label>
                          <Select defaultValue="home">
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="home">Home</SelectItem>
                              <SelectItem value="office">Office</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input id="fullName" placeholder="Enter full name" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" placeholder="Enter phone number" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Street Address</Label>
                        <Textarea id="address" placeholder="Enter your street address" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input id="city" placeholder="Enter city" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input id="state" placeholder="Enter state" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pincode">PIN Code</Label>
                        <Input id="pincode" placeholder="Enter PIN code" />
                      </div>
                      <div className="flex items-center space-x-2 pt-2">
                        <Switch id="set-as-default" />
                        <Label htmlFor="set-as-default">Set as default address</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddingAddress(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddAddress}>Save Address</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </motion.div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <motion.div
                key="orders"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      My Orders
                    </CardTitle>
                    <CardDescription>
                      Track and manage your orders
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <motion.div 
                          key={order.id}
                          variants={itemVariants}
                          className="border rounded-lg overflow-hidden"
                        >
                          <div className="bg-secondary/20 p-4">
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                              <div>
                                <p className="text-sm text-muted-foreground">Order Placed</p>
                                <p className="font-medium">
                                  {format(new Date(order.date), 'dd MMM yyyy')}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Order ID</p>
                                <p className="font-medium">{order.id}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Total</p>
                                <p className="font-medium">₹{order.total}</p>
                              </div>
                              <div>
                                <Badge className={`${getStatusColor(order.status)}`}>
                                  {getStatusText(order.status)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="mb-3">
                              <p className="text-sm text-muted-foreground">Items</p>
                              <ul className="list-disc list-inside">
                                {order.items.map((item) => (
                                  <li key={item.id} className="text-sm">
                                    {item.name} × {item.qty}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            {order.status !== "delivered" && (
                              <div className="flex items-center text-sm text-muted-foreground mb-3">
                                <Truck className="h-3.5 w-3.5 mr-1" />
                                <span>Est. delivery by {format(new Date(order.deliveryDate), 'dd MMM yyyy')}</span>
                              </div>
                            )}
                            <div className="flex gap-3 flex-wrap">
                              <Link href={`/order?id=${order.id}`}>
                                <Button size="sm" variant="outline">
                                  View Details
                                </Button>
                              </Link>
                              <Link href={`/order?id=${order.id}&action=track`}>
                                <Button size="sm" variant="outline">
                                  Track Order
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <Link href="/order" className="flex justify-center mt-6">
                      <Button variant="outline">
                        View All Orders <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Payment Methods Tab */}
            {activeTab === "payments" && (
              <motion.div
                key="payments"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Payment Methods
                    </CardTitle>
                    <CardDescription>
                      Manage your payment options for faster checkout
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                        <motion.div 
                          key={method.id}
                          variants={itemVariants}
                          className="border rounded-lg p-4 relative"
                        >
                          <div className="flex justify-between">
                            <div className="flex items-center gap-2">
                              {method.type === "card" ? (
                                <div className="h-8 w-12 bg-secondary/20 rounded flex items-center justify-center">
                                  <CreditCard className="h-4 w-4" />
                                </div>
                              ) : (
                                <div className="h-8 w-12 bg-secondary/20 rounded flex items-center justify-center">
                                  <Image src="/payment/upi.png" width={16} height={16} alt="UPI" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium">{method.name}</p>
                                {method.type === "card" && (
                                  <p className="text-sm text-muted-foreground">{method.cardNumber}</p>
                                )}
                                {method.type === "upi" && (
                                  <p className="text-sm text-muted-foreground">{method.upiId}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center">
                              {method.default && (
                                <Badge variant="outline" className="mr-2 text-primary border-primary">
                                  Default
                                </Badge>
                              )}
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleDeletePaymentMethod(method.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          {!method.default && (
                            <div className="mt-3">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleSetDefaultPaymentMethod(method.id)}
                              >
                                Set as Default
                              </Button>
                            </div>
                          )}
                        </motion.div>
                      ))}

                      <Button 
                        variant="outline" 
                        className="w-full border-dashed"
                        onClick={() => setIsAddingPayment(true)}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add New Payment Method
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Dialog open={isAddingPayment} onOpenChange={setIsAddingPayment}>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Add Payment Method</DialogTitle>
                      <DialogDescription>
                        Add a new payment method to your account
                      </DialogDescription>
                    </DialogHeader>
                    <Tabs defaultValue="card">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="card">Credit/Debit Card</TabsTrigger>
                        <TabsTrigger value="upi">UPI</TabsTrigger>
                      </TabsList>
                      <TabsContent value="card" className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardName">Name on Card</Label>
                          <Input id="cardName" placeholder="Enter name as on card" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input id="expiryDate" placeholder="MM/YY" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" placeholder="123" />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 pt-2">
                          <Switch id="save-card" />
                          <Label htmlFor="save-card">Set as default payment method</Label>
                        </div>
                      </TabsContent>
                      <TabsContent value="upi" className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="upiId">UPI ID</Label>
                          <Input id="upiId" placeholder="yourname@upi" />
                        </div>
                        <div className="flex items-center space-x-2 pt-2">
                          <Switch id="save-upi" />
                          <Label htmlFor="save-upi">Set as default payment method</Label>
                        </div>
                      </TabsContent>
                    </Tabs>
                    <div className="flex items-center gap-2 pt-4 bg-secondary/10 p-3 rounded-lg text-sm">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      <p>Your payment information is encrypted and secure</p>
                    </div>
                    <DialogFooter className="mt-4">
                      <Button variant="outline" onClick={() => setIsAddingPayment(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddPaymentMethod}>Save Payment Method</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <motion.div
                key="notifications"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-primary" />
                      Notification Preferences
                    </CardTitle>
                    <CardDescription>
                      Manage how and when you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h3 className="font-medium">Email Notifications</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p>Order updates</p>
                              <p className="text-sm text-muted-foreground">
                                Get notifications about your order status
                              </p>
                            </div>
                            <Switch defaultChecked={true} />
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <div>
                              <p>Special offers and discounts</p>
                              <p className="text-sm text-muted-foreground">
                                Receive promotional emails about special offers
                              </p>
                            </div>
                            <Switch defaultChecked={true} />
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <div>
                              <p>Product recommendations</p>
                              <p className="text-sm text-muted-foreground">
                                Get personalized product recommendations
                              </p>
                            </div>
                            <Switch defaultChecked={false} />
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <div>
                              <p>Account activity</p>
                              <p className="text-sm text-muted-foreground">
                                Get notified about account-related activities
                              </p>
                            </div>
                            <Switch defaultChecked={true} />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-medium">SMS Notifications</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p>Order updates</p>
                              <p className="text-sm text-muted-foreground">
                                Receive text messages about your order status
                              </p>
                            </div>
                            <Switch defaultChecked={true} />
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <div>
                              <p>Delivery updates</p>
                              <p className="text-sm text-muted-foreground">
                                Get SMS notifications about delivery status
                              </p>
                            </div>
                            <Switch defaultChecked={true} />
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <div>
                              <p>Special offers</p>
                              <p className="text-sm text-muted-foreground">
                                Receive promotional text messages
                              </p>
                            </div>
                            <Switch defaultChecked={false} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Preferences</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <motion.div
                key="settings"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-primary" />
                      Account Settings
                    </CardTitle>
                    <CardDescription>
                      Manage your account settings and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h3 className="font-medium">Account Security</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p>Password</p>
                              <p className="text-sm text-muted-foreground">
                                Last updated 3 months ago
                              </p>
                            </div>
                            <Button variant="outline" size="sm">Change Password</Button>
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <div>
                              <p>Two-factor authentication</p>
                              <p className="text-sm text-muted-foreground">
                                Add an extra layer of security
                              </p>
                            </div>
                            <Switch defaultChecked={false} />
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <div>
                              <p>Login history</p>
                              <p className="text-sm text-muted-foreground">
                                View your recent login activity
                              </p>
                            </div>
                            <Button variant="ghost" size="sm">View History</Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-medium">Language and Region</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p>Language</p>
                              <p className="text-sm text-muted-foreground">
                                Choose your preferred language
                              </p>
                            </div>
                            <Select defaultValue="en">
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a language" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="hi">Hindi</SelectItem>
                                <SelectItem value="mr">Marathi</SelectItem>
                                <SelectItem value="ta">Tamil</SelectItem>
                                <SelectItem value="te">Telugu</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-medium">Preferences</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p>Darkmode</p>
                              <p className="text-sm text-muted-foreground">
                                Switch between light and dark theme
                              </p>
                            </div>
                            <Switch defaultChecked={false} />
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <div>
                              <p>Show recommended products</p>
                              <p className="text-sm text-muted-foreground">
                                Show product recommendations based on your interests
                              </p>
                            </div>
                            <Switch defaultChecked={true} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Settings</Button>
                  </CardFooter>
                </Card>

                <Card className="mt-6 border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-600">Danger Zone</CardTitle>
                    <CardDescription>
                      Actions here can't be undone
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">Delete Account</p>
                          <p className="text-sm text-muted-foreground">
                            Permanently delete your account and all your data
                          </p>
                        </div>
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
