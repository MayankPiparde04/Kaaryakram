"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/components/cart-context";

// Frequently bought together items
const frequentlyBoughtTogether = [
  {
    id: "recommended-1",
    product: "recommended-1",
    name: "Incense Sticks",
    price: 149,
    image: "/poojaitems/agarbatti.png?height=100&width=100",
    category: "Pooja Items",
  },
  {
    id: "recommended-2",
    product: "recommended-2",
    name: "Cotton Wicks",
    price: 35,
    image: "/poojaitems/cotton-wicks.png?height=100&width=100",
    category: "Pooja Items",
  },
];

// Update Link behavior to prevent reloads
const NoReloadLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <Link href={href} prefetch={true} scroll={false}>
    {children}
  </Link>
);

export default function CartPage() {
  const { toast } = useToast();
  const {
    cart,
    isLoading,
    error,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    applyPromoCode,
    removePromoCode,
    itemCount,
  } = useCart();

  const [promoCode, setPromoCode] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("standard");
  const [cartProgress, setCartProgress] = useState(0);
  
  // Simplified state - no animation tracking
  const [processingItems, setProcessingItems] = useState<Set<string>>(new Set());

  // Memoize calculated values to avoid recalculations
  const cartItems = useMemo(() => cart?.items || [], [cart?.items]);
  const subtotal = useMemo(() => cart?.subtotal || 0, [cart?.subtotal]);
  const discount = useMemo(() => cart?.discount || 0, [cart?.discount]);

  // Calculate proper cart totals manually to ensure values are correct
  const manualSubtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cartItems]);
  
  // Use the calculated subtotal instead of relying on cart.subtotal which might be 0
  const effectiveSubtotal = subtotal > 0 ? subtotal : manualSubtotal;
  
  // Calculate additional values with memoization based on effective subtotal
  const deliveryFee = useMemo(() => deliveryOption === "express" ? 99 : 49, [deliveryOption]);
  const tax = useMemo(() => Math.round(effectiveSubtotal * 0.18), [effectiveSubtotal]); // 18% GST
  const total = useMemo(() => effectiveSubtotal + deliveryFee + tax - discount, 
                        [effectiveSubtotal, deliveryFee, tax, discount]);

  // Progress towards free shipping with debouncing
  useEffect(() => {
    const freeShippingThreshold = 1000;
    const newProgress = Math.min((effectiveSubtotal / freeShippingThreshold) * 100, 100);
    // Only update if it changed significantly (more than 1%)
    if (Math.abs(newProgress - cartProgress) > 1) {
      setCartProgress(newProgress);
    }
  }, [effectiveSubtotal, cartProgress]);

  // Helper function to prevent default form behavior
  const preventDefault = (e: React.MouseEvent | React.FormEvent) => {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Remove item from cart with explicit event prevention
  const handleRemoveFromCart = (productId: string, e?: React.MouseEvent) => {
    preventDefault(e); // Prevent any default behavior
    
    // Call the removeItem function from context
    removeItem(productId).catch((err) => {
      toast({
        title: "Error removing item",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    });
  };

  // Improved quantity change handler
  const handleUpdateQuantity = (productId: string, newQuantity: number, e?: React.MouseEvent) => {
    preventDefault(e); // Prevent default behavior
    
    if (newQuantity < 1) return;

    updateQuantity(productId, newQuantity).catch((err) => {
      toast({
        title: "Error updating cart",
        description: "Failed to update item quantity",
        variant: "destructive",
      });
    });
  };

  // Form submission handler for promo code
  const handleApplyPromoCode = (e?: React.FormEvent) => {
    preventDefault(e);
    if (!promoCode || !cart) return;

    applyPromoCode(promoCode)
      .then(() => {
        toast({
          title: "Promo code applied",
          description: `Discount has been applied to your order!`,
        });
      })
      .catch((err) => {
        toast({
          title: "Invalid promo code",
          description: "Please enter a valid promo code",
          variant: "destructive",
        });
      });
  };

  // Add item to cart - simplified with no loading state
  const handleAddItemToCart = (item: any) => {
    addItem(
      item.product,
      1,
      item.price,
      item.name,
      item.image,
      item.category
    )
      .then(() => {
        toast({
          title: "Item added",
          description: `${item.name} has been added to your cart`,
        });
      })
      .catch((err) => {
        toast({
          title: "Error adding item",
          description: "Failed to add item to cart",
          variant: "destructive",
        });
      });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto py-12 px-4 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your cart...</p>
        </div>
      </div>
    );
  }

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

        <div className="flex flex-col items-center justify-center py-16 text-center">
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
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-12 px-4">
      <div className="flex items-center gap-2 mb-8">
        <NoReloadLink href="/shop">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Continue Shopping
          </Button>
        </NoReloadLink>
        <h1 className="text-2xl md:text-3xl font-bold">Your Cart</h1>
        <Badge variant="secondary" className="ml-2">
          {itemCount} item{itemCount !== 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Free shipping progress - only show when loaded */}
      {!isLoading && cartProgress < 100 && (
        <Card className="mb-8 bg-secondary/10 border-dashed">
          <CardContent className="py-4">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">
                Add ₹{Math.max(0, Math.round(1000 - subtotal))} more for FREE shipping!
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
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.product} className="rounded-lg border bg-card p-4">
                    <div className="flex items-center">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden bg-secondary/20 flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name || "Product"}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="ml-4 flex-grow">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium text-base">
                              {item.name || "Product"}
                            </h3>
                            {item.category && (
                              <Badge
                                variant="outline"
                                className="text-xs mt-1 capitalize"
                              >
                                {item.category}
                              </Badge>
                            )}
                          </div>

                          <div className="text-right">
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center border rounded-md">
                                <Button
                                  type="button" // Explicit button type
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 p-0"
                                  onClick={(e) => handleUpdateQuantity(item.product, item.quantity - 1, e)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>

                                <span className="w-8 text-center text-sm">
                                  {item.quantity}
                                </span>

                                <Button
                                  type="button" // Explicit button type
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 p-0"
                                  onClick={(e) => handleUpdateQuantity(item.product, item.quantity + 1, e)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>

                              <Button
                                type="button" // Explicit button type
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive/90"
                                onClick={(e) => handleRemoveFromCart(item.product, e)}
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
                  </div>
                ))}
              </div>
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
                    <div
                      key={item.id}
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
                        onClick={() => handleAddItemToCart(item)}
                      >
                        Add
                      </Button>
                    </div>
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
                    Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})
                  </span>
                  <span>₹{effectiveSubtotal}</span>
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
                    disabled={!!cart?.promoCode}
                  />
                  <Button
                    variant="outline"
                    onClick={handleApplyPromoCode}
                    disabled={!!cart?.promoCode || !promoCode}
                  >
                    Apply
                  </Button>
                </div>
                {cart?.promoCode && (
                  <div className="flex items-center gap-2 text-xs text-green-600 mt-2">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Code "{cart.promoCode}" applied successfully!</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <NoReloadLink href="/checkout">
                <Button size="lg" className="w-full">
                  Proceed to Checkout
                </Button>
              </NoReloadLink>

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
