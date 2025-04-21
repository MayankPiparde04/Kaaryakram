"use client";

import { useState } from "react";
import Image from "next/image";
import { Filter, Search, ShoppingCart } from "lucide-react";

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
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

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

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Shop</h1>

      {/* Mobile Filter Button */}
      <div className="flex md:hidden mb-4">
        <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Price Range</h3>
                  <Slider
                    defaultValue={[0, 10000]}
                    max={10000}
                    step={100}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mb-2"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">₹{priceRange[0]}</span>
                    <span className="text-sm">₹{priceRange[1]}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Categories</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="samagri-mobile"
                        checked={activeTab === "all" || activeTab === "samagri"}
                        onCheckedChange={() =>
                          setActiveTab(
                            activeTab === "samagri" ? "all" : "samagri"
                          )
                        }
                      />
                      <label htmlFor="samagri-mobile" className="text-sm">
                        Samagri
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="pooja-mobile"
                        checked={activeTab === "all" || activeTab === "pooja"}
                        onCheckedChange={() =>
                          setActiveTab(activeTab === "pooja" ? "all" : "pooja")
                        }
                      />
                      <label htmlFor="pooja-mobile" className="text-sm">
                        Pooja Services
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="package-mobile"
                        checked={activeTab === "all" || activeTab === "package"}
                        onCheckedChange={() =>
                          setActiveTab(
                            activeTab === "package" ? "all" : "package"
                          )
                        }
                      />
                      <label htmlFor="package-mobile" className="text-sm">
                        Packages
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Sort By</h3>
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

                <Button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
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
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="samagri">Samagri</TabsTrigger>
          <TabsTrigger value="pooja">Pooja Services</TabsTrigger>
          <TabsTrigger value="package">Packages</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Desktop Sidebar Filters */}
        <div className="hidden md:block w-64 space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Price Range</h3>
            <Slider
              defaultValue={[0, 10000]}
              max={10000}
              step={100}
              value={priceRange}
              onValueChange={setPriceRange}
              className="mb-2"
            />
            <div className="flex items-center justify-between">
              <span className="text-sm">₹{priceRange[0]}</span>
              <span className="text-sm">₹{priceRange[1]}</span>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium mb-2">Categories</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="samagri"
                  checked={activeTab === "all" || activeTab === "samagri"}
                  onCheckedChange={() =>
                    setActiveTab(activeTab === "samagri" ? "all" : "samagri")
                  }
                />
                <label htmlFor="samagri" className="text-sm">
                  Samagri
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pooja"
                  checked={activeTab === "all" || activeTab === "pooja"}
                  onCheckedChange={() =>
                    setActiveTab(activeTab === "pooja" ? "all" : "pooja")
                  }
                />
                <label htmlFor="pooja" className="text-sm">
                  Pooja Services
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="package"
                  checked={activeTab === "all" || activeTab === "package"}
                  onCheckedChange={() =>
                    setActiveTab(activeTab === "package" ? "all" : "package")
                  }
                />
                <label htmlFor="package" className="text-sm">
                  Packages
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No products found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden scale-in">
                  <div className="relative h-48 w-full">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    <Badge
                      className="absolute top-2 right-2"
                      variant="secondary"
                    >
                      {product.category === "samagri"
                        ? "Samagri"
                        : product.category === "pooja"
                        ? "Service"
                        : "Package"}
                    </Badge>
                  </div>
                  <CardHeader className="p-4 pb-0">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="text-sm text-muted-foreground">
                      {product.description}
                    </p>
                    <p className="text-lg font-bold mt-2">₹{product.price}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <Button
                      variant="default"
                      className="w-full"
                      onClick={() => addToCart(product.id, product.name)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
