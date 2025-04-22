"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  CheckCircle, 
  Phone, 
  Search, 
  Sun, 
  Moon, 
  Star, 
  Filter, 
  User, 
  BookOpen, 
  TrendingUp, 
  ArrowUpRight,
  PieChart,
  MoreVertical,
  FileText,
  ChevronDown
} from "lucide-react"
import { format, addDays } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"
import { Progress } from "@/components/ui/progress"

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
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPooja, setSelectedPooja] = useState<any>(null)
  const [showPoojaDetails, setShowPoojaDetails] = useState(false)
  const [completionProgress, setCompletionProgress] = useState(0)
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined)
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false)

  // if (!user){
  //   router.push("/login")
  //   return null
  // }

  // // Redirect if not a pandit
  // if (user.role !== "Pandit") {
  //   router.push("/")
  //   return null
  // }

  // Filter poojas based on search query
  const filteredUpcomingPoojas = assignedPoojas.filter(pooja => 
    pooja.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pooja.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pooja.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCompletedPoojas = completedPoojas.filter(pooja => 
    pooja.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pooja.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pooja.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Generate upcoming schedule for next 7 days
  const nextWeekSchedule = Array(7).fill(0).map((_, i) => {
    const day = addDays(new Date(), i);
    const dayName = format(day, "EEE");
    const dayNumber = format(day, "d");
    const count = assignedPoojas.filter(pooja => 
      pooja.date === format(day, "yyyy-MM-dd")
    ).length;
    
    return { day, dayName, dayNumber, count };
  });

  const markAsCompleted = (poojaId: number) => {
    // Simulate progress
    setCompletionProgress(0);
    setSelectedPooja(assignedPoojas.find(p => p.id === poojaId));
    
    const interval = setInterval(() => {
      setCompletionProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Show toast after progress is complete
          toast({
            title: "Pooja marked as completed",
            description: "The pooja has been marked as completed successfully.",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  }

  const viewPoojaDetails = (pooja: any) => {
    setSelectedPooja(pooja);
    setShowPoojaDetails(true);
  }

  // Calculate stats
  const todaysRituals = assignedPoojas.filter(pooja => 
    pooja.date === format(new Date(), "yyyy-MM-dd")
  ).length;
  
  const weeklyBookings = assignedPoojas.length;
  const monthlyEarnings = 25000; // This would be calculated from actual data in a real app

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container py-8 px-4 max-w-7xl"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Pandit Dashboard</h1>
          <p className="text-muted-foreground">Manage your rituals and ceremonies</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary">
                  <AvatarImage src="/avatar-placeholder.png" />
                  <AvatarFallback>PN</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-bold text-xl">{user?.name || "Pandit Ji"}</h2>
                  <p className="text-muted-foreground text-sm">Vedic Rituals Specialist</p>
                </div>
              </div>
              <Separator orientation="vertical" className="h-12 hidden md:block" />
              <div className="flex items-center gap-6 flex-wrap justify-center md:justify-start">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Star className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Rating</p>
                    <p className="font-medium">4.9/5</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Ceremonies</p>
                    <p className="font-medium">{completedPoojas.length} completed</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Experience</p>
                    <p className="font-medium">15+ years</p>
                  </div>
                </div>
              </div>
              <div className="ml-auto hidden md:block">
                <Button size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-background rounded-full p-2">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex items-center text-xs text-primary">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>+2</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold">{todaysRituals}</h3>
                <p className="text-sm text-muted-foreground">Today's Rituals</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-blue-500/20 to-blue-500/5 p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-background rounded-full p-2">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex items-center text-xs text-blue-500">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>+5</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold">{weeklyBookings}</h3>
                <p className="text-sm text-muted-foreground">Weekly Bookings</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-green-500/20 to-green-500/5 p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-background rounded-full p-2">
                    <PieChart className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex items-center text-xs text-green-500">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>+12%</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold">₹{monthlyEarnings}</h3>
                <p className="text-sm text-muted-foreground">Monthly Earnings</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Panchang */}
        <Card className="lg:col-span-1 overflow-hidden">
          <CardHeader className="pb-3 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/5 z-0"></div>
            <div className="relative z-10 flex items-center gap-2">
              <Sun className="h-5 w-5 text-amber-500" />
              <CardTitle>Hindu Panchang</CardTitle>
            </div>
            <CardDescription className="relative z-10">{panchangData.date}</CardDescription>
          </CardHeader>
          <CardContent className="px-6">
            <div className="relative py-4">
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-secondary/30 -translate-x-1/2"></div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card shadow-sm rounded-lg border p-4 relative z-10 mb-6"
              >
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                  <Sun className="h-4 w-4 text-yellow-500" />
                  Celestial Positions
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Sunrise:</span>
                      <Badge variant="outline" className="font-normal">{panchangData.sunrise}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Sunset:</span>
                      <Badge variant="outline" className="font-normal">{panchangData.sunset}</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Moonrise:</span>
                      <Badge variant="outline" className="font-normal">{panchangData.moonrise}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Moonset:</span>
                      <Badge variant="outline" className="font-normal">{panchangData.moonset}</Badge>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card shadow-sm rounded-lg border p-4 relative z-10 mb-6"
              >
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                  <Star className="h-4 w-4 text-blue-500" />
                  Astrological Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tithi:</span>
                    <span className="font-medium">{panchangData.tithi}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Nakshatra:</span>
                    <span className="font-medium">{panchangData.nakshatra}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Yoga:</span>
                    <span className="font-medium">{panchangData.yoga}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Karana:</span>
                    <span className="font-medium">{panchangData.karana}</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card shadow-sm rounded-lg border p-4 relative z-10"
              >
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-red-500" />
                  Muhurta Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Rahu Kaal:</span>
                      <Badge variant="outline" className="font-normal bg-red-500/10 text-red-600 border-red-500/20">{panchangData.rahu_kaal}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Yama Gandam:</span>
                      <Badge variant="outline" className="font-normal bg-red-500/10 text-red-600 border-red-500/20">{panchangData.yama_gandam}</Badge>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-1">
                    <div>
                      <span className="text-muted-foreground block mb-1">Auspicious Times:</span>
                      <Badge variant="outline" className="font-normal bg-green-500/10 text-green-600 border-green-500/20 w-full justify-start whitespace-normal text-xs">
                        {panchangData.auspicious_time}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div>
                      <span className="text-muted-foreground block mb-1">Inauspicious Times:</span>
                      <Badge variant="outline" className="font-normal bg-red-500/10 text-red-600 border-red-500/20 w-full justify-start whitespace-normal text-xs">
                        {panchangData.inauspicious_time}
                      </Badge>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </CardContent>
          <CardFooter className="pt-0 pb-4 px-6">
            <Button variant="outline" size="sm" className="w-full">
              View Full Panchang
            </Button>
          </CardFooter>
        </Card>

        {/* Right Column - Calendar and Poojas */}
        <div className="lg:col-span-2 space-y-6">
          {/* Schedule preview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span>Weekly Schedule</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsCalendarExpanded(!isCalendarExpanded)}
                >
                  {isCalendarExpanded ? "View List" : "Expand Calendar"}
                </Button>
              </CardTitle>
              <CardDescription>
                Your upcoming rituals for the next 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isCalendarExpanded ? (
                <div className="flex flex-col gap-4">
                  <Calendar 
                    mode="single" 
                    selected={date} 
                    onSelect={setDate} 
                    className="rounded-md border mx-auto"
                    initialFocus
                  />

                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4 flex items-center justify-between">
                      <span>{date ? format(date, "MMMM d, yyyy") : "Select a date"}</span>
                      <Badge variant="outline" className="font-normal">
                        {assignedPoojas.filter(pooja => pooja.date === (date ? format(date, "yyyy-MM-dd") : "")).length} rituals
                      </Badge>
                    </h3>
                    <div className="space-y-3">
                      {assignedPoojas
                        .filter((pooja) => pooja.date === (date ? format(date, "yyyy-MM-dd") : ""))
                        .map((pooja) => (
                          <div 
                            key={pooja.id} 
                            className="p-3 border rounded-md hover:border-primary/50 transition-colors cursor-pointer"
                            onClick={() => viewPoojaDetails(pooja)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="font-medium">{pooja.name}</div>
                              <Badge>{pooja.time}</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {pooja.customer} • {pooja.duration}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{pooja.location}</span>
                            </div>
                          </div>
                        ))}
                      {assignedPoojas.filter((pooja) => pooja.date === (date ? format(date, "yyyy-MM-dd") : ""))
                        .length === 0 && (
                        <div className="text-center py-6">
                          <CalendarIcon className="h-12 w-12 text-muted-foreground opacity-20 mx-auto mb-3" />
                          <div className="font-medium">No rituals scheduled</div>
                          <div className="text-sm text-muted-foreground">
                            You have no rituals scheduled for this date
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Weekly days strip */}
                  <div className="flex items-center justify-between">
                    {nextWeekSchedule.map((day, i) => (
                      <motion.button
                        key={i}
                        className={`relative flex flex-col items-center justify-center p-2 rounded-lg w-12 ${
                          format(day.day, "yyyy-MM-dd") === format(date || new Date(), "yyyy-MM-dd") 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-secondary/40"
                        }`}
                        onClick={() => setDate(day.day)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="text-xs font-medium">{day.dayName}</span>
                        <span className="text-lg font-bold">{day.dayNumber}</span>
                        {day.count > 0 && (
                          <span className="absolute -bottom-1 -right-1 flex items-center justify-center bg-primary text-[10px] text-primary-foreground w-4 h-4 rounded-full">
                            {day.count}
                          </span>
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Day's schedule */}
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4">{date ? format(date, "MMMM d, yyyy") : "Today"}</h3>
                    <div className="space-y-3">
                      {assignedPoojas
                        .filter((pooja) => pooja.date === (date ? format(date, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")))
                        .map((pooja) => (
                          <div 
                            key={pooja.id} 
                            className="p-3 border rounded-md bg-secondary/10 hover:bg-secondary/20 transition-colors cursor-pointer"
                            onClick={() => viewPoojaDetails(pooja)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="font-medium">{pooja.name}</div>
                              <Badge variant="outline" className="bg-primary/10">
                                {pooja.time}
                              </Badge>
                            </div>
                            <div className="text-sm mt-1">
                              {pooja.duration} • {pooja.customer}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{pooja.location}</span>
                            </div>
                          </div>
                        ))}
                      {assignedPoojas.filter((pooja) => pooja.date === (date ? format(date, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")))
                        .length === 0 && (
                        <div className="text-center py-6">
                          <CalendarIcon className="h-12 w-12 text-muted-foreground opacity-20 mx-auto mb-3" />
                          <div className="font-medium">No rituals scheduled</div>
                          <div className="text-sm text-muted-foreground">
                            You have no rituals scheduled for this date
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assigned Poojas */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle>Pooja Assignments</CardTitle>
                  <CardDescription>Manage your assigned poojas</CardDescription>
                </div>
                <div className="w-full md:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search poojas..."
                      className="pl-10 max-w-full md:max-w-xs"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4 w-full md:w-auto">
                  <TabsTrigger value="upcoming" className="relative flex-1 md:flex-none">
                    Upcoming
                    {assignedPoojas.length > 0 && (
                      <span className="ml-2 w-5 h-5 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
                        {assignedPoojas.length}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="flex-1 md:flex-none">Completed</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming" className="space-y-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="upcoming"
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                      className="space-y-4"
                    >
                      {filteredUpcomingPoojas.length > 0 ? (
                        filteredUpcomingPoojas.map((pooja) => (
                          <motion.div key={pooja.id} variants={itemVariants}>
                            <Card className="hover:shadow-md transition-shadow">
                              <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row">
                                  <div className="md:w-2/3 p-5">
                                    <div className="flex items-start justify-between mb-4">
                                      <Badge variant="outline" className="bg-primary/10 mb-2">
                                        {pooja.name}
                                      </Badge>
                                      <div className="flex items-center gap-1">
                                        <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-sm">{pooja.date}</span>
                                      </div>
                                    </div>
                                    
                                    <h3 className="font-medium">{pooja.customer}</h3>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
                                      <div className="flex items-center gap-2 text-sm">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{pooja.phone}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-sm">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span>
                                          {pooja.time} ({pooja.duration})
                                        </span>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-2 text-sm">
                                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                      <span className="leading-tight">{pooja.location}</span>
                                    </div>
                                  </div>
                                  <Separator orientation="vertical" className="hidden md:block" />
                                  <div className="md:w-1/3 bg-muted/20 md:bg-transparent p-5 flex flex-col justify-center gap-3">
                                    <div className="text-sm font-medium text-center md:text-left">Ritual status</div>
                                    {completionProgress > 0 && selectedPooja?.id === pooja.id ? (
                                      <div className="space-y-2">
                                        <Progress value={completionProgress} className="h-2" />
                                        <p className="text-xs text-center text-muted-foreground">
                                          {completionProgress < 100 ? 'Processing...' : 'Completed!'}
                                        </p>
                                      </div>
                                    ) : (
                                      <div className="flex flex-col gap-2">
                                        <Button 
                                          onClick={() => markAsCompleted(pooja.id)} 
                                          className="w-full"
                                        >
                                          <CheckCircle className="h-4 w-4 mr-2" />
                                          Mark as Completed
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          onClick={() => viewPoojaDetails(pooja)}
                                          className="w-full"
                                        >
                                          View Details
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                          <h3 className="text-lg font-medium mb-1">No upcoming poojas</h3>
                          <p className="text-muted-foreground">
                            {searchQuery 
                              ? 'No poojas match your search criteria' 
                              : 'You have no upcoming pooja assignments'}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </TabsContent>
                
                <TabsContent value="completed" className="space-y-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="completed"
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                      className="space-y-4"
                    >
                      {filteredCompletedPoojas.length > 0 ? (
                        filteredCompletedPoojas.map((pooja) => (
                          <motion.div key={pooja.id} variants={itemVariants}>
                            <Card>
                              <CardContent className="p-5">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                  <div className="space-y-3">
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <Badge variant="outline" className="bg-secondary/30 mb-2">
                                          {pooja.name}
                                        </Badge>
                                        <h3 className="font-medium">{pooja.customer}</h3>
                                      </div>
                                      <Badge variant="success" className="bg-green-500/10 text-green-600 border-green-500/20">
                                        Completed
                                      </Badge>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      <div className="flex items-center gap-2 text-sm">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span>
                                          {pooja.time} ({pooja.duration})
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2 text-sm">
                                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                        <span>{pooja.date}</span>
                                      </div>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm">
                                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                      <span className="leading-tight">{pooja.location}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => viewPoojaDetails(pooja)}
                                    >
                                      View Details
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                          <h3 className="text-lg font-medium mb-1">No completed poojas</h3>
                          <p className="text-muted-foreground">
                            {searchQuery 
                              ? 'No completed poojas match your search criteria' 
                              : 'You have not completed any poojas yet'}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {activeTab === "upcoming" ? filteredUpcomingPoojas.length : filteredCompletedPoojas.length} poojas found
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1">
                    Filter <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilterDate(undefined)}>
                    All Dates
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDate(new Date())}>
                    Today Only
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDate(addDays(new Date(), 7))}>
                    Next 7 Days
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDate(addDays(new Date(), 30))}>
                    Next 30 Days
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Pooja Details Dialog */}
      {selectedPooja && (
        <Dialog open={showPoojaDetails} onOpenChange={setShowPoojaDetails}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Ritual Details</DialogTitle>
              <DialogDescription>
                Details for {selectedPooja.name} ritual
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-primary/10 px-3 py-1">
                  {selectedPooja.name}
                </Badge>
                <Badge variant={selectedPooja.status === "completed" ? "success" : "outline"} className={
                  selectedPooja.status === "completed" ? "bg-green-500/10 text-green-600 border-green-500/20" : ""
                }>
                  {selectedPooja.status === "completed" ? "Completed" : "Upcoming"}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <p className="font-medium">{selectedPooja.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedPooja.phone}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{selectedPooja.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">{selectedPooja.time}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{selectedPooja.duration}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedPooja.location}</p>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Required Samagri</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li className="text-sm">Ghee Diya</li>
                    <li className="text-sm">Kumkum</li>
                    <li className="text-sm">Incense Sticks</li>
                    <li className="text-sm">Flower Petals</li>
                    <li className="text-sm">Coconut</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex flex-col gap-3 sm:flex-row">
              {selectedPooja.status !== "completed" && (
                <Button 
                  onClick={() => {
                    markAsCompleted(selectedPooja.id);
                    setShowPoojaDetails(false);
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Completed
                </Button>
              )}
              <Button variant="outline" onClick={() => setShowPoojaDetails(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  )
}
