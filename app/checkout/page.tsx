"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useCart } from "@/components/cart-context"; // Add this import for useCart
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
  const [orderDetails, setOrderDetails] = useState(null);
  
  // Form data - MOVED UP before it's used
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
  
  // Get cart data from context
  const { cart, clearCart, isLoading: cartLoading } = useCart();
  
  // Calculate order totals dynamically from cart
  const cartItems = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
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
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate random order number
      const generatedOrderNumber = `KRK${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(generatedOrderNumber);
      
      // Capture all order details for invoice and storage
      const orderData = {
        orderNumber: generatedOrderNumber,
        cartItems,
        subtotal,
        gst,
        deliveryFee,
        total,
        formData,
        deliveryDate,
        date: new Date().toISOString()
      };
      
      // Store order information in local storage
      localStorage.setItem('lastOrder', JSON.stringify(orderData));
      
      // Save order details for invoice generation
      setOrderDetails(orderData);
      
      // Clear the cart after successful order (but keep local reference for invoice)
      await clearCart();
      
      // Set order complete flag to show billing page
      setOrderComplete(true);
      
      // Scroll to top
      window.scrollTo(0, 0);
      
      toast({
        title: "Order Confirmed",
        description: `Your order #${generatedOrderNumber} has been placed successfully.`,
      });
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Error placing order",
        description: "There was an issue processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Only redirect if cart is empty AND there's no completed order
  useEffect(() => {
    // If cart has loaded, is empty, and no order has been completed yet
    if (!cartLoading && (!cart || cart.items.length === 0) && !orderComplete && !orderNumber) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checkout.",
      });
      router.push('/shop'); // Redirect to shop instead of cart
    }
  }, [cart, cartLoading, orderComplete, orderNumber, router, toast]);
  
  // Generate delivery date options on mount
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
              {/* Use saved cart data from orderDetails for consistent invoice */}
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
                  {/* Use saved cart items to ensure they're still visible after cart clearing */}
                  {(orderDetails?.cartItems || cartItems).map((item) => (
                    <div key={item.id || item.product} className="flex items-center gap-3">
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
                  <span>₹{orderDetails?.subtotal || subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span>₹{orderDetails?.gst || gst}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>
                    {(orderDetails?.deliveryFee || deliveryFee) === 0 ? 'FREE' : `₹${orderDetails?.deliveryFee || deliveryFee}`}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>₹{orderDetails?.total || total}</span>
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
                  cartItems: orderDetails?.cartItems || cartItems,
                  subtotal: orderDetails?.subtotal || subtotal,
                  gst: orderDetails?.gst || gst,
                  deliveryFee: orderDetails?.deliveryFee || deliveryFee,
                  total: orderDetails?.total || total,
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

  // Show loading when cart is loading and no order has been completed
  if (cartLoading && !orderComplete) {
    return (
      <div className="container max-w-7xl mx-auto py-12 px-4 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your cart...</p>
        </div>
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
                        min={new Date().toISOString().split("T")[0]} // Disable past dates
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                  <Button 
                    variant="outline" 
                    onClick={goToNextStep}
                    className="flex items-center gap-2"
                  >
                    <ArrowRight className="h-4 w-4" />
                    Continue to Payment
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
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nameOnCard">Name on Card *</Label>
                        <Input 
                          id="nameOnCard" 
                          placeholder="Enter the name on the card"
                          value={formData.nameOnCard}
                          onChange={(e) => updateFormData('nameOnCard', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number *</Label>
                        <Input 
                          id="cardNumber" 
                          placeholder="Enter your card number"
                          value={formData.cardNumber}
                          onChange={(e) => updateFormData('cardNumber', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date *</Label>
                        <Input 
                          id="expiryDate" 
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={(e) => updateFormData('expiryDate', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input 
                          id="cvv" 
                          placeholder="Enter CVV"
                          value={formData.cvv}
                          onChange={(e) => updateFormData('cvv', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id="savePaymentInfo" 
                        checked={formData.savePaymentInfo}
                        onCheckedChange={(checked) => updateFormData('savePaymentInfo', checked)}
                      />
                      <Label htmlFor="savePaymentInfo" className="text-sm text-muted-foreground">
                        Save this payment information for future orders
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={goToPreviousStep} className="flex items-center gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Shipping
                  </Button>
                  
                  <Button 
                    onClick={goToNextStep}
                    className="flex items-center gap-2"
                  >
                    <ArrowRight className="h-4 w-4" />
                    Review Order
                  </Button>
                </div>
              </motion.div>
            )}
            
            {/* Step 3: Order Review */}
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
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      Order Review
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Display saved order details for review */}
                    <div className="space-y-3">
                      {(orderDetails?.cartItems || cartItems).map((item) => (
                        <div key={item.id || item.product} className="flex items-center gap-3">
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
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>₹{orderDetails?.subtotal || subtotal}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">GST (18%)</span>
                        <span>₹{orderDetails?.gst || gst}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Delivery Fee</span>
                        <span>
                          {(orderDetails?.deliveryFee || deliveryFee) === 0 ? 'FREE' : `₹${orderDetails?.deliveryFee || deliveryFee}`}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>₹{orderDetails?.total || total}</span>
                      </div>
                    </div>
                    
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
                    
                    <div>
                      <h3 className="font-medium mb-2">Payment Information</h3>
                      <div className="bg-muted/30 rounded-lg p-4 space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span className="text-muted-foreground">
                            {formData.paymentMethod === "card" ? "Credit/Debit Card" : 
                             formData.paymentMethod === "upi" ? "UPI" : "Cash on Delivery"}
                          </span>
                        </div>
                        {formData.paymentMethod === "card" && (
                          <>
                            <div className="flex items-start gap-2">
                              <span className="text-muted-foreground">
                                Name on Card: {formData.nameOnCard}
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-muted-foreground">
                                Card Number: **** **** **** {formData.cardNumber.slice(-4)}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={goToPreviousStep} className="flex items-center gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Payment
                  </Button>
                  
                  <Button 
                    onClick={handleSubmitOrder}
                    className="flex items-center gap-2"
                    isLoading={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 mr-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4.293 12.293a1 1 0 011.414 0L12 18.586l6.293-6.293a1 1 0 011.414 1.414l-7 7a1 1 0 01-1.414 0l-7-7a1 1 0 010-1.414z"
                          />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        Place Order
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order summary sidebar */}
        <div className="hidden lg:block">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Display saved order details for summary */}
                {(orderDetails?.cartItems || cartItems).map((item) => (
                  <div key={item.id || item.product} className="flex items-center gap-3">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden bg-secondary/20 flex-shrink-0">
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
            </CardContent>
            <CardFooter>
              <div className="w-full flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{orderDetails?.subtotal || subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span>₹{orderDetails?.gst || gst}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>
                    {(orderDetails?.deliveryFee || deliveryFee) === 0 ? 'FREE' : `₹${orderDetails?.deliveryFee || deliveryFee}`}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>₹{orderDetails?.total || total}</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
