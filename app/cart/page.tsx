"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Gift,
  Truck,
  Info,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// Mock cart data
const initialCartItems = [
  {
    id: 1,
    name: "Ghee Diya",
    price: 199,
    quantity: 2,
    image: "/poojaitems/ghee.png?height=100&width=100",
    category: "samagri",
    stockRemaining: 15,
  },
  {
    id: 2,
    name: "Kumkum",
    price: 99,
    quantity: 1,
    image: "/poojaitems/kumkum.webp?height=100&width=100",
    category: "samagri",
    stockRemaining: 30,
  },
  {
    id: 3,
    name: "Satyanarayan Pooja",
    price: 5999,
    quantity: 1,
    image: "/poojas/Satyanarayan_pooja.png?height=100&width=100",
    category: "pooja",
    date: "2023-08-15",
    time: "Morning",
  },
  {
    id: 6,
    name: "Coconut",
    price: 79,
    quantity: 3,
    image: "/poojaitems/coconut.webp?height=100&width=100",
    category: "samagri",
    stockRemaining: 42,
  },
];

// Frequently bought together items
const frequentlyBoughtTogether = [
  {
    id: 4,
    name: "Incense Sticks",
    price: 149,
    image: "/poojaitems/agarbatti.png?height=100&width=100",
  },
  {
    id: 5,
    name: "Cotton Wicks",
    price: 35,
    image: "/poojaitems/cotton-wicks.png?height=100&width=100",
  },
];

export default function CartPage() {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [deliveryOption, setDeliveryOption] = useState("standard");
  const [cartProgress, setCartProgress] = useState(0);
  const [isAnimatingRemoval, setIsAnimatingRemoval] = useState<number | null>(
    null
  );

  // Calculate cart totals
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const deliveryFee = deliveryOption === "express" ? 99 : 49;
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + deliveryFee + tax - discount;

  // Progress towards free shipping
  useEffect(() => {
    const freeShippingThreshold = 1000;
    const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
    setCartProgress(progress);
  }, [subtotal]);

  // Handle quantity change
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );

    toast({
      title: "Cart updated",
      description: "Item quantity has been updated",
    });
  };

  // Remove item from cart
  const removeFromCart = (id: number) => {
    setIsAnimatingRemoval(id);

    setTimeout(() => {
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
      setIsAnimatingRemoval(null);

      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
        variant: "destructive",
      });
    }, 300);
  };

  // Apply promo code
  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "first10") {
      const discountAmount = Math.round(subtotal * 0.1); // 10% discount
      setDiscount(discountAmount);
      setAppliedPromo(promoCode);

      toast({
        title: "Promo code applied",
        description: `You saved ₹${discountAmount} with this code!`,
        variant: "default",
      });
    } else {
      toast({
        title: "Invalid promo code",
        description: "Please enter a valid promo code",
        variant: "destructive",
      });
    }
  };

  // Add item to cart
  const addItemToCart = (item: any) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      updateQuantity(item.id, existingItem.quantity + 1);
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);

      toast({
        title: "Item added",
        description: `${item.name} has been added to your cart`,
      });
    }
  };

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
    exit: { opacity: 0, x: -100 },
  };

  // Empty cart view
  if (cartItems.length === 0) {
    return (
      <div className="container max-w-7xl mx-auto py-12 px-4">
        <div className="flex items-center gap-2 mb-8">
          <Link href="/shop">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="h-32 w-32 rounded-full bg-secondary/30 flex items-center justify-center mb-8">
            <ShoppingBag className="h-16 w-16 text-muted-foreground opacity-70" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-3">
            Your cart is empty
          </h1>
          <p className="text-muted-foreground max-w-md mb-8">
            Looks like you haven't added any items to your cart yet. Explore our
            products and find something for your spiritual needs.
          </p>
          <Link href="/shop">
            <Button size="lg" className="gap-2">
              Browse Products
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-12 px-4">
      <div className="flex items-center gap-2 mb-8">
        <Link href="/shop">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Continue Shopping
          </Button>
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold">Your Cart</h1>
        <Badge variant="secondary" className="ml-2">
          {cartItems.length} items
        </Badge>
      </div>

      {/* Free shipping progress */}
      {cartProgress < 100 && (
        <Card className="mb-8 bg-secondary/10 border-dashed">
          <CardContent className="py-4">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">
                Add ₹{Math.max(0, 1000 - subtotal)} more for FREE shipping!
              </p>
            </div>
            <Progress value={cartProgress} className="h-2" />
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>₹0</span>
              <span>₹1000</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Shopping Cart</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      exit="exit"
                      className={`rounded-lg border bg-card p-4 ${
                        isAnimatingRemoval === item.id ? "opacity-50" : ""
                      }`}
                      style={{
                        transition: "all 300ms",
                      }}
                    >
                      <div className="flex items-center">
                        <div className="relative h-16 w-16 rounded-md overflow-hidden bg-secondary/20 flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="ml-4 flex-grow">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium text-base">
                                {item.name}
                              </h3>
                              <Badge
                                variant="outline"
                                className="text-xs mt-1 capitalize"
                              >
                                {item.category}
                              </Badge>

                              {item.category === "pooja" && (
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-muted-foreground">
                                    Date: {item.date} ({item.time})
                                  </span>
                                </div>
                              )}

                              {item.category === "samagri" &&
                                item.stockRemaining < 20 && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <span className="text-xs text-amber-500">
                                      Only {item.stockRemaining} left in stock
                                    </span>
                                  </div>
                                )}
                            </div>

                            <div className="text-right">
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center border rounded-md">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 p-0"
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity - 1)
                                    }
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>

                                  <span className="w-8 text-center text-sm">
                                    {item.quantity}
                                  </span>

                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 p-0"
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity + 1)
                                    }
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:text-destructive/90"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="mt-2 flex justify-end">
                                <span className="font-medium">
                                  ₹{item.price * item.quantity}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </CardContent>
          </Card>

          {/* Frequently bought together */}
          {frequentlyBoughtTogether.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">
                  Frequently Bought Together
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {frequentlyBoughtTogether.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center p-3 rounded-lg border bg-card"
                    >
                      <div className="relative h-12 w-12 rounded-md overflow-hidden bg-secondary/20">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="ml-3 flex-grow">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          ₹{item.price}
                        </p>
                      </div>

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => addItemToCart(item)}
                      >
                        Add
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order summary */}
        <div>
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Subtotal (
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}{" "}
                    items)
                  </span>
                  <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <div className="flex items-center">
                    <span className="text-muted-foreground">Delivery</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 ml-1 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px] text-xs">
                            Standard delivery takes 2-3 business days. Express
                            delivery is same-day or next-day depending on
                            location.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span>₹{deliveryFee}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span>₹{tax}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <div className="flex items-center">
                      <span>Discount</span>
                      <CheckCircle2 className="h-3 w-3 ml-1" />
                    </div>
                    <span>-₹{discount}</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              {/* Delivery options */}
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-3">Delivery Options</h3>
                <RadioGroup
                  value={deliveryOption}
                  onValueChange={setDeliveryOption}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard" className="flex flex-col">
                      <span>Standard Delivery (₹49)</span>
                      <span className="text-xs text-muted-foreground">
                        2-3 business days
                      </span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="express" id="express" />
                    <Label htmlFor="express" className="flex flex-col">
                      <span>Express Delivery (₹99)</span>
                      <span className="text-xs text-muted-foreground">
                        Same day or next day
                      </span>
                    </Label>
                  </div>

                  {subtotal >= 1000 && (
                    <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-md border border-green-100 dark:border-green-900/30 mt-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-xs font-medium text-green-600">
                          Free standard delivery eligible!
                        </span>
                      </div>
                    </div>
                  )}
                </RadioGroup>
              </div>

              {/* Promo code */}
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-3">Promo Code</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={!!appliedPromo}
                  />
                  <Button
                    variant="outline"
                    onClick={applyPromoCode}
                    disabled={!!appliedPromo || !promoCode}
                  >
                    Apply
                  </Button>
                </div>
                {appliedPromo && (
                  <div className="flex items-center gap-2 text-xs text-green-600 mt-2">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Code "{appliedPromo}" applied successfully!</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Link href="/checkout">
                <Button size="lg" className="w-full">
                  Proceed to Checkout
                </Button>
              </Link>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Gift className="h-3 w-3" />
                <span>Gift wrapping available at checkout</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
