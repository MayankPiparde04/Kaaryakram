"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Clock, MapPin, CheckCircle } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"

// Sample data for assigned poojas
const assignedPoojas = [
  {
    id: 1,
    name: "Satyanarayan Pooja",
    date: "2025-04-25",
    time: "09:00 AM",
    duration: "3 hours",
    location: "123 Devotee Street, Mumbai",
    customer: "Rahul Sharma",
    phone: "+91 98765 43210",
    status: "upcoming",
  },
  {
    id: 2,
    name: "Griha Pravesh",
    date: "2025-04-27",
    time: "10:30 AM",
    duration: "4 hours",
    location: "456 New Home Avenue, Delhi",
    customer: "Priya Patel",
    phone: "+91 87654 32109",
    status: "upcoming",
  },
  {
    id: 3,
    name: "Ganesh Pooja",
    date: "2025-04-30",
    time: "05:00 PM",
    duration: "2 hours",
    location: "789 Temple Road, Bangalore",
    customer: "Amit Kumar",
    phone: "+91 76543 21098",
    status: "upcoming",
  },
]

// Sample data for completed poojas
const completedPoojas = [
  {
    id: 4,
    name: "Lakshmi Pooja",
    date: "2025-04-15",
    time: "11:00 AM",
    duration: "2 hours",
    location: "321 Prosperity Lane, Chennai",
    customer: "Sunita Verma",
    phone: "+91 65432 10987",
    status: "completed",
  },
  {
    id: 5,
    name: "Navgraha Shanti",
    date: "2025-04-10",
    time: "08:00 AM",
    duration: "3 hours",
    location: "654 Celestial Road, Hyderabad",
    customer: "Vikram Singh",
    phone: "+91 54321 09876",
    status: "completed",
  },
]

// Sample data for panchang
const panchangData = {
  date: "April 21, 2025",
  sunrise: "06:12 AM",
  sunset: "06:45 PM",
  moonrise: "08:30 PM",
  moonset: "07:15 AM",
  tithi: "Shukla Paksha Dwadashi",
  nakshatra: "Uttara Phalguni",
  yoga: "Shubha",
  karana: "Vishti",
  rahu_kaal: "07:30 AM - 09:00 AM",
  yama_gandam: "10:30 AM - 12:00 PM",
  auspicious_time: "10:00 AM - 12:30 PM, 03:30 PM - 05:00 PM",
  inauspicious_time: "01:30 PM - 03:00 PM",
}

export default function PanditDashboardPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [activeTab, setActiveTab] = useState("upcoming")

  // Redirect if not logged in
  if (!user) {
    router.push("/login")
    return null
  }

  // Redirect if not a pandit
  if (user.role !== "Pandit") {
    router.push("/")
    return null
  }

  const markAsCompleted = (poojaId: number) => {
    toast({
      title: "Pooja marked as completed",
      description: "The pooja has been marked as completed successfully.",
    })
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Pandit Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Panchang */}
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Hindu Panchang</CardTitle>
              <CardDescription>{panchangData.date}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Sunrise:</span>
                  <span className="text-sm">{panchangData.sunrise}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Sunset:</span>
                  <span className="text-sm">{panchangData.sunset}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Moonrise:</span>
                  <span className="text-sm">{panchangData.moonrise}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Moonset:</span>
                  <span className="text-sm">{panchangData.moonset}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Tithi:</span>
                  <span className="text-sm">{panchangData.tithi}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Nakshatra:</span>
                  <span className="text-sm">{panchangData.nakshatra}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Yoga:</span>
                  <span className="text-sm">{panchangData.yoga}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Karana:</span>
                  <span className="text-sm">{panchangData.karana}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Rahu Kaal:</span>
                  <span className="text-sm">{panchangData.rahu_kaal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Yama Gandam:</span>
                  <span className="text-sm">{panchangData.yama_gandam}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium block">Auspicious Time:</span>
                  <span className="text-sm block">{panchangData.auspicious_time}</span>
                </div>
                <div>
                  <span className="text-sm font-medium block">Inauspicious Time:</span>
                  <span className="text-sm block">{panchangData.inauspicious_time}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Calendar and Poojas */}
        <div className="md:col-span-2 space-y-6">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
              <CardDescription>View your upcoming poojas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-auto">
                  <CalendarComponent mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-4">{date ? format(date, "MMMM d, yyyy") : "Select a date"}</h3>
                  <div className="space-y-2">
                    {assignedPoojas
                      .filter((pooja) => pooja.date === (date ? format(date, "yyyy-MM-dd") : ""))
                      .map((pooja) => (
                        <div key={pooja.id} className="p-2 border rounded-md">
                          <div className="font-medium">{pooja.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {pooja.time} - {pooja.duration}
                          </div>
                          <div className="text-sm text-muted-foreground">{pooja.location}</div>
                        </div>
                      ))}
                    {assignedPoojas.filter((pooja) => pooja.date === (date ? format(date, "yyyy-MM-dd") : ""))
                      .length === 0 && (
                      <div className="text-sm text-muted-foreground">No poojas scheduled for this date</div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assigned Poojas */}
          <Card>
            <CardHeader>
              <CardTitle>Pooja Assignments</CardTitle>
              <CardDescription>Manage your assigned poojas</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming" className="space-y-4">
                  {assignedPoojas.map((pooja) => (
                    <Card key={pooja.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-primary/10">
                                {pooja.name}
                              </Badge>
                            </div>
                            <h3 className="font-medium">{pooja.customer}</h3>
                            <div className="text-sm text-muted-foreground">{pooja.phone}</div>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4" />
                              <span>{pooja.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4" />
                              <span>
                                {pooja.time} ({pooja.duration})
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4" />
                              <span>{pooja.location}</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 justify-end">
                            <Button onClick={() => markAsCompleted(pooja.id)}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as Completed
                            </Button>
                            <Button variant="outline">View Details</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {assignedPoojas.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No upcoming poojas assigned</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="completed" className="space-y-4">
                  {completedPoojas.map((pooja) => (
                    <Card key={pooja.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-secondary/30">
                                {pooja.name}
                              </Badge>
                            </div>
                            <h3 className="font-medium">{pooja.customer}</h3>
                            <div className="text-sm text-muted-foreground">{pooja.phone}</div>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4" />
                              <span>{pooja.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4" />
                              <span>
                                {pooja.time} ({pooja.duration})
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4" />
                              <span>{pooja.location}</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 justify-end">
                            <Button variant="outline">View Details</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {completedPoojas.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No completed poojas</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
