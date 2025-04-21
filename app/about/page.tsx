import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="container py-12">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">About Kaaryakram</h1>
            <p className="text-lg text-muted-foreground">
              Connecting devotees with authentic poojas, quality samagri, and experienced pandits for your spiritual
              journey.
            </p>
            <p className="text-muted-foreground">
              Kaaryakram was founded with a vision to make traditional Indian rituals accessible to everyone while
              preserving their authenticity and spiritual significance.
            </p>
            <div className="pt-4">
              <Link href="/register">
                <Button size="lg">Join Our Community</Button>
              </Link>
            </div>
          </div>
          <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
            <Image src="/placeholder.svg?height=400&width=600" alt="About Kaaryakram" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="mb-16 bg-secondary/30 p-8 rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="p-6 space-y-2">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-bold">Preserve Tradition</h3>
              <p className="text-muted-foreground">
                We are committed to preserving the authenticity and spiritual significance of traditional Indian
                rituals.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 space-y-2">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-bold">Connect Communities</h3>
              <p className="text-muted-foreground">
                We aim to connect devotees with experienced pandits and quality service providers across India.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 space-y-2">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-bold">Empower Providers</h3>
              <p className="text-muted-foreground">
                We empower pandits, delivery partners, and darkstore owners with technology to reach more devotees.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                <span className="text-lg font-bold text-primary-foreground">1</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Register & Browse</h3>
                <p className="text-muted-foreground">
                  Create an account and browse our extensive collection of poojas, samagri, and packages.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                <span className="text-lg font-bold text-primary-foreground">2</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Select & Order</h3>
                <p className="text-muted-foreground">
                  Choose the pooja services or items you need and place your order with your preferred date and time.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                <span className="text-lg font-bold text-primary-foreground">3</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Experience</h3>
                <p className="text-muted-foreground">
                  Our verified pandits will perform the pooja at your location, or your items will be delivered to your
                  doorstep.
                </p>
              </div>
            </div>
          </div>
          <div className="relative h-[300px] rounded-lg overflow-hidden">
            <Image
              src="/placeholder.svg?height=300&width=500"
              alt="How Kaaryakram Works"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center">
              <div className="relative h-40 w-40 mx-auto rounded-full overflow-hidden mb-4">
                <Image
                  src={`/placeholder.svg?height=160&width=160&text=Team Member ${i}`}
                  alt={`Team Member ${i}`}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg font-bold">Team Member {i}</h3>
              <p className="text-sm text-muted-foreground">Position</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mb-16 bg-primary/10 p-8 rounded-lg">
        <h2 className="text-3xl font-bold mb-8 text-center">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={`/placeholder.svg?height=48&width=48&text=User ${i}`}
                      alt={`User ${i}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold">User Name {i}</h3>
                    <p className="text-sm text-muted-foreground">Customer</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "Kaaryakram made it so easy to arrange a traditional pooja for my family. The pandit was knowledgeable
                  and the samagri was of excellent quality."
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to start your spiritual journey?</h2>
        <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
          Join thousands of devotees who have enhanced their spiritual practices with Kaaryakram.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/shop">
            <Button variant="outline" size="lg">
              Explore Shop
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
