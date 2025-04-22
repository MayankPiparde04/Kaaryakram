"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { motion } from "framer-motion"
import { 
  Truck, 
  MapPin, 
  Clock, 
  FileText, 
  Upload, 
  Check, 
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  FileCheck,
  LucideBike,
  TimerReset,
  BadgeIndianRupee,
  Map,
  AreaChart
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"

const formSchema = z.object({
  vehicleType: z.string().min(1, { message: "Please select your vehicle type" }),
  licenseNumber: z.string().min(1, { message: "Please enter your license number" }),
  experience: z.string().min(1, { message: "Please enter your years of experience" }),
  address: z.string().min(1, { message: "Please enter your address" }),
  city: z.string().min(1, { message: "Please enter your city" }),
  state: z.string().min(1, { message: "Please enter your state" }),
  pincode: z.string().min(6, { message: "Please enter a valid PIN code" }),
  serviceAreas: z.string().min(1, { message: "Please enter your service areas" }),
  availability: z.array(z.string()).min(1, { message: "Please select at least one availability option" }),
  additionalInfo: z.string().optional(),
  vehicleRegistration: z.string().min(1, { message: "Please enter your vehicle registration number" }),
  maxDistance: z.string().min(1, { message: "Please select the maximum distance" }),
  profileImage: z.string().optional(),
  preferredShifts: z.array(z.string()).optional(),
  maxDeliveryWeight: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val, { message: "You must agree to the terms and conditions" })
})

export default function DeliveryPartnerApplicationPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [shouldRedirect, setShouldRedirect] = useState<string | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setShouldRedirect("/login")
    } else if (user.role) {
      setShouldRedirect("/")
    }
  }, [user])

  useEffect(() => {
    if (shouldRedirect) {
      router.push(shouldRedirect)
    }
  }, [shouldRedirect, router])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleType: "",
      licenseNumber: "",
      experience: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      serviceAreas: "",
      availability: [],
      additionalInfo: "",
      vehicleRegistration: "",
      maxDistance: "",
      preferredShifts: [],
      maxDeliveryWeight: "",
      agreeToTerms: false
    },
  })

  const nextStep = async () => {
    if (currentStep === 1) {
      const personalFields = ["address", "city", "state", "pincode"];
      const result = await form.trigger(personalFields as any);
      if (result) setCurrentStep(2);
    } else if (currentStep === 2) {
      const vehicleFields = ["vehicleType", "licenseNumber", "vehicleRegistration", "experience"];
      const result = await form.trigger(vehicleFields as any);
      if (result) setCurrentStep(3);
    } else if (currentStep === 3) {
      const availabilityFields = ["availability", "serviceAreas", "maxDistance"];
      const result = await form.trigger(availabilityFields as any);
      if (result) setCurrentStep(4);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const imageUrl = URL.createObjectURL(files[0]);
      setUploadedImage(imageUrl);
      form.setValue("profileImage", imageUrl);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Application submitted",
        description: "Your application to become a Delivery Partner has been submitted for review.",
      })

      // Show success for a moment before redirecting
      setTimeout(() => router.push("/"), 2000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "There was an error submitting your application. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const availabilityOptions = [
    { id: "weekdays", label: "Weekdays" },
    { id: "weekends", label: "Weekends" },
    { id: "mornings", label: "Mornings (6 AM - 12 PM)" },
    { id: "afternoons", label: "Afternoons (12 PM - 5 PM)" },
    { id: "evenings", label: "Evenings (5 PM - 10 PM)" },
    { id: "nights", label: "Nights (10 PM - 6 AM)" },
  ]

  const shiftOptions = [
    { id: "morning", label: "Morning Shift (6 AM - 2 PM)" },
    { id: "afternoon", label: "Afternoon Shift (2 PM - 10 PM)" },
    { id: "flexible", label: "Flexible Hours" },
    { id: "full-day", label: "Full Day (8+ hours)" },
  ]

  if (shouldRedirect) {
    return null
  }

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="container max-w-5xl py-12 px-4">
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => router.push('/')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
      </Button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Info */}
        <div className="lg:w-1/3 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Become a Delivery Partner</h1>
            <p className="text-muted-foreground mt-2">
              Join our platform as a delivery partner and help deliver sacred items to devotees at their doorstep.
            </p>
          </div>

          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <BadgeIndianRupee className="h-5 w-5 text-primary" />
                Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <p>Earn competitive delivery fees</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <p>Flexible working hours that fit your schedule</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <p>Weekly payouts directly to your bank account</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <p>Bonuses during festivals and peak seasons</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <p>Be part of a spiritual service to the community</p>
              </div>
            </CardContent>
          </Card>

          {/* Progress indicator */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-5">
                <div className="flex gap-2 items-center">
                  <div className={`w-8 h-8 rounded-full ${currentStep >= 1 ? "bg-primary" : "bg-secondary"} flex items-center justify-center text-sm text-primary-foreground`}>
                    {currentStep > 1 ? <Check className="h-5 w-5" /> : "1"}
                  </div>
                  <div>
                    <p className={`font-medium ${currentStep >= 1 ? "text-primary" : ""}`}>Personal Details</p>
                    <p className="text-xs text-muted-foreground">Basic information</p>
                  </div>
                </div>
                <div className="w-0.5 h-4 bg-border ml-4"></div>
                <div className="flex gap-2 items-center">
                  <div className={`w-8 h-8 rounded-full ${currentStep >= 2 ? "bg-primary" : "bg-secondary"} flex items-center justify-center text-sm text-primary-foreground`}>
                    {currentStep > 2 ? <Check className="h-5 w-5" /> : "2"}
                  </div>
                  <div>
                    <p className={`font-medium ${currentStep >= 2 ? "text-primary" : ""}`}>Vehicle & Experience</p>
                    <p className="text-xs text-muted-foreground">Your delivery vehicle</p>
                  </div>
                </div>
                <div className="w-0.5 h-4 bg-border ml-4"></div>
                <div className="flex gap-2 items-center">
                  <div className={`w-8 h-8 rounded-full ${currentStep >= 3 ? "bg-primary" : "bg-secondary"} flex items-center justify-center text-sm text-primary-foreground`}>
                    {currentStep > 3 ? <Check className="h-5 w-5" /> : "3"}
                  </div>
                  <div>
                    <p className={`font-medium ${currentStep >= 3 ? "text-primary" : ""}`}>Availability & Area</p>
                    <p className="text-xs text-muted-foreground">When and where you can deliver</p>
                  </div>
                </div>
                <div className="w-0.5 h-4 bg-border ml-4"></div>
                <div className="flex gap-2 items-center">
                  <div className={`w-8 h-8 rounded-full ${currentStep >= 4 ? "bg-primary" : "bg-secondary"} flex items-center justify-center text-sm text-primary-foreground`}>
                    {currentStep > 4 ? <Check className="h-5 w-5" /> : "4"}
                  </div>
                  <div>
                    <p className={`font-medium ${currentStep >= 4 ? "text-primary" : ""}`}>Review & Submit</p>
                    <p className="text-xs text-muted-foreground">Final confirmation</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Form */}
        <div className="lg:w-2/3">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>
                {currentStep === 1 && "Personal Information"}
                {currentStep === 2 && "Vehicle & Experience"}
                {currentStep === 3 && "Availability & Service Area"}
                {currentStep === 4 && "Review & Submit"}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Provide your basic contact information"}
                {currentStep === 2 && "Tell us about your vehicle and delivery experience"}
                {currentStep === 3 && "Let us know when and where you can deliver"}
                {currentStep === 4 && "Review your information and submit your application"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Step 1: Personal Information */}
                  {currentStep === 1 && (
                    <motion.div
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={pageVariants}
                      className="space-y-6"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <h3 className="font-medium text-sm">Profile & Location Information</h3>
                        </div>

                        <div className="flex justify-center mb-6">
                          <div className="relative">
                            <div className={`h-24 w-24 rounded-full border-2 border-dashed border-primary flex items-center justify-center ${uploadedImage ? 'bg-transparent' : 'bg-muted'}`}>
                              {uploadedImage ? (
                                <img src={uploadedImage} alt="Profile" className="h-full w-full object-cover rounded-full" />
                              ) : (
                                <Upload className="h-8 w-8 text-muted-foreground" />
                              )}
                            </div>
                            <input 
                              type="file" 
                              id="profile-photo" 
                              className="absolute inset-0 opacity-0 cursor-pointer" 
                              accept="image/*"
                              onChange={handleImageUpload}
                            />
                            <Label htmlFor="profile-photo" className="block text-center mt-2 text-sm text-muted-foreground cursor-pointer">
                              {uploadedImage ? "Change photo" : "Upload photo"}
                            </Label>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your street address" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your city" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your state" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="pincode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>PIN Code</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your PIN code" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Vehicle & Experience */}
                  {currentStep === 2 && (
                    <motion.div
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={pageVariants}
                      className="space-y-6"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-primary" />
                          <h3 className="font-medium text-sm">Vehicle Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="vehicleType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Vehicle Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select your vehicle type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="bicycle">Bicycle</SelectItem>
                                    <SelectItem value="motorcycle">Motorcycle</SelectItem>
                                    <SelectItem value="scooter">Scooter</SelectItem>
                                    <SelectItem value="car">Car</SelectItem>
                                    <SelectItem value="van">Van</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="vehicleRegistration"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Vehicle Registration Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., MH01AB1234" {...field} />
                                </FormControl>
                                <FormDescription>
                                  For bicycle, enter "NA"
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="licenseNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Driving License Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your driving license number" {...field} />
                                </FormControl>
                                <FormDescription>
                                  For bicycle, enter "NA"
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="experience"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Years of Delivery Experience</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select your experience" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="0">No previous experience</SelectItem>
                                    <SelectItem value="1">Less than 1 year</SelectItem>
                                    <SelectItem value="1-2">1-2 years</SelectItem>
                                    <SelectItem value="3-5">3-5 years</SelectItem>
                                    <SelectItem value="5+">More than 5 years</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="maxDeliveryWeight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Maximum Delivery Weight</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select maximum weight you can carry" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="5kg">Up to 5 kg</SelectItem>
                                  <SelectItem value="10kg">Up to 10 kg</SelectItem>
                                  <SelectItem value="15kg">Up to 15 kg</SelectItem>
                                  <SelectItem value="20+kg">More than 20 kg</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                The maximum weight of packages you are comfortable delivering
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Availability & Service Area */}
                  {currentStep === 3 && (
                    <motion.div
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={pageVariants}
                      className="space-y-6"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <h3 className="font-medium text-sm">Availability</h3>
                        </div>

                        <FormField
                          control={form.control}
                          name="availability"
                          render={() => (
                            <FormItem>
                              <div className="mb-4">
                                <FormLabel>When are you available?</FormLabel>
                                <FormDescription>Select all that apply</FormDescription>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {availabilityOptions.map((option) => (
                                  <FormField
                                    key={option.id}
                                    control={form.control}
                                    name="availability"
                                    render={({ field }) => {
                                      return (
                                        <FormItem key={option.id} className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(option.id)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...field.value, option.id])
                                                  : field.onChange(field.value?.filter((value) => value !== option.id))
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="font-normal">{option.label}</FormLabel>
                                        </FormItem>
                                      )
                                    }}
                                  />
                                ))}
                              </div>
                              <FormMessage className="mt-2" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="preferredShifts"
                          render={() => (
                            <FormItem>
                              <div className="mb-4">
                                <FormLabel>Preferred Shift Pattern</FormLabel>
                                <FormDescription>Select all that apply</FormDescription>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {shiftOptions.map((option) => (
                                  <FormField
                                    key={option.id}
                                    control={form.control}
                                    name="preferredShifts"
                                    render={({ field }) => {
                                      return (
                                        <FormItem key={option.id} className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(option.id)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...field.value, option.id])
                                                  : field.onChange(field.value?.filter((value) => value !== option.id))
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="font-normal">{option.label}</FormLabel>
                                        </FormItem>
                                      )
                                    }}
                                  />
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-4 mt-6">
                        <div className="flex items-center gap-2">
                          <Map className="h-4 w-4 text-primary" />
                          <h3 className="font-medium text-sm">Service Area</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="serviceAreas"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Service Areas</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="List the areas, localities, or PIN codes you can deliver to"
                                    className="min-h-[80px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Enter comma-separated areas (e.g., Bandra, Andheri, 400001)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="maxDistance"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Maximum Travel Distance</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select maximum distance" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="5km">Up to 5 km</SelectItem>
                                    <SelectItem value="10km">Up to 10 km</SelectItem>
                                    <SelectItem value="15km">Up to 15 km</SelectItem>
                                    <SelectItem value="20km">Up to 20 km</SelectItem>
                                    <SelectItem value="25+km">More than 25 km</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  How far are you willing to travel for deliveries?
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="additionalInfo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Additional Information (Optional)</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Any additional information you'd like to share"
                                  className="min-h-[80px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Review & Submit */}
                  {currentStep === 4 && (
                    <motion.div
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={pageVariants}
                      className="space-y-6"
                    >
                      <div className="space-y-4">
                        <div className="rounded-md border p-4 space-y-4">
                          <div>
                            <h3 className="font-medium text-base flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-primary" /> Personal Information
                            </h3>
                            <Separator className="my-2" />
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Address:</span>
                                <p className="font-medium">{form.getValues().address}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">City:</span>
                                <p className="font-medium">{form.getValues().city}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">State:</span>
                                <p className="font-medium">{form.getValues().state}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">PIN Code:</span>
                                <p className="font-medium">{form.getValues().pincode}</p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-medium text-base flex items-center gap-2">
                              <Truck className="h-4 w-4 text-primary" /> Vehicle & Experience
                            </h3>
                            <Separator className="my-2" />
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Vehicle Type:</span>
                                <p className="font-medium capitalize">{form.getValues().vehicleType}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">License Number:</span>
                                <p className="font-medium">{form.getValues().licenseNumber}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Registration:</span>
                                <p className="font-medium">{form.getValues().vehicleRegistration}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Experience:</span>
                                <p className="font-medium">{form.getValues().experience} years</p>
                              </div>
                              {form.getValues().maxDeliveryWeight && (
                                <div>
                                  <span className="text-muted-foreground">Max Weight:</span>
                                  <p className="font-medium">{form.getValues().maxDeliveryWeight}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <h3 className="font-medium text-base flex items-center gap-2">
                              <Clock className="h-4 w-4 text-primary" /> Availability
                            </h3>
                            <Separator className="my-2" />
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Available Times:</span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {form.getValues().availability.map((time) => (
                                    <Badge key={time} variant="outline">
                                      {time === "weekdays" && "Weekdays"}
                                      {time === "weekends" && "Weekends"}
                                      {time === "mornings" && "Mornings"}
                                      {time === "afternoons" && "Afternoons"}
                                      {time === "evenings" && "Evenings"}
                                      {time === "nights" && "Nights"}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Preferred Shifts:</span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {form.getValues().preferredShifts?.map((shift) => (
                                    <Badge key={shift} variant="outline">
                                      {shift === "morning" && "Morning Shift"}
                                      {shift === "afternoon" && "Afternoon Shift"}
                                      {shift === "flexible" && "Flexible Hours"}
                                      {shift === "full-day" && "Full Day"}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-medium text-base flex items-center gap-2">
                              <Map className="h-4 w-4 text-primary" /> Service Area
                            </h3>
                            <Separator className="my-2" />
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="col-span-2">
                                <span className="text-muted-foreground">Areas:</span>
                                <p className="font-medium mt-1">{form.getValues().serviceAreas}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Max Distance:</span>
                                <p className="font-medium">{form.getValues().maxDistance}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <FormField
                          control={form.control}
                          name="agreeToTerms"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  I agree to the <a href="#" className="text-primary">Terms of Service</a> and <a href="#" className="text-primary">Privacy Policy</a>
                                </FormLabel>
                                <FormDescription>
                                  By submitting, you agree to be contacted by our team for verification
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </motion.div>
                  )}

                  <div className="flex justify-between gap-2 mt-8">
                    {currentStep > 1 && (
                      <Button type="button" variant="outline" onClick={prevStep}>
                        Previous
                      </Button>
                    )}

                    {currentStep < 4 && (
                      <Button type="button" className="ml-auto" onClick={nextStep}>
                        Continue <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}

                    {currentStep === 4 && (
                      <Button 
                        type="submit" 
                        className="ml-auto"
                        disabled={isSubmitting || !form.getValues().agreeToTerms}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
