"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ChevronLeft,
  CreditCard,
  Check,
  MapPin,
  User,
  Calendar,
  ArrowRight,
  Package,
  Phone,
  Truck,
  Pencil,
  Download,
  CheckCircle2,
  Shield,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Mock cart items data
const cartItems = [
  {
    id: 1,
    name: "Ghee Diya",
    price: 199,
    quantity: 2,
    image: "/poojaitems/ghee.png?height=100&width=100",
    category: "samagri",
  },
  {
    id: 2,
    name: "Kumkum",
    price: 99,
    quantity: 1,
    image: "/poojaitems/kumkum.webp?height=100&width=100",
    category: "samagri",
  },
  {
    id: 3,
    name: "Satyanarayan Pooja",
    price: 5999,
    quantity: 1,
    image: "/poojas/Satyanarayan_pooja.png?height=100&width=100",
    category: "pooja",
  },
  {
    id: 6,
    name: "Coconut",
    price: 79,
    quantity: 3,
    image: "/poojaitems/coconut.webp?height=100&width=100",
    category: "samagri",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Generate Invoice function
const generateAndDownloadInvoice = (orderDetails: any) => {
  try {
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Add company logo/header
    doc.setFontSize(20);
    doc.text("Kaaryakram", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text("Invoice", 105, 30, { align: "center" });
    
    // Add invoice details
    doc.setFontSize(12);
    doc.text(`Invoice Number: ${orderDetails.orderNumber}`, 15, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 45);
    
    // Add customer details
    doc.text("Customer Details:", 15, 55);
    doc.setFontSize(10);
    doc.text(`Name: ${orderDetails.formData.firstName} ${orderDetails.formData.lastName}`, 15, 60);
    doc.text(`Address: ${orderDetails.formData.address}`, 15, 65);
    doc.text(`${orderDetails.formData.city}, ${orderDetails.formData.state} - ${orderDetails.formData.pincode}`, 15, 70);
    doc.text(`Phone: ${orderDetails.formData.phone}`, 15, 75);
    doc.text(`Email: ${orderDetails.formData.email}`, 15, 80);
    
    // Add order items table
    const tableColumn = ["Item", "Quantity", "Price", "Total"];
    const tableRows = [];
    
    orderDetails.cartItems.forEach(item => {
      const itemData = [
        item.name,
        item.quantity,
        `₹${item.price}`,
        `₹${item.price * item.quantity}`
      ];
      tableRows.push(itemData);
    });
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 90,
      theme: 'grid',
      headStyles: { fillColor: [100, 100, 100] }
    });
    
    // Add totals
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text(`Subtotal: ₹${orderDetails.subtotal}`, 140, finalY, { align: "right" });
    doc.text(`GST (18%): ₹${orderDetails.gst}`, 140, finalY + 5, { align: "right" });
    doc.text(`Delivery Fee: ${orderDetails.deliveryFee === 0 ? 'FREE' : `₹${orderDetails.deliveryFee}`}`, 140, finalY + 10, { align: "right" });
    doc.setFontSize(12);
    doc.text(`Total: ₹${orderDetails.total}`, 140, finalY + 20, { align: "right" });
    
    // Add payment info
    doc.setFontSize(10);
    doc.text("Payment Information:", 15, finalY + 35);
    doc.text(`Payment Method: ${
      orderDetails.formData.paymentMethod === "card" ? "Credit/Debit Card" :
      orderDetails.formData.paymentMethod === "upi" ? "UPI" :
      "Cash on Delivery"
    }`, 15, finalY + 40);
    
    // Add delivery info
    doc.text("Delivery Information:", 15, finalY + 50);
    doc.text(`Delivery Method: ${
      orderDetails.formData.deliveryMethod === "standard" ? "Standard Delivery" : "Express Delivery"
    }`, 15, finalY + 55);
    doc.text(`Expected Delivery: ${new Date(orderDetails.deliveryDate).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`, 15, finalY + 60);
    
    // Add footer
    doc.setFontSize(10);
    doc.text("Thank you for your purchase!", 105, finalY + 75, { align: "center" });
    doc.text("For any queries, contact support@kaaryakram.com", 105, finalY + 80, { align: "center" });
    
    // Generate PDF file name
    const filename = `kaaryakram-invoice-${orderDetails.orderNumber}.pdf`;
    
    // Download the PDF
    doc.save(filename);
    
    // Show success message
    orderDetails.toast({
      title: "Invoice downloaded",
      description: `Your invoice has been downloaded as ${filename}`,
    });
  } catch (error) {
    console.error("Error generating invoice:", error);
    orderDetails.toast({
      title: "Error downloading invoice",
      description: "There was a problem generating your invoice. Please try again.",
      variant: "destructive",
    });
  }
};

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  
  // Form data
  const [formData, setFormData] = useState({
    // Personal details
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    
    // Address
    address: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
    
    // Delivery preferences
    deliveryMethod: "standard",
    deliveryInstructions: "",
    
    // Payment
    paymentMethod: "card",
    nameOnCard: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    savePaymentInfo: false,
    
    // Billing
    sameAsShipping: true,
    billingAddress: "",
    billingCity: "",
    billingState: "",
    billingPincode: "",
  });
  
  // Calculate order totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const gst = Math.round(subtotal * 0.18); // 18% GST
  const deliveryFee = formData.deliveryMethod === "express" ? 99 : (subtotal >= 1000 ? 0 : 49);
  const total = subtotal + gst + deliveryFee;

  // Update form data
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Go to next step
  const goToNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  // Go to previous step
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Submit order
  const handleSubmitOrder = async () => {
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Generate random order number
      const generatedOrderNumber = `KRK${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(generatedOrderNumber);
      
      setOrderComplete(true);
      setIsLoading(false);
      window.scrollTo(0, 0);
    }, 1500);
  };

  // Generate delivery date options
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Format as YYYY-MM-DD for the input
    const tomorrowFormatted = tomorrow.toISOString().split('T')[0];
    setDeliveryDate(tomorrowFormatted);
  }, []);

  // Order confirmation screen
  if (orderComplete) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold mb-3">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Thank you for your order. We have received your request and will process it shortly.
          </p>
          
          <Card className="mb-8 text-left">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Order Summary</span>
                <Badge variant="outline" className="bg-primary/10 text-primary">Order #{orderNumber}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Delivery Information</h3>
                <div className="bg-muted/30 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-muted-foreground">
                      {formData.firstName} {formData.lastName} ({formData.phone})
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-muted-foreground">
                      {formData.address}, 
                      {formData.apartment && ` ${formData.apartment},`} 
                      {formData.city}, {formData.state} - {formData.pincode}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-muted-foreground">
                      Expected delivery: {new Date(deliveryDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Order Details</h3>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-md overflow-hidden bg-secondary/20 flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span>₹{gst}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => generateAndDownloadInvoice({
                  orderNumber,
                  toast,
                  formData,
                  cartItems,
                  subtotal,
                  gst,
                  deliveryFee,
                  total,
                  deliveryDate
                })}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Invoice
              </Button>
              
              <Link href="/shop">
                <Button>Continue Shopping</Button>
              </Link>
            </CardFooter>
          </Card>
          
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">Any questions about your order?</p>
            <p>Contact our support team at <a href="mailto:support@kaaryakram.com" className="text-primary hover:underline">support@kaaryakram.com</a></p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-12 px-4">
      <div className="flex items-center gap-2 mb-8">
        <Link href="/cart">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Cart
          </Button>
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold">Checkout</h1>
      </div>

      {/* Checkout steps indicator */}
      <div className="mb-8">
        <div className="flex justify-between max-w-3xl mx-auto">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center space-y-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center
                  ${currentStep > step ? "bg-primary text-primary-foreground" : 
                    currentStep === step ? "bg-primary text-primary-foreground" : 
                    "bg-secondary text-secondary-foreground"}`}
              >
                {currentStep > step ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{step}</span>
                )}
              </div>
              <span className={`text-sm hidden sm:block ${currentStep === step ? "font-medium" : "text-muted-foreground"}`}>
                {step === 1 ? "Shipping" : step === 2 ? "Payment" : "Review"}
              </span>
            </div>
          ))}
        </div>
        
        <div className="w-full bg-secondary h-1 mt-5 mb-8 max-w-2xl mx-auto rounded-full overflow-hidden">
          <div 
            className="bg-primary h-full transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main checkout form */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <motion.div
                key="shipping"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
              >
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input 
                          id="firstName" 
                          placeholder="Enter your first name"
                          value={formData.firstName}
                          onChange={(e) => updateFormData('firstName', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input 
                          id="lastName" 
                          placeholder="Enter your last name"
                          value={formData.lastName}
                          onChange={(e) => updateFormData('lastName', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => updateFormData('email', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input 
                          id="phone" 
                          type="tel" 
                          placeholder="Enter your phone number"
                          value={formData.phone}
                          onChange={(e) => updateFormData('phone', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Address *</Label>
                      <Input 
                        id="address" 
                        placeholder="Street address"
                        value={formData.address}
                        onChange={(e) => updateFormData('address', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                      <Input 
                        id="apartment" 
                        placeholder="Apartment, suite, building, floor, etc."
                        value={formData.apartment}
                        onChange={(e) => updateFormData('apartment', e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input 
                          id="city" 
                          placeholder="Enter your city"
                          value={formData.city}
                          onChange={(e) => updateFormData('city', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Select
                          value={formData.state}
                          onValueChange={(value) => updateFormData('state', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                            <SelectItem value="delhi">Delhi</SelectItem>
                            <SelectItem value="gujarat">Gujarat</SelectItem>
                            <SelectItem value="karnataka">Karnataka</SelectItem>
                            <SelectItem value="maharashtra">Maharashtra</SelectItem>
                            <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                            <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                            {/* Add more states as needed */}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">PIN Code *</Label>
                      <Input 
                        id="pincode" 
                        placeholder="Enter PIN code"
                        value={formData.pincode}
                        onChange={(e) => updateFormData('pincode', e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-primary" />
                      Delivery Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup
                      value={formData.deliveryMethod}
                      onValueChange={(value) => updateFormData('deliveryMethod', value)}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-2 rounded-lg border p-3">
                        <RadioGroupItem value="standard" id="standard" />
                        <div className="flex-1">
                          <Label htmlFor="standard" className="flex flex-col">
                            <span className="font-medium">Standard Delivery</span>
                            <span className="text-sm text-muted-foreground">
                              {subtotal >= 1000 ? 'FREE' : '₹49'} - Delivery within 2-3 business days
                            </span>
                          </Label>
                        </div>
                        {subtotal >= 1000 && (
                          <Badge variant="outline" className="bg-primary/10 text-primary">FREE</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 rounded-lg border p-3">
                        <RadioGroupItem value="express" id="express" />
                        <div className="flex-1">
                          <Label htmlFor="express" className="flex flex-col">
                            <span className="font-medium">Express Delivery</span>
                            <span className="text-sm text-muted-foreground">
                              ₹99 - Same day or next day delivery
                            </span>
                          </Label>
                        </div>
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500">FAST</Badge>
                      </div>
                    </RadioGroup>

                    <div className="space-y-2">
                      <Label htmlFor="deliveryDate">
                        Preferred Delivery Date *
                        {formData.deliveryMethod === "express" && (
                          <span className="text-xs text-muted-foreground ml-2">
                            (Limited to next 2 days for express delivery)
                          </span>
                        )}
                      </Label>
                      <Input 
                        id="deliveryDate" 
                        type="date"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="deliveryInstructions">Delivery Instructions (optional)</Label>
                      <Textarea 
                        id="deliveryInstructions" 
                        placeholder="Add any special instructions for delivery"
                        value={formData.deliveryInstructions}
                        onChange={(e) => updateFormData('deliveryInstructions', e.target.value)}
                        className="resize-none"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-6 flex justify-end">
                  <Button size="lg" onClick={goToNextStep}>
                    Continue to Payment <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Payment Information */}
            {currentStep === 2 && (
              <motion.div
                key="payment"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
              >
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="card" className="w-full" onValueChange={(value) => updateFormData('paymentMethod', value)}>
                      <TabsList className="grid grid-cols-3 mb-4">
                        <TabsTrigger value="card">Credit / Debit Card</TabsTrigger>
                        <TabsTrigger value="upi">UPI</TabsTrigger>
                        <TabsTrigger value="cod">Cash on Delivery</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="card">
                        <div className="space-y-4 mt-2">
                          <div className="space-y-2">
                            <Label htmlFor="nameOnCard">Name on Card *</Label>
                            <Input 
                              id="nameOnCard" 
                              placeholder="Enter name as on card"
                              value={formData.nameOnCard}
                              onChange={(e) => updateFormData('nameOnCard', e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="cardNumber">Card Number *</Label>
                            <Input 
                              id="cardNumber" 
                              placeholder="1234 5678 9012 3456"
                              value={formData.cardNumber}
                              onChange={(e) => updateFormData('cardNumber', e.target.value)}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="expiryDate">Expiry Date *</Label>
                              <Input 
                                id="expiryDate" 
                                placeholder="MM/YY"
                                value={formData.expiryDate}
                                onChange={(e) => updateFormData('expiryDate', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cvv">CVV *</Label>
                              <Input 
                                id="cvv" 
                                type="password"
                                placeholder="123"
                                maxLength={3}
                                value={formData.cvv}
                                onChange={(e) => updateFormData('cvv', e.target.value)}
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 pt-2">
                            <Checkbox 
                              id="savePaymentInfo" 
                              checked={formData.savePaymentInfo}
                              onCheckedChange={(checked) => updateFormData('savePaymentInfo', !!checked)}
                            />
                            <label
                              htmlFor="savePaymentInfo"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Save payment information for future purchases
                            </label>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-4 text-sm bg-muted p-3 rounded-md">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Your payment information is encrypted and secure.</span>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="upi">
                        <div className="space-y-4 mt-2">
                          <div className="space-y-2">
                            <Label htmlFor="upiId">UPI ID *</Label>
                            <div className="flex gap-2">
                              <Input 
                                id="upiId" 
                                placeholder="name@bank"
                                className="flex-1"
                              />
                              <Button variant="outline" className="shrink-0">
                                Verify UPI
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              You will receive a payment request on your UPI app.
                            </p>
                          </div>
                          
                          <div className="flex flex-wrap gap-3 mt-4">
                            <Badge variant="outline" className="px-4 py-2 flex items-center gap-2">
                              <Image src="/payment/gpay.png" width={20} height={20} alt="Google Pay" />
                              Google Pay
                            </Badge>
                            <Badge variant="outline" className="px-4 py-2 flex items-center gap-2">
                              <Image src="/payment/phonepe.png" width={20} height={20} alt="PhonePe" />
                              PhonePe
                            </Badge>
                            <Badge variant="outline" className="px-4 py-2 flex items-center gap-2">
                              <Image src="/payment/paytm.png" width={20} height={20} alt="Paytm" />
                              Paytm
                            </Badge>
                            <Badge variant="outline" className="px-4 py-2 flex items-center gap-2">
                              <Image src="/payment/bhim.png" width={20} height={20} alt="BHIM UPI" />
                              BHIM
                            </Badge>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="cod">
                        <div className="space-y-4 mt-2">
                          <div className="bg-secondary/30 p-4 rounded-md flex items-start gap-3">
                            <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="space-y-2">
                              <p className="text-sm">
                                Pay with cash when your order is delivered. Our delivery partner will collect the payment at the time of delivery.
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Note: For orders above ₹5000, a pre-authorization fee of ₹500 may be required.
                              </p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Billing Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="sameAsShipping" 
                        checked={formData.sameAsShipping}
                        onCheckedChange={(checked) => updateFormData('sameAsShipping', !!checked)}
                      />
                      <label
                        htmlFor="sameAsShipping"
                        className="text-sm font-medium leading-none"
                      >
                        Same as shipping address
                      </label>
                    </div>
                    
                    <Collapsible 
                      open={!formData.sameAsShipping}
                      className="mt-4"
                    >
                      <CollapsibleContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="billingAddress">Address *</Label>
                          <Input 
                            id="billingAddress" 
                            placeholder="Street address"
                            value={formData.billingAddress}
                            onChange={(e) => updateFormData('billingAddress', e.target.value)}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="billingCity">City *</Label>
                            <Input 
                              id="billingCity" 
                              placeholder="Enter your city"
                              value={formData.billingCity}
                              onChange={(e) => updateFormData('billingCity', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="billingState">State *</Label>
                            <Select
                              value={formData.billingState}
                              onValueChange={(value) => updateFormData('billingState', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                                <SelectItem value="delhi">Delhi</SelectItem>
                                <SelectItem value="gujarat">Gujarat</SelectItem>
                                <SelectItem value="karnataka">Karnataka</SelectItem>
                                <SelectItem value="maharashtra">Maharashtra</SelectItem>
                                <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                                <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                                {/* Add more states as needed */}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="billingPincode">PIN Code *</Label>
                          <Input 
                            id="billingPincode" 
                            placeholder="Enter PIN code"
                            value={formData.billingPincode}
                            onChange={(e) => updateFormData('billingPincode', e.target.value)}
                          />
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                </Card>

                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={goToPreviousStep}>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back to Shipping
                  </Button>
                  <Button size="lg" onClick={goToNextStep}>
                    Review Order <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review Order */}
            {currentStep === 3 && (
              <motion.div
                key="review"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
              >
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Review Your Order</CardTitle>
                    <CardDescription>
                      Please review your order details before proceeding to payment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Personal Information</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setCurrentStep(1)}
                          className="h-8 flex items-center gap-1 text-primary"
                        >
                          <Pencil className="h-3 w-3" /> Edit
                        </Button>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-4 space-y-2 text-sm">
                        <p className="flex gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {formData.firstName} {formData.lastName}
                          </span>
                        </p>
                        <p className="flex gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{formData.phone}</span>
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Shipping Address</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setCurrentStep(1)}
                          className="h-8 flex items-center gap-1 text-primary"
                        >
                          <Pencil className="h-3 w-3" /> Edit
                        </Button>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-4 space-y-1 text-sm">
                        <p>
                          {formData.address}, 
                          {formData.apartment && ` ${formData.apartment},`} 
                        </p>
                        <p>
                          {formData.city}, {formData.state} - {formData.pincode}
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Delivery Information</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setCurrentStep(1)}
                          className="h-8 flex items-center gap-1 text-primary"
                        >
                          <Pencil className="h-3 w-3" /> Edit
                        </Button>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-4 space-y-2 text-sm">
                        <p className="flex gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            Delivery on {new Date(deliveryDate).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </p>
                        <p className="flex gap-2">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {formData.deliveryMethod === "standard" 
                              ? "Standard Delivery (2-3 business days)" 
                              : "Express Delivery (Same/Next day)"
                            }
                          </span>
                        </p>
                        {formData.deliveryInstructions && (
                          <div className="mt-2 border-t border-border pt-2">
                            <p className="text-xs text-muted-foreground">Delivery Instructions:</p>
                            <p className="mt-1">{formData.deliveryInstructions}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Payment Method</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setCurrentStep(2)}
                          className="h-8 flex items-center gap-1 text-primary"
                        >
                          <Pencil className="h-3 w-3" /> Edit
                        </Button>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-4 text-sm">
                        {formData.paymentMethod === "card" && (
                          <div className="flex gap-2 items-center">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <span>
                              Credit/Debit Card ending in {formData.cardNumber.slice(-4)}
                            </span>
                          </div>
                        )}
                        {formData.paymentMethod === "upi" && (
                          <div className="flex gap-2 items-center">
                            <Image src="/payment/upi.png" width={16} height={16} alt="UPI" />
                            <span>UPI Payment</span>
                          </div>
                        )}
                        {formData.paymentMethod === "cod" && (
                          <div className="flex gap-2 items-center">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span>Cash on Delivery</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-3">Order Items</h3>
                      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                        {cartItems.map((item) => (
                          <motion.div
                            key={item.id}
                            variants={itemVariants}
                            className="flex items-center gap-3"
                          >
                            <div className="relative h-16 w-16 rounded-md overflow-hidden bg-secondary/20 flex-shrink-0">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-grow">
                              <p className="font-medium">{item.name}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs font-normal capitalize">
                                  {item.category}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  Quantity: {item.quantity}
                                </span>
                              </div>
                            </div>
                            <p className="font-medium">₹{item.price * item.quantity}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={goToPreviousStep}>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back to Payment
                  </Button>
                  <Button size="lg" onClick={handleSubmitOrder} disabled={isLoading}>
                    {isLoading ? (
                      <>Processing...</>
                    ) : (
                      <>Place Order <ArrowRight className="ml-2 h-4 w-4" /></>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader className="pb-2">
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span>
                      {item.name} <span className="text-muted-foreground">× {item.quantity}</span>
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span>₹{gst}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
              
              {currentStep === 3 && (
                <div className="mt-6">
                  <div className="bg-muted/30 p-4 rounded-lg space-y-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">You're almost there!</p>
                        <p className="text-xs text-muted-foreground">Review your order and place it</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">100% Secure Payment</p>
                        <p className="text-xs text-muted-foreground">Your data is protected</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            
            {(currentStep === 1 || currentStep === 2) && (
              <CardFooter className="flex-col space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 w-full">
                  <Truck className="h-4 w-4" />
                  <span>Free delivery on orders above ₹1000</span>
                </div>
                <div className="flex items-center gap-2 w-full">
                  <Shield className="h-4 w-4" />
                  <span>Secure checkout powered by trusted partners</span>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 w-full cursor-help">
                        <Package className="h-4 w-4" />
                        <span className="underline underline-offset-2">Satisfaction guaranteed</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs">
                        Not satisfied? Contact us within 7 days of your purchase and we'll make it right.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
