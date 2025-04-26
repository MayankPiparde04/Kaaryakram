"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { 
  Heart, 
  Users, 
  Sparkles, 
  Scroll,
  CheckCircle,
  Package,
  Calendar,
  Star
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function AboutPage() {
  const teamMembers = [
    {
      id: 1,
      name: "Mayank Piparde",
      position: "Full-stack Developer",
      image: "/Mayank.jpg",
    },
    {
      id: 2,
      name: "Parth Gupta",
      position: "Full-stack Developer",
      image: "/Parth.png",
    },
    {
      id: 3,
      name: "Naman Shah",
      position: "Research and Documentation",
      image: "/Naman.jpg",
    },
    {
      id: 4,
      name: "Nitya Maheshwari",
      position: "Design and Diagram",
      image: "/Nitya.jpg",
    },
  ];
  const userReviews = [
    {
      id: 1,
      name: "Ravi Kumar",
      position: "Customer",
      image: "/placeholder.svg?height=48&width=48&text=User+1",
      review:
        '"Kaaryakram made my Griha Pravesh ceremony a seamless experience. The pandit was knowledgeable, and the items provided were authentic and of great quality. Highly recommended for anyone looking to host a pooja."',
    },
    {
      id: 2,
      name: "Priya Sharma",
      position: "Customer",
      image: "/placeholder.svg?height=48&width=48&text=User+2",
      review:
        '"The Ganesh Pooja kit was exactly what we needed for our family celebration. Everything from the Ghee Diya to the Modaks was perfect. It felt like a traditional pooja at home, thanks to Kaaryakram."',
    },
    {
      id: 3,
      name: "Amit Desai",
      position: "Customer",
      image: "/placeholder.svg?height=48&width=48&text=User+3",
      review:
        '"We used Kaaryakram for our wedding\'s Satyanarayan Pooja, and it exceeded our expectations. The pandit was professional, and the service was well-organized. The entire experience was spiritual and enriching."',
    },
    {
      id: 4,
      name: "Suman Gupta",
      position: "Customer",
      image: "/placeholder.svg?height=48&width=48&text=User+4",
      review:
        '"I recently ordered the Lakshmi Pooja package, and it was just perfect for Diwali. The items were of high quality, and the pandit\'s guidance made the ceremony smooth and memorable. I will definitely use Kaaryakram again!"',
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="container py-12 space-y-24">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-radial from-secondary/30 to-transparent rounded-3xl opacity-30 -z-10"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100px" }}
                transition={{ duration: 0.8 }}
                className="h-1.5 bg-primary rounded mb-6"
              ></motion.div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                About Kaaryakram
              </h1>
              <p className="text-xl text-muted-foreground mb-4">
                Connecting devotees with authentic poojas, quality samagri, and
                experienced pandits for your spiritual journey.
              </p>
              <p className="text-muted-foreground">
                Kaaryakram was founded with a vision to make traditional Indian
                rituals accessible to everyone while preserving their authenticity
                and spiritual significance.
              </p>
            </div>
            <div className="pt-4 space-x-4">
              <Link href="/register">
                <Button size="lg" className="text-base font-medium">Join Our Community</Button>
              </Link>
              <Link href="/shop">
                <Button size="lg" variant="outline" className="text-base font-medium">Browse Services</Button>
              </Link>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-[300px] md:h-[450px] rounded-2xl overflow-hidden shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
            <Image
              src="https://images.pexels.com/photos/5490978/pexels-photo-5490978.jpeg"
              alt="About Kaaryakram"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-6 left-6 z-20 right-6">
              <p className="text-white text-lg font-medium">
                "Preserving traditions, embracing spirituality"
              </p>
            </div>
          </motion.div>
        </div>
      </section>


      {/* Our Mission */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-transparent rounded-3xl -z-10"></div>
        <div className="py-12 px-8 rounded-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 max-w-2xl mx-auto space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold">Our Mission</h2>
            <p className="text-muted-foreground">
              At Kaaryakram, we're dedicated to preserving traditions while making spiritual practices accessible to everyone.
            </p>
          </motion.div>
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={item}>
              <Card className="border-none shadow-md h-full bg-background/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 space-y-4">
                  <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Preserve Tradition</h3>
                  <p className="text-muted-foreground">
                    We are committed to preserving the authenticity and spiritual
                    significance of traditional Indian rituals.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={item}>
              <Card className="border-none shadow-md h-full bg-background/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 space-y-4">
                  <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Connect Communities</h3>
                  <p className="text-muted-foreground">
                    We aim to connect devotees with experienced pandits and quality
                    service providers across India.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={item}>
              <Card className="border-none shadow-md h-full bg-background/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 space-y-4">
                  <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Empower Providers</h3>
                  <p className="text-muted-foreground">
                    We empower pandits, delivery partners, and darkstore owners with
                    technology to reach more devotees.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground">
            Experience the convenience of traditional rituals in just a few simple steps
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex gap-6"
            >
              <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg">
                <Scroll className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Register & Browse</h3>
                <p className="text-muted-foreground">
                  Create an account and browse our extensive collection of
                  poojas, samagri, and packages tailored to your needs.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex gap-6"
            >
              <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg">
                <CheckCircle className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Select & Order</h3>
                <p className="text-muted-foreground">
                  Choose the pooja services or items you need and place your
                  order with your preferred date and time for delivery or service.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex gap-6"
            >
              <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg">
                <Package className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Experience</h3>
                <p className="text-muted-foreground">
                  Our verified pandits will perform the pooja at your location,
                  or your items will be delivered to your doorstep with care and precision.
                </p>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
            <Image
              src="/about.png"
              alt="How Kaaryakram Works"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-6 left-6 right-6 z-20">
              <p className="text-white text-lg font-medium">
                "Seamless experience from start to finish"
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Mentor */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Mentor</h2>
          <p className="text-muted-foreground">
            The guiding force behind our project, providing expertise and direction
          </p>
        </motion.div>
        
        <div className="flex justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-lg"
          >
            <Card className="bg-secondary/10 shadow-md border-none overflow-hidden text-center hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative h-52 w-52 mx-auto rounded-full overflow-hidden mb-6 shadow-lg border-4 border-primary/20"
                >
                  <Image
                    src="/mentor-placeholder.jpg" /* Replace with actual mentor image */
                    alt="Project Mentor"
                    fill
                    className="object-cover"
                  />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">Prof. Anurag Punde</h3> {/* Replace with actual mentor name */}
                <p className="text-primary font-medium mb-3">Project Mentor</p>
                <p className="text-muted-foreground mb-5">
                  With over 13 years of experience in software engineering and project management, 
                  our mentor provides invaluable guidance and expertise to ensure the success of Kaaryakram.
                </p>
                <div className="flex justify-center space-x-3">
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Our Team */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-muted-foreground">
            The passionate individuals behind Kaaryakram working to preserve and promote our cultural traditions
          </p>
        </motion.div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
        >
          {teamMembers.map(({ id, name, position, image }) => (
            <motion.div key={id} variants={item}>
              <Card className="bg-secondary/5 border-none overflow-hidden text-center hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative h-48 w-48 mx-auto rounded-full overflow-hidden mb-6 shadow-lg"
                  >
                    <Image
                      src={image}
                      alt={`Team Member ${name}`}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-1">{name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{position}</p>
                  <div className="flex justify-center space-x-3">
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-muted-foreground">
            Hear from our community about their experiences with Kaaryakram
          </p>
        </motion.div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {userReviews.map(({ id, name, position, review, image }) => (
              <CarouselItem key={id} className="md:basis-1/2 lg:basis-1/3 p-2">
                <motion.div 
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="h-full shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-6">
                        <Avatar className="h-12 w-12 mr-4 border-2 border-primary/20">
                          <AvatarImage src={image} alt={`User ${name}`} />
                          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold">{name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {position}
                          </p>
                        </div>
                      </div>
                      <div className="flex mb-4 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-muted-foreground italic">{review}</p>
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
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 -z-10"></div>
        <div className="py-16 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to start your spiritual journey?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of devotees who have enhanced their spiritual practices
              with Kaaryakram.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <Link href="/register">
                <Button size="lg" className="text-base font-medium px-8">Get Started</Button>
              </Link>
              <Link href="/shop">
                <Button variant="outline" size="lg" className="text-base font-medium px-8">
                  Explore Shop
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
