import Link from "next/link";
import Image from "next/image";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

// Sample data for pooja items
const poojaItems = [
  {
    id: 1,
    name: "Ghee Diya",
    image: "/poojaitems/ghee.png?height=100&width=100",
  },
  {
    id: 2,
    name: "Kumkum",
    image: "/poojaitems/kumkum.webp?height=100&width=100",
  },
  {
    id: 3,
    name: "Incense Sticks",
    image: "/poojaitems/agarbatti.png?height=100&width=100",
  },
  {
    id: 4,
    name: "Camphor",
    image: "/poojaitems/kapoor.png?height=100&width=100",
  },
  {
    id: 5,
    name: "Flowers",
    image: "/poojaitems/flowers.webp?height=100&width=100",
  },
  {
    id: 6,
    name: "Coconut",
    image: "/poojaitems/coconut.webp?height=100&width=100",
  },
  {
    id: 7,
    name: "Betel Leaves",
    image: "/poojaitems/betel-leaf.webp?height=100&width=100",
  },
  {
    id: 8,
    name: "Turmeric",
    image: "/poojaitems/haldi-powder.png?height=100&width=100",
  },
  {
    id: 9,
    name: "Akshat (Rice)",
    image: "/poojaitems/akshat-rice.png?height=100&width=100",
  },
  {
    id: 10,
    name: "Cotton Wicks",
    image: "/poojaitems/cotton-wicks.png?height=100&width=100",
  },
  {
    id: 11,
    name: "Dhoopbatti",
    image: "/poojaitems/dhoopbatti.png?height=100&width=100",
  },
  {
    id: 12,
    name: "Sandalwood Powder",
    image: "/poojaitems/sandalwood&powder.png?height=100&width=100",
  },
  {
    id: 13,
    name: "Mala",
    image: "/poojaitems/mala.png?height=100&width=100",
  },
  {
    id: 14,
    name: "Diya",
    image: "/poojaitems/diya.png?height=100&width=100",
  },
];

// Sample data for pooja types
const poojaTypes = [
  {
    id: 1,
    name: "Satyanarayan Pooja",
    description: "A ritual performed to seek blessings from Lord Vishnu.",
    image: "/poojas/Satyanarayan_pooja.png?height=200&width=300",
    items: ["Ghee Diya", "Kumkum", "Incense Sticks", "Flowers", "Coconut"],
  },
  {
    id: 2,
    name: "Griha Pravesh",
    description: "A housewarming ceremony to bless a new home.",
    image: "/poojas/Griha-pravesh.png?height=200&width=300",
    items: ["Ghee Diya", "Kumkum", "Turmeric", "Coconut", "Betel Leaves"],
  },
  {
    id: 3,
    name: "Ganesh Pooja",
    description: "A ceremony to honor Lord Ganesha, the remover of obstacles.",
    image: "/poojas/Ganesh-Pooja.png?height=200&width=300",
    items: ["Ghee Diya", "Kumkum", "Incense Sticks", "Flowers", "Modak"],
  },
  {
    id: 4,
    name: "Lakshmi Pooja",
    description:
      "A ritual to seek blessings from Goddess Lakshmi for wealth and prosperity.",
    image: "/poojas/Lakshmi_pooja.png?height=200&width=300",
    items: [
      "Ghee Diya",
      "Lotus Flowers",
      "Rice Grains",
      "Lakshmi Idol",
      "Sweets",
    ],
  },
  {
    id: 5,
    name: "Navagraha Pooja",
    description:
      "A ritual to pacify the nine planetary deities and seek balance in life.",
    image: "/poojas/Navagraha_pooja.png?height=200&width=300",
    items: ["Navadhanya", "Ghee Diya", "Kumkum", "Flowers", "Betel Leaves"],
  },
  {
    id: 6,
    name: "Rudra Abhishek",
    description:
      "A powerful pooja dedicated to Lord Shiva for peace and protection.",
    image: "/poojas/Rudra_Abhishek.png?height=200&width=300",
    items: ["Milk", "Honey", "Bilva Leaves", "Ghee Diya", "Sandalwood Paste"],
  },
  {
    id: 7,
    name: "Durga Pooja",
    description:
      "A worship ritual to honor Goddess Durga and seek her divine strength.",
    image: "/poojas/Durga_pooja.png?height=200&width=300",
    items: ["Red Cloth", "Kumkum", "Coconut", "Flowers", "Incense Sticks"],
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-secondary/50 to-background py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Left Rotating Image */}
            <div className="hidden md:flex justify-center">
              <div className="relative w-64 h-64">
                <Image
                  src="/rtflower.png?height=300&width=300"
                  alt="Decorative pattern"
                  width={250}
                  height={250}
                  className="rotating-image-left absolute top-0 left-0 rounded-full"
                />
              </div>
            </div>

            {/* Center Content */}
            <div className="text-center space-y-4 md:col-span-1">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter fade-in">
                Kaaryakram
              </h1>
              <p className="text-xl text-muted-foreground max-w-[600px] mx-auto fade-in">
                Your complete platform for authentic poojas, quality samagri,
                and experienced pandits.
              </p>
            </div>

            {/* Right Rotating Image */}
            <div className="hidden md:flex justify-center">
              <div className="relative w-64 h-64">
                <Image
                  src="/rtflower.png?height=300&width=300"
                  alt="Decorative pattern"
                  width={250}
                  height={250}
                  className="rotating-image-right absolute top-0 right-0 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Search Card */}
          <div className="mt-12 max-w-3xl mx-auto scale-in">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Enter your location"
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Search className="h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Search for poojas, samagri, or services"
                      className="flex-1"
                    />
                  </div>
                  <Button className="w-full">Search</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pooja Items Section */}
      <section className="py-12 bg-background">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            Popular Samagri
          </h2>
          <div className="relative">
            <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide ">
              {poojaItems.map((item) => (
                <div
                  key={item.id}
                  className="flex-none w-32 slide-in"
                >
                  <div className="rounded-lg overflow-hidden bg-secondary/30 aspect-square my-2 hover:scale-105 transition-transform duration-200 hover:shadow-lg">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover "
                    />
                  </div>
                  <h3 className="text-sm font-medium text-center">
                    {item.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link href="/shop">
              <Button variant="outline">View All Samagri</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pooja Types Section */}
      <section className="py-12 bg-secondary/20">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            Popular Poojas
          </h2>
          <div className="relative">
            <div className="flex overflow-x-auto pb-4 space-x-6 scrollbar-hide">
              {poojaTypes.map((pooja) => (
                <div key={pooja.id} className="flex-none w-80 slide-in my-2  overflow-hidden hover:rounded-t-lg">
                  <Card>
                    <CardContent className="p-0">
                      <div className="relative h-48 w-full">
                        <Image
                          src={pooja.image || "/placeholder.svg"}
                          alt={pooja.name}
                          fill
                          className="object-cover rounded-t-lg hover:scale-105 transition-transform duration-200 hover:shadow-lg"
                        />
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="text-lg font-bold">{pooja.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {pooja.description}
                        </p>
                        <div>
                          <h4 className="text-xs font-medium mb-1">
                            Includes:
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {pooja.items.map((item, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-secondary px-2 py-0.5 rounded-full"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Button variant="outline" className="w-full mt-2">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link href="/shop?category=poojas">
              <Button variant="outline">View All Poojas</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/10">
        <div className="container px-4 md:px-6 text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">
              Ready to start your spiritual journey?
            </h2>
            <p className="text-muted-foreground">
              Join thousands of devotees who have enhanced their spiritual
              practices with Kaaryakram.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/register">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
