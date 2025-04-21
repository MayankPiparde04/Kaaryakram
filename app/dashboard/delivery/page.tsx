"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Package, MapPin, Calendar, Clock, CheckCircle, Phone, User, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"

// Sample data for assigned deliveries
const assignedDeliveries = [
  {
    id: 1,
    orderNumber: "ORD-2025-001",
    items: ["Ghee Diya", "Kumkum", "Incense Sticks"],
    customer: "Rahul Sharma",
    phone: "+91 98765 43210",
    address: "123 Devotee Street, Mumbai",
    date: "2025-04-25",
    time: "10:00 AM - 12:00 PM",
    status: "assigned",
  },
  {
    id: 2,
    orderNumber: "ORD-2025-002",
    items: ["Coconut", "Flowers", "Camphor"],
    customer: "Priya Patel",
    phone: "+91 87654 32109",
    address: "456 New Home Avenue, Delhi",
    date: "2025-04-26",
    time: "02:00 PM - 04:00 PM",
    status: "assigned",
  },
  {
    id: 3,
    orderNumber: "ORD-2025-003",
    items: ["Basic Pooja Kit", "Flowers"],
    customer: "Amit Kumar",
    phone: "+91 76543 21098",
    address: "789 Temple Road, Bangalore",
    date: "2025-04-27",
    time: "09:00 AM - 11:00 AM",
    status: "assigned",
  },
]

// Sample data for completed deliveries
const completedDeliveries = [
  {
    id: 4,
    orderNumber: "ORD-2025-004",
    items: ["Premium Pooja Kit"],
    customer: "Sunita Verma",
    phone: "+91 65432 10987",
    address: "321 Prosperity Lane, Chennai",
    date: "2025-04-15",
    time: "11:00 AM - 01:00 PM",
    status: "completed",
  },
  {
    id: 5,
    orderNumber: "ORD-2025-005",
    items: ["Incense Sticks", "Camphor", "Coconut"],
    customer: "Vikram Singh",
    phone: "+91 54321 09876",
    address: "654 Celestial Road, Hyderabad",
    date: "2025-04-10",
    time: "03:00 PM - 05:00 PM",
    status: "completed",
  },
]

export default function DeliveryDashboardPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("assigned")

  // Redirect if not logged in
  if (!user) {
    router.push("/login")
    return null
  }

  // Redirect if not a delivery partner
  if (user.role !== "Delivery") {
    router.push("/")
    return null
  }

  const markAsDelivered = (deliveryId: number) => {
    toast({
      title: "Delivery marked as completed",
      description: "The delivery has been marked as completed successfully.",
    })
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Delivery Partner Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Stats Cards */}
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-3xl font-bold">{assignedDeliveries.length}</h3>
            <p className="text-sm text-muted-foreground">Pending Deliveries</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center mb-2">
              <CheckCircle className="h-6 w-6 text-secondary-foreground" />
            </div>
            <h3 className="text-3xl font-bold">{completedDeliveries.length}</h3>
            <p className="text-sm text-muted-foreground">Completed Deliveries</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-3xl font-bold">15 km</h3>
            <p className="text-sm text-muted-foreground">Today's Distance</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center mb-2">
              <User className="h-6 w-6 text-secondary-foreground" />
            </div>
            <h3 className="text-3xl font-bold">4.8</h3>
            <p className="text-sm text-muted-foreground">Rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Deliveries */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Assignments</CardTitle>
          <CardDescription>Manage your assigned deliveries</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="assigned">Assigned</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="assigned" className="space-y-4">
              {assignedDeliveries.map((delivery) => (
                <Card key={delivery.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-primary/10">
                            {delivery.orderNumber}
                          </Badge>
                        </div>
                        <h3 className="font-medium">{delivery.customer}</h3>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4" />
                          <span>{delivery.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4" />
                          <span>{delivery.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4" />
                          <span>{delivery.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4" />
                          <span>{delivery.time}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Items: </span>
                          <span>{delivery.items.join(", ")}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 justify-end">
                        <Button onClick={() => markAsDelivered(delivery.id)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Delivered
                        </Button>
                        <Button variant="outline">View Details</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {assignedDeliveries.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No assigned deliveries</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="completed" className="space-y-4">
              {completedDeliveries.map((delivery) => (
                <Card key={delivery.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-secondary/30">
                            {delivery.orderNumber}
                          </Badge>
                        </div>
                        <h3 className="font-medium">{delivery.customer}</h3>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4" />
                          <span>{delivery.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4" />
                          <span>{delivery.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4" />
                          <span>{delivery.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4" />
                          <span>{delivery.time}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Items: </span>
                          <span>{delivery.items.join(", ")}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 justify-end">
                        <Button variant="outline">View Details</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {completedDeliveries.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No completed deliveries</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
