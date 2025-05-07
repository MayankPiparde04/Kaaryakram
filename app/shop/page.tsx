"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  Search,
  ShoppingCart,
  Heart,
  X,
  ArrowRight,
  Eye,
  ChevronRight,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { z } from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define schemas for validation with flexibility
const productSchema = z
  .object({
    _id: z.string().optional(),
    id: z.union([z.string(), z.number()]).optional(),
    name: z.string(),
    description: z.string().optional().default("No description available"),
    price: z.number(),
    imageUrl: z.string().optional(),
    category: z.string().optional().default("samagri"),
  })
  .transform((data) => {
    return {
      ...data,
      id: data.id || data._id || Math.random().toString(36).substring(2),
      image: data.imageUrl || "/placeholder.svg",
      category: data.category || "samagri",
    };
  });

const poojaSchema = z
  .object({
    id: z.union([z.string(), z.number()]).optional(),
    _id: z.string().optional(),
    name: z.string(),
    description: z.string().optional().default("No description available"),
    price: z.number().optional().default(0),
    images: z.array(z.string()).optional(),
    category: z.string().optional().default("pooja"),
  })
  .transform((data) => {
    return {
      ...data,
      id: data.id || data._id || Math.random().toString(36).substring(2),
      image: (data.images ?? [])[0] || "/placeholder.svg",
      category: data.category || "pooja",
    };
  });

type Product = z.infer<typeof productSchema>;

export default function ShopPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortOption, setSortOption] = useState("featured");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isGridView, setIsGridView] = useState(true);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Add loading and error states
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Move fetch logic into useEffect
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch both product and pooja data
        const [productsResponse, poojasResponse] = await Promise.all([
          axios.get("/api/products"),
          axios.get("/api/poojas"),
        ]);

        // Process and validate each product
        const validProducts: Product[] = [];

        // Process products data
        if (Array.isArray(productsResponse.data)) {
          for (const item of productsResponse.data) {
            try {
              const validatedProduct = productSchema.parse(item);
              
              validProducts.push(validatedProduct);
            } catch (err) {
              console.warn("Invalid product:", item, err);
            }
          }
        }

        // Process poojas data
        if (Array.isArray(poojasResponse.data)) {
          for (const item of poojasResponse.data) {
            try {
              const validatedPooja = poojaSchema.parse(item);
              validProducts.push(validatedPooja);
              console.log(validProducts)
            } catch (err) {
              console.warn("Invalid pooja:", item, err);
            }
          }
        }

        setProducts(validProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array means this runs once on mount

  const filteredProducts = products.filter((product) => {
    // Filter by category tab
    if (activeTab !== "all" && product.category !== activeTab) {
      return false;
    }

    // Filter by search query
    if (
      searchQuery &&
      !product.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filter by price range
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  const addToCart = (productId: string, productName: string) => {
    toast({
      title: "Added to cart",
      description: `${productName} has been added to your cart.`,
    });
  };

  // Toggle product in wishlist
  const toggleWishlist = (productId: string, productName: string) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId));
      toast({
        title: "Removed from wishlist",
        description: `${productName} has been removed from your wishlist.`,
      });
    } else {
      setWishlist([...wishlist, productId]);
      toast({
        title: "Added to wishlist",
        description: `${productName} has been added to your wishlist.`,
      });
    }
  };

  // Open quick view modal
  const openQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  // Loading skeleton for products
  const ProductSkeleton = ({ grid = true }) => (
    <div className={grid ? "" : ""}>
      {grid ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden h-full border">
              <div className="relative h-48 w-full bg-secondary/30 animate-pulse" />
              <CardHeader className="p-4 pb-0">
                <div className="h-6 bg-secondary/30 w-3/4 rounded-md animate-pulse" />
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="h-4 bg-secondary/30 w-full rounded-md animate-pulse mb-2" />
                <div className="h-4 bg-secondary/30 w-5/6 rounded-md animate-pulse mb-2" />
                <div className="h-6 bg-secondary/30 w-1/4 rounded-md animate-pulse mt-4" />
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <div className="h-10 bg-secondary/30 w-full rounded-md animate-pulse" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="overflow-hidden border">
              <div className="flex flex-col sm:flex-row">
                <div className="h-48 sm:h-auto sm:w-48 flex-shrink-0 bg-secondary/30 animate-pulse" />
                <div className="flex flex-col flex-grow p-4">
                  <div className="h-6 bg-secondary/30 w-3/4 rounded-md animate-pulse mb-4" />
                  <div className="h-4 bg-secondary/30 w-full rounded-md animate-pulse mb-2" />
                  <div className="h-4 bg-secondary/30 w-5/6 rounded-md animate-pulse mb-2" />
                  <div className="h-10 bg-secondary/30 w-1/3 rounded-md animate-pulse mt-4" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  // Error display component
  const ErrorDisplay = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="h-24 w-24 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
        <AlertCircle className="h-12 w-12 text-destructive" />
      </div>
      <h3 className="text-xl font-medium mb-2">Failed to load products</h3>
      <p className="text-muted-foreground mb-6">{error}</p>
      <Button
        onClick={() => window.location.reload()}
        className="flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </Button>
    </motion.div>
  );

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href="/shop" className="font-medium">
                Shop
              </BreadcrumbLink>
            </BreadcrumbItem>
            {activeTab !== "all" && (
              <>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink className="capitalize">
                    {activeTab}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Shop</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={isGridView ? "bg-secondary/50" : ""}
            onClick={() => setIsGridView(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="7" height="7" x="3" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="14" rx="1" />
              <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={!isGridView ? "bg-secondary/50" : ""}
            onClick={() => setIsGridView(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" x2="21" y1="6" y2="6" />
              <line x1="3" x2="21" y1="12" y2="12" />
              <line x1="3" x2="21" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="flex md:hidden mb-4">
        <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {(activeTab !== "all" ||
                priceRange[0] > 0 ||
                priceRange[1] < 10000) && (
                <Badge
                  variant="secondary"
                  className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                >
                  !
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader className="mb-6">
              <SheetTitle className="flex justify-between items-center">
                Filters
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setActiveTab("all");
                    setPriceRange([0, 10000]);
                  }}
                >
                  Reset all
                </Button>
              </SheetTitle>
            </SheetHeader>

            <div className="space-y-8 pb-20">
              <div>
                <h3 className="text-sm font-medium mb-4">Price Range</h3>
                <Slider
                  defaultValue={[0, 10000]}
                  max={10000}
                  step={100}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-6"
                />
                <div className="flex items-center justify-between">
                  <div className="border rounded-md px-3 py-1.5">
                    <span className="text-sm">₹{priceRange[0]}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">to</span>
                  <div className="border rounded-md px-3 py-1.5">
                    <span className="text-sm">₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-4">Categories</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="samagri-mobile"
                      checked={activeTab === "all" || activeTab === "samagri"}
                      onCheckedChange={() =>
                        setActiveTab(
                          activeTab === "samagri" ? "all" : "samagri"
                        )
                      }
                    />
                    <label
                      htmlFor="samagri-mobile"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Samagri
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="pooja-mobile"
                      checked={activeTab === "all" || activeTab === "pooja"}
                      onCheckedChange={() =>
                        setActiveTab(activeTab === "pooja" ? "all" : "pooja")
                      }
                    />
                    <label
                      htmlFor="pooja-mobile"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Pooja Services
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="package-mobile"
                      checked={activeTab === "all" || activeTab === "package"}
                      onCheckedChange={() =>
                        setActiveTab(
                          activeTab === "package" ? "all" : "package"
                        )
                      }
                    />
                    <label
                      htmlFor="package-mobile"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Packages
                    </label>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-4">Sort By</h3>
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="name-asc">Name: A to Z</SelectItem>
                    <SelectItem value="name-desc">Name: Z to A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <SheetFooter className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t">
              <SheetClose asChild>
                <Button className="w-full">Apply Filters</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name-asc">Name: A to Z</SelectItem>
              <SelectItem value="name-desc">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="all" className="flex-1 md:flex-none">
            All
          </TabsTrigger>
          <TabsTrigger value="samagri" className="flex-1 md:flex-none">
            Samagri
          </TabsTrigger>
          <TabsTrigger value="pooja" className="flex-1 md:flex-none">
            Pooja Services
          </TabsTrigger>
          <TabsTrigger value="package" className="flex-1 md:flex-none">
            Packages
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Active Filters */}
      {(activeTab !== "all" || priceRange[0] > 0 || priceRange[1] < 10000) && (
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="text-sm font-medium mr-2 flex items-center">
            Active filters:
          </div>

          {activeTab !== "all" && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1.5"
            >
              <span className="capitalize">{activeTab}</span>
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => setActiveTab("all")}
              />
            </Badge>
          )}

          {(priceRange[0] > 0 || priceRange[1] < 10000) && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1.5"
            >
              <span>
                ₹{priceRange[0]} - ₹{priceRange[1]}
              </span>
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => setPriceRange([0, 10000])}
              />
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="text-sm h-8"
            onClick={() => {
              setActiveTab("all");
              setPriceRange([0, 10000]);
            }}
          >
            Clear all
          </Button>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Desktop Sidebar Filters */}
        <div className="hidden md:block w-64 space-y-8">
          <div className="p-6 border rounded-lg shadow-sm bg-card">
            <h3 className="font-medium mb-4">Filters</h3>
            <Separator className="mb-4" />

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-4">Price Range</h3>
                <Slider
                  defaultValue={[0, 10000]}
                  max={10000}
                  step={100}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-6"
                />
                <div className="flex items-center justify-between">
                  <div className="border rounded-md px-2 py-1">
                    <span className="text-sm">₹{priceRange[0]}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">to</span>
                  <div className="border rounded-md px-2 py-1">
                    <span className="text-sm">₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-4">Categories</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="samagri"
                      checked={activeTab === "all" || activeTab === "samagri"}
                      onCheckedChange={() =>
                        setActiveTab(
                          activeTab === "samagri" ? "all" : "samagri"
                        )
                      }
                    />
                    <label
                      htmlFor="samagri"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Samagri
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="pooja"
                      checked={activeTab === "all" || activeTab === "pooja"}
                      onCheckedChange={() =>
                        setActiveTab(activeTab === "pooja" ? "all" : "pooja")
                      }
                    />
                    <label
                      htmlFor="pooja"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Pooja Services
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="package"
                      checked={activeTab === "all" || activeTab === "package"}
                      onCheckedChange={() =>
                        setActiveTab(
                          activeTab === "package" ? "all" : "package"
                        )
                      }
                    />
                    <label
                      htmlFor="package"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Packages
                    </label>
                  </div>
                </div>
              </div>

              <Separator />

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  setActiveTab("all");
                  setPriceRange([0, 10000]);
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Product Grid with Loading and Error States */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center justify-center mb-6">
                  <Loader2 className="h-6 w-6 text-primary animate-spin mr-2" />
                  <span>Loading products...</span>
                </div>
                <ProductSkeleton grid={isGridView} />
              </motion.div>
            ) : error ? (
              <ErrorDisplay />
            ) : sortedProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Search className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search query
                </p>
                <Button
                  onClick={() => {
                    setActiveTab("all");
                    setPriceRange([0, 10000]);
                    setSearchQuery("");
                  }}
                >
                  Reset All Filters
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-sm text-muted-foreground mb-4">
                  Showing {sortedProducts.length}{" "}
                  {sortedProducts.length === 1 ? "product" : "products"}
                </div>

                {isGridView ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="overflow-hidden h-full border hover:border-primary/50 transition-all duration-300 hover:shadow-md group">
                          <div className="relative h-48 w-full">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <Badge
                              className="absolute top-2 left-2 capitalize"
                              variant={
                                product.category === "pooja"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {product.category === "samagri"
                                ? "Samagri"
                                : product.category === "pooja"
                                ? "Service"
                                : "Package"}
                            </Badge>

                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      className="rounded-full h-9 w-9 p-0"
                                      onClick={() => openQuickView(product)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Quick view</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant={
                                        wishlist.includes(product.id)
                                          ? "destructive"
                                          : "secondary"
                                      }
                                      className="rounded-full h-9 w-9 p-0"
                                      onClick={() =>
                                        toggleWishlist(product.id, product.name)
                                      }
                                    >
                                      <Heart
                                        className={`h-4 w-4 ${
                                          wishlist.includes(product.id)
                                            ? "fill-current"
                                            : ""
                                        }`}
                                      />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      {wishlist.includes(product.id)
                                        ? "Remove from wishlist"
                                        : "Add to wishlist"}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                          <CardHeader className="p-4 pb-0">
                            <CardTitle className="text-lg line-clamp-1">
                              {product.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-2 flex-grow">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {product.description}
                            </p>
                            <p className="text-lg font-bold mt-2 text-primary">
                              ₹{product.price}
                            </p>
                          </CardContent>
                          <CardFooter className="p-4 pt-0 flex gap-2">
                            <Button
                              variant="default"
                              className="w-full"
                              onClick={() =>
                                addToCart(product.id, product.name)
                              }
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="overflow-hidden border hover:border-primary/50 transition-all duration-300 hover:shadow-md group">
                          <div className="flex flex-col sm:flex-row">
                            <div className="relative h-48 sm:h-auto sm:w-48 flex-shrink-0">
                              <Image
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                              <Badge
                                className="absolute top-2 left-2 capitalize"
                                variant={
                                  product.category === "pooja"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {product.category}
                              </Badge>
                            </div>
                            <div className="flex flex-col flex-grow p-4">
                              <div className="flex justify-between items-start">
                                <h3 className="text-lg font-bold">
                                  {product.name}
                                </h3>
                                <p className="text-lg font-bold text-primary">
                                  ₹{product.price}
                                </p>
                              </div>
                              <p className="text-sm text-muted-foreground mt-2 flex-grow">
                                {product.description}
                              </p>
                              <div className="flex items-center justify-between mt-4">
                                <Button
                                  onClick={() =>
                                    addToCart(product.id, product.name)
                                  }
                                >
                                  <ShoppingCart className="h-4 w-4 mr-2" />
                                  Add to Cart
                                </Button>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 rounded-full"
                                    onClick={() => openQuickView(product)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 rounded-full"
                                    onClick={() =>
                                      toggleWishlist(product.id, product.name)
                                    }
                                  >
                                    <Heart
                                      className={`h-4 w-4 ${
                                        wishlist.includes(product.id)
                                          ? "fill-current text-destructive"
                                          : ""
                                      }`}
                                    />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {sortedProducts.length > 0 && (
                  <div className="flex items-center justify-center mt-8">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" disabled>
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 p-0 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        1
                      </Button>
                      <Button variant="outline" size="sm" className="w-8 p-0">
                        2
                      </Button>
                      <Button variant="outline" size="sm" className="w-8 p-0">
                        3
                      </Button>
                      <Button variant="outline" size="sm">
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Quick View Dialog */}
      {selectedProduct && (
        <Dialog open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen}>
          <DialogContent className="sm:max-w-[900px]">
            <DialogHeader>
              <DialogTitle>Product Quick View</DialogTitle>
              <DialogDescription>
                View product details quickly without leaving the page
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary/30">
                <Image
                  src={selectedProduct.image || "/placeholder.svg"}
                  alt={selectedProduct.name}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex flex-col space-y-4">
                <Badge className="w-fit capitalize">
                  {selectedProduct.category}
                </Badge>
                <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                <p className="text-2xl font-bold text-primary">
                  ₹{selectedProduct.price}
                </p>

                <Separator />

                <p className="text-muted-foreground">
                  {selectedProduct.description}
                </p>

                <Separator />

                <div className="space-y-4 mt-auto">
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() =>
                        addToCart(selectedProduct.id, selectedProduct.name)
                      }
                      className="flex-1"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant={
                        wishlist.includes(selectedProduct.id)
                          ? "destructive"
                          : "outline"
                      }
                      onClick={() =>
                        toggleWishlist(
                          selectedProduct.id,
                          selectedProduct.name
                        )
                      }
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          wishlist.includes(selectedProduct.id)
                            ? "fill-current"
                            : ""
                        }`}
                      />
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsQuickViewOpen(false)}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
