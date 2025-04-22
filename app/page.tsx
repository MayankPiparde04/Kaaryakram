"use client";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, ArrowRight, Star, Users, Gift, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
      {/* Hero Section with Motion */}
      <section className="relative bg-gradient-to-b from-secondary/50 to-background py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <Image
            src="/HeroBG/Image2.jpg"
            alt="Background pattern"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Left Rotating Image */}
            <div className="hidden md:flex justify-center">
              <div className="relative w-64 h-64">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 left-0 w-full h-full"
                >
                  <Image
                    src="/rtflower.png?height=300&width=300"
                    alt="Decorative pattern"
                    width={250}
                    height={250}
                    className="rounded-full"
                  />
                </motion.div>
              </div>
            </div>

            {/* Center Content */}
            <div className="text-center space-y-4 md:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
                  Kaaryakram
                </h1>
                <p className="text-xl text-muted-foreground max-w-[600px] mx-auto mt-4">
                  Your complete platform for authentic poojas, quality samagri,
                  and experienced pandits.
                </p>
              </motion.div>
            </div>

            {/* Right Rotating Image */}
            <div className="hidden md:flex justify-center">
              <div className="relative w-64 h-64">
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 right-0 w-full h-full"
                >
                  <Image
                    src="/rtflower.png?height=300&width=300"
                    alt="Decorative pattern"
                    width={250}
                    height={250}
                    className="rounded-full"
                  />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Enhanced Search Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-12 max-w-3xl mx-auto"
          >
            <Card className="border-2 shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 border-b pb-4">
                    <MapPin className="h-5 w-5 text-primary" />
                    <Input
                      placeholder="Enter your location"
                      className="flex-1 focus-visible:ring-primary"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Search className="h-5 w-5 text-primary" />
                    <Input
                      placeholder="Search for poojas, samagri, or services"
                      className="flex-1 focus-visible:ring-primary"
                    />
                  </div>
                  <Button className="w-full text-base font-medium">
                    Search Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-10 bg-background border-y">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center text-center p-4"
            >
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">2000+</h3>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center text-center p-4"
            >
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">500+</h3>
              <p className="text-sm text-muted-foreground">Poojas Completed</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center text-center p-4"
            >
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <Gift className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">1500+</h3>
              <p className="text-sm text-muted-foreground">Samagri Delivered</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center text-center p-4"
            >
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">4.9</h3>
              <p className="text-sm text-muted-foreground">Customer Rating</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Pooja Items Section with Carousel */}
      <section className="py-16 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Popular Samagri
            </h2>
            <Link href="/shop" className="text-primary hover:underline text-sm flex items-center">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {poojaItems.map((item) => (
                <CarouselItem key={item.id} className="basis-1/2 md:basis-1/4 lg:basis-1/6">
                  <motion.div 
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="border-0 shadow-sm overflow-hidden">
                      <div className="rounded-lg overflow-hidden aspect-square bg-secondary/20 p-2">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={100}
                          height={100}
                          className="w-full h-full object-contain hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-3 text-center">
                        <h3 className="font-medium text-sm">{item.name}</h3>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:flex">
              <CarouselPrevious className="-left-12" />
              <CarouselNext className="-right-12" />
            </div>
          </Carousel>
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/shop">
              <Button variant="outline">View All Samagri</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Pooja Types Section with Carousel */}
      <section className="py-16 bg-secondary/10 relative">
        <div className="absolute inset-0 opacity-5 z-0">
          <Image
            src="/HeroBG/Image2.jpg"
            alt="Background pattern"
            fill
            className="object-cover"
          />
        </div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Popular Poojas
            </h2>
            <Link href="/shop?category=poojas" className="text-primary hover:underline text-sm flex items-center">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {poojaTypes.map((pooja) => (
                <CarouselItem key={pooja.id} className="md:basis-1/2 lg:basis-1/3 p-2">
                  <motion.div 
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="overflow-hidden border shadow-md h-full">
                      <div className="relative h-48 w-full overflow-hidden">
                        <Badge className="absolute top-3 right-3 z-10 bg-primary text-primary-foreground">
                          Popular
                        </Badge>
                        <Image
                          src={pooja.image || "/placeholder.svg"}
                          alt={pooja.name}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <CardContent className="p-5">
                        <h3 className="text-xl font-bold mb-2">{pooja.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {pooja.description}
                        </p>
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 text-muted-foreground">
                            Includes:
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {pooja.items.map((item, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-secondary/50 px-2 py-0.5 rounded-full"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="px-5 py-3 border-t bg-secondary/10">
                        <Button variant="default" className="w-full">
                          Book Now
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:flex">
              <CarouselPrevious className="-left-12" />
              <CarouselNext className="-right-12" />
            </div>
          </Carousel>
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/shop?category=poojas">
              <Button variant="outline">View All Poojas</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
              What Our Devotees Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from our community about their experiences with Kaaryakram's services and products
            </p>
          </div>

          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {[
                {
                  name: "Rajan Sharma",
                  avatar: "/testimonials/avatar1.jpg",
                  role: "Regular Customer",
                  testimonial: "The Satyanarayan Pooja organized through Kaaryakram was beautifully done. The pandit was knowledgeable and the samagri provided was of excellent quality.",
                },
                {
                  name: "Priya Patel",
                  avatar: "/testimonials/avatar2.jpg",
                  role: "New Home Owner",
                  testimonial: "We used Kaaryakram for our Griha Pravesh ceremony. Everything from booking to execution was seamless. Would highly recommend their services!",
                },
                {
                  name: "Anil Kumar",
                  avatar: "/testimonials/avatar3.jpg",
                  role: "Regular User",
                  testimonial: "The quality of pooja items is consistently excellent. I've been ordering from Kaaryakram for over a year now and have never been disappointed.",
                },
              ].map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-4">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 * index }}
                  >
                    <Card className="h-full">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar>
                            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                            <AvatarFallback>{testimonial.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{testimonial.name}</h3>
                            <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                          </div>
                        </div>
                        <div className="flex mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                          ))}
                        </div>
                        <p className="text-sm italic">"{testimonial.testimonial}"</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:flex">
              <CarouselPrevious className="-left-12" />
              <CarouselNext className="-right-12" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-primary/10 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <Image
            src="/om-pattern.png"
            alt="Om pattern"
            fill
            className="object-cover"
          />
        </div>
        <div className="container px-4 md:px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl mx-auto text-center space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Ready to start your spiritual journey?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of devotees who have enhanced their spiritual
              practices with Kaaryakram.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/register">
                <Button size="lg" className="font-medium text-base px-8">
                  Get Started
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="font-medium text-base px-8">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
