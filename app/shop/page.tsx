"use client";

import { useState } from "react";
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
} from "lucide-react";

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

// Sample data for products
const products = [
  {
    id: 1,
    name: "Ghee Diya",
    description: "Pure cow ghee diya for auspicious ceremonies",
    price: 199,
    image: "/poojaitems/ghee.png?height=200&width=200",
    category: "samagri",
  },
  {
    id: 2,
    name: "Kumkum",
    description: "High-quality kumkum for rituals",
    price: 99,
    image: "/poojaitems/kumkum.webp?height=200&width=200",
    category: "samagri",
  },
  {
    id: 3,
    name: "Incense Sticks",
    description: "Fragrant incense sticks for daily prayers",
    price: 149,
    image: "/poojaitems/agarbatti.png?height=200&width=200",
    category: "samagri",
  },
  {
    id: 4,
    name: "Camphor",
    description: "Pure camphor for aarti ceremonies",
    price: 129,
    image: "/poojaitems/kapoor.png?height=200&width=200",
    category: "samagri",
  },
  {
    id: 5,
    name: "Flowers",
    description: "Fresh flowers for offerings",
    price: 249,
    image: "/poojaitems/flowers.webp?height=200&width=200",
    category: "samagri",
  },
  {
    id: 6,
    name: "Coconut",
    description: "Auspicious coconut for rituals",
    price: 79,
    image: "/poojaitems/coconut.webp?height=200&width=200",
    category: "samagri",
  },
  {
    id: 7,
    name: "Betel Leaves",
    description: "Fresh betel leaves used in pooja offerings",
    price: 59,
    image: "/poojaitems/betel-leaf.webp?height=200&width=200",
    category: "samagri",
  },
  {
    id: 8,
    name: "Turmeric",
    description: "Natural haldi powder for sacred rituals",
    price: 49,
    image: "/poojaitems/haldi-powder.png?height=200&width=200",
    category: "samagri",
  },
  {
    id: 9,
    name: "Akshat (Rice)",
    description: "Sacred rice grains for blessings and rituals",
    price: 39,
    image: "/poojaitems/akshat-rice.png?height=200&width=200",
    category: "samagri",
  },
  {
    id: 10,
    name: "Cotton Wicks",
    description: "High-quality cotton wicks for diya lighting",
    price: 35,
    image: "/poojaitems/cotton-wicks.png?height=200&width=200",
    category: "samagri",
  },
  {
    id: 11,
    name: "Dhoopbatti",
    description: "Natural dhoop sticks for spiritual atmosphere",
    price: 89,
    image: "/poojaitems/dhoopbatti.png?height=200&width=200",
    category: "samagri",
  },
  {
    id: 12,
    name: "Sandalwood Powder",
    description: "Premium sandalwood powder for rituals",
    price: 199,
    image: "/poojaitems/sandalwood&powder.png?height=200&width=200",
    category: "samagri",
  },
  {
    id: 13,
    name: "Mala",
    description: "Sacred garlands for worship and offerings",
    price: 149,
    image: "/poojaitems/mala.png?height=200&width=200",
    category: "samagri",
  },
  {
    id: 14,
    name: "Diya",
    description: "Clay diya for lighting and sacred offerings",
    price: 29,
    image: "/poojaitems/diya.png?height=200&width=200",
    category: "samagri",
  },
  {
    id: 15,
    name: "Satyanarayan Pooja",
    description: "Complete pooja service to worship Lord Vishnu",
    price: 5999,
    image: "/poojas/Satyanarayan_pooja.png?height=200&width=200",
    category: "pooja",
  },
  {
    id: 16,
    name: "Griha Pravesh",
    description: "Housewarming ritual with all traditional procedures",
    price: 7999,
    image: "/poojas/Griha-pravesh.png?height=200&width=200",
    category: "pooja",
  },
  {
    id: 17,
    name: "Ganesh Pooja",
    description: "Ritual to seek Lord Ganesha’s blessings",
    price: 4999,
    image: "/poojas/Ganesh-Pooja.png?height=200&width=200",
    category: "pooja",
  },
  {
    id: 18,
    name: "Lakshmi Pooja",
    description: "Pooja to invoke wealth and prosperity blessings",
    price: 6499,
    image: "/poojas/Lakshmi_pooja.png?height=200&width=200",
    category: "pooja",
  },
  {
    id: 19,
    name: "Navagraha Pooja",
    description: "Ritual to appease all nine planetary deities",
    price: 8999,
    image: "/poojas/Navagraha_pooja.png?height=200&width=200",
    category: "pooja",
  },
  {
    id: 20,
    name: "Rudrabhishek",
    description: "Pooja of Lord Shiva with Rudra chanting",
    price: 7499,
    image: "/poojas/Rudra_Abhishek.png?height=200&width=200",
    category: "pooja",
  },
  {
    id: 21,
    name: "Durga Pooja",
    description: "Worship of Goddess Durga for strength and protection",
    price: 7999,
    image: "/poojas/Durga_pooja.png?height=200&width=200",
    category: "pooja",
  },
];

export default function ShopPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortOption, setSortOption] = useState("featured");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [isGridView, setIsGridView] = useState(true);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Filter products based on active tab, search query, and price range
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

  const addToCart = (productId: number, productName: string) => {
    toast({
      title: "Added to cart",
      description: `${productName} has been added to your cart.`,
    });
  };

  // Toggle product in wishlist
  const toggleWishlist = (productId: number, productName: string) => {
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
  const openQuickView = (product: any) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

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

        {/* Product Grid */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {sortedProducts.length === 0 ? (
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
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 p-0"
                      >
                        2
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 p-0"
                      >
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
