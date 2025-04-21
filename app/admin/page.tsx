"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"

// Sample data for role applications
const roleApplications = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 98765 43210",
    role: "Pandit",
    experience: "10 years",
    specialization: "Vedic Rituals",
    date: "2025-04-15",
    status: "pending",
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya@example.com",
    phone: "+91 87654 32109",
    role: "Delivery",
    vehicleType: "Motorcycle",
    experience: "3 years",
    date: "2025-04-16",
    status: "pending",
  },
  {
    id: 3,
    name: "Amit Kumar",
    email: "amit@example.com",
    phone: "+91 76543 21098",
    role: "Darkstore",
    storeName: "Divine Supplies",
    location: "Mumbai",
    date: "2025-04-17",
    status: "pending",
  },
  {
    id: 4,
    name: "Sunita Verma",
    email: "sunita@example.com",
    phone: "+91 65432 10987",
    role: "Pandit",
    experience: "15 years",
    specialization: "Jyotish",
    date: "2025-04-10",
    status: "approved",
  },
  {
    id: 5,
    name: "Vikram Singh",
    email: "vikram@example.com",
    phone: "+91 54321 09876",
    role: "Delivery",
    vehicleType: "Scooter",
    experience: "2 years",
    date: "2025-04-12",
    status: "rejected",
  },
]

// Sample data for users
const users = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 98765 43210",
    role: null,
    joinDate: "2025-03-15",
    orders: 0,
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya@example.com",
    phone: "+91 87654 32109",
    role: null,
    joinDate: "2025-03-20",
    orders: 2,
  },
  {
    id: 3,
    name: "Amit Kumar",
    email: "amit@example.com",
    phone: "+91 76543 21098",
    role: null,
    joinDate: "2025-03-25",
    orders: 1,
  },
  {
    id: 4,
    name: "Sunita Verma",
    email: "sunita@example.com",
    phone: "+91 65432 10987",
    role: "Pandit",
    joinDate: "2025-03-10",
    orders: 0,
  },
  {
    id: 5,
    name: "Vikram Singh",
    email: "vikram@example.com",
    phone: "+91 54321 09876",
    role: "Delivery",
    joinDate: "2025-03-12",
    orders: 0,
  },
  {
    id: 6,
    name: "Deepak Gupta",
    email: "deepak@example.com",
    phone: "+91 43210 98765",
    role: "Darkstore",
    joinDate: "2025-03-05",
    orders: 0,
  },
  {
    id: 7,
    name: "Ananya Reddy",
    email: "ananya@example.com",
    phone: "+91 32109 87654",
    role: null,
    joinDate: "2025-04-01",
    orders: 3,
  },
]

// Sample data for orders
const orders = [
  {
    id: 1,
    orderNumber: "ORD-2025-001",
    customer: "Ananya Reddy",
    items: ["Ghee Diya", "Kumkum", "Incense Sticks"],
    total: 447,
    status: "Processing",
    date: "2025-04-21",
  },
  {
    id: 2,
    orderNumber: "ORD-2025-002",
    customer: "Priya Patel",
    items: ["Basic Pooja Kit"],
    total: 999,
    status: "Shipped",
    date: "2025-04-20",
  },
  {
    id: 3,
    orderNumber: "ORD-2025-003",
    customer: "Amit Kumar",
    items: ["Coconut", "Flowers"],
    total: 328,
    status: "Delivered",
    date: "2025-04-19",
  },
  {
    id: 4,
    orderNumber: "ORD-2025-004",
    customer: "Ananya Reddy",
    items: ["Premium Pooja Kit"],
    total: 2999,
    status: "Delivered",
    date: "2025-04-18",
  },
  {
    id: 5,
    orderNumber: "ORD-2025-005",
    customer: "Ananya Reddy",
    items: ["Incense Sticks", "Camphor", "Coconut"],
    total: 357,
    status: "Delivered",
    date: "2025-04-17",
  },
  {
    id: 6,
    orderNumber: "ORD-2025-006",
    customer: "Priya Patel",
    items: ["Flowers", "Kumkum"],
    total: 348,
    status: "Processing",
    date: "2025-04-21",
  },
]

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("applications")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false)

  // Redirect if not logged in
  if (!user) {
    router.push("/login")
    return null
  }

  // Redirect if not an admin
  if (!user.isAdmin) {
    router.push("/")
    return null
  }

  // Filter applications based on search query
  const filteredApplications = roleApplications.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.role && user.role.toLowerCase().includes(searchQuery.toLowerCase()))
  )

// Filter orders
