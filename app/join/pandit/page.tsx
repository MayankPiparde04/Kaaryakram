"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { motion } from "framer-motion"
import { 
  User, 
  Book, 
  Calendar, 
  Languages, 
  FileText, 
  Upload, 
  Check, 
  ArrowLeft, 
  CheckCircle2,
  Award,
  Timer,
  ChevronRight,
  MapPin,
  Scroll,
  GraduationCap,
  Clock
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"
import { panditSchema } from "@/lib/Roles/Pandit/panditSchema"
import { Badge } from "@/components/ui/badge"

// const formSchema = z.object({
//   experience: z.string().min(1, { message: "Please enter your years of experience" }),
//   specialization: z.string().min(1, { message: "Please select your specialization" }),
//   additionalSpecializations: z.array(z.string()).optional(),
//   languages: z.string().min(1, { message: "Please enter languages you speak" }),
//   address: z.string().min(1, { message: "Please enter your address" }),
//   city: z.string().min(1, { message: "Please enter your city" }),
//   state: z.string().min(1, { message: "Please enter your state" }),
//   pincode: z.string().min(6, { message: "Please enter a valid PIN code" }),
//   bio: z.string().min(10, { message: "Bio must be at least 10 characters" }),
//   certificates: z.string().optional(),
//   certificateFiles: z.array(z.string()).optional(),
//   educationLevel: z.string().min(1, { message: "Please select your education level" }),
//   guruParampara: z.string().optional(),
//   availableTimes: z.object({
//     mornings: z.boolean().optional(),
//     afternoons: z.boolean().optional(),
//     evenings: z.boolean().optional(),
//     weekends: z.boolean().optional(),
//   }),
//   travelDistance: z.string().min(1, { message: "Please select your travel distance" }),
//   ritualTypes: z.array(z.string()).min(1, { message: "Please select at least one ritual type" }),
//   profileImage: z.string().optional(),
//   agreeToTerms: z.boolean().refine(val => val, { message: "You must agree to the terms and conditions" })
// })

export default function PanditApplicationPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shouldRedirect, setShouldRedirect] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadedCertificates, setUploadedCertificates] = useState<string[]>([])

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

  const form = useForm<z.infer<typeof panditSchema>>({
    resolver: zodResolver(panditSchema),
    defaultValues: {
      experience: "",
      specialization: "",
      additionalSpecializations: [],
      languages: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      bio: "",
      certificates: "",
      certificateFiles: [],
      educationLevel: "",
      guruParampara: "",
      availableTimes: {
        mornings: false,
        afternoons: false,
        evenings: false,
        weekends: false
      },
      travelDistance: "",
      ritualTypes: [],
      agreeToTerms: false
    },
  })

  const nextStep = async () => {
    if (currentStep === 1) {
      const personalFields = ["address", "city", "state", "pincode", "bio"];
      const result = await form.trigger(personalFields as any);
      if (result) setCurrentStep(2);
    } else if (currentStep === 2) {
      const expertiseFields = ["experience", "specialization", "languages", "educationLevel"];
      const result = await form.trigger(expertiseFields as any);
      if (result) setCurrentStep(3);
    } else if (currentStep === 3) {
      const servicesFields = ["availableTimes", "travelDistance", "ritualTypes"];
      const result = await form.trigger(servicesFields as any);
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

  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newCertificates = Array.from(files).map(file => URL.createObjectURL(file));
      setUploadedCertificates([...uploadedCertificates, ...newCertificates]);
      form.setValue("certificateFiles", [...uploadedCertificates, ...newCertificates]);
    }
  };

  async function onSubmit(values: z.infer<typeof panditSchema>) {
    setIsSubmitting(true)
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Application submitted",
        description: "Your application to become a Pandit has been submitted for review.",
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

  const ritualTypeOptions = [
    { id: "griha-pravesh", label: "Griha Pravesh" },
    { id: "satyanarayan-katha", label: "Satyanarayan Katha" },
    { id: "vivah", label: "Vivah (Marriage)" },
    { id: "mundan", label: "Mundan Sanskar" },
    { id: "naamkaran", label: "Naamkaran" },
    { id: "shradh", label: "Shradh" },
    { id: "ganesh-pooja", label: "Ganesh Pooja" },
    { id: "durga-pooja", label: "Durga Pooja" },
    { id: "lakshmi-pooja", label: "Lakshmi Pooja" },
  ]

  const additionalSpecializationOptions = [
    { id: "vastu", label: "Vastu Shastra" },
    { id: "astrology", label: "Jyotish/Astrology" },
    { id: "yoga", label: "Yoga" },
    { id: "meditation", label: "Meditation" },
    { id: "ayurveda", label: "Ayurveda" },
    { id: "mantra", label: "Mantra Sadhana" },
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
            <h1 className="text-3xl font-bold">Become a Pandit</h1>
            <p className="text-muted-foreground mt-2">
              Join our platform as a verified Pandit and connect with devotees seeking authentic pooja services.
            </p>
          </div>

          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <p>Connect with devotees seeking authentic rituals</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <p>Flexible schedule based on your availability</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <p>Earn competitive dakshina for your services</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <p>Build your reputation with ratings and reviews</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <p>Samagri and materials provided by our platform</p>
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
                    <p className={`font-medium ${currentStep >= 1 ? "text-primary" : ""}`}>Personal Information</p>
                    <p className="text-xs text-muted-foreground">Basic profile details</p>
                  </div>
                </div>
                <div className="w-0.5 h-4 bg-border ml-4"></div>
                <div className="flex gap-2 items-center">
                  <div className={`w-8 h-8 rounded-full ${currentStep >= 2 ? "bg-primary" : "bg-secondary"} flex items-center justify-center text-sm text-primary-foreground`}>
                    {currentStep > 2 ? <Check className="h-5 w-5" /> : "2"}
                  </div>
                  <div>
                    <p className={`font-medium ${currentStep >= 2 ? "text-primary" : ""}`}>Expertise & Skills</p>
                    <p className="text-xs text-muted-foreground">Specializations and languages</p>
                  </div>
                </div>
                <div className="w-0.5 h-4 bg-border ml-4"></div>
                <div className="flex gap-2 items-center">
                  <div className={`w-8 h-8 rounded-full ${currentStep >= 3 ? "bg-primary" : "bg-secondary"} flex items-center justify-center text-sm text-primary-foreground`}>
                    {currentStep > 3 ? <Check className="h-5 w-5" /> : "3"}
                  </div>
                  <div>
                    <p className={`font-medium ${currentStep >= 3 ? "text-primary" : ""}`}>Services & Availability</p>
                    <p className="text-xs text-muted-foreground">Rituals and availability</p>
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
                {currentStep === 2 && "Expertise & Skills"}
                {currentStep === 3 && "Services & Availability"}
                {currentStep === 4 && "Review & Submit"}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Tell us about yourself"}
                {currentStep === 2 && "Share your qualifications and expertise"}
                {currentStep === 3 && "Let us know what services you offer and when you're available"}
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

                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-primary" />
                          <h3 className="font-medium text-sm">Basic Information</h3>
                        </div>

                        <FormField
                          control={form.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>About Yourself</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Tell us about your experience, expertise, and the poojas you specialize in"
                                  className="min-h-32"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                This will appear on your profile to help devotees know more about you
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <h3 className="font-medium text-sm">Address Information</h3>
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
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Expertise & Skills */}
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
                          <Book className="h-4 w-4 text-primary" />
                          <h3 className="font-medium text-sm">Expertise & Education</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="specialization"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Primary Specialization</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select your specialization" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="vedic">Vedic Rituals</SelectItem>
                                    <SelectItem value="tantric">Tantric Rituals</SelectItem>
                                    <SelectItem value="vastu">Vastu Shastra</SelectItem>
                                    <SelectItem value="jyotish">Jyotish (Astrology)</SelectItem>
                                    <SelectItem value="general">General Poojas</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="experience"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Years of Experience</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select your experience" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="0-2">0-2 years</SelectItem>
                                    <SelectItem value="3-5">3-5 years</SelectItem>
                                    <SelectItem value="5-10">5-10 years</SelectItem>
                                    <SelectItem value="10-20">10-20 years</SelectItem>
                                    <SelectItem value="20+">More than 20 years</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="educationLevel"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Educational Qualification</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select your education level" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="gurukul">Gurukul Education</SelectItem>
                                    <SelectItem value="diploma">Sanskrit Diploma</SelectItem>
                                    <SelectItem value="bachelors">Bachelor's in Vedic Studies</SelectItem>
                                    <SelectItem value="masters">Master's in Vedic Studies</SelectItem>
                                    <SelectItem value="phd">PhD in Religious Studies</SelectItem>
                                    <SelectItem value="traditional">Traditional Training</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="languages"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Languages Spoken</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. Hindi, Sanskrit, English" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Comma-separated list of languages you can conduct rituals in
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="guruParampara"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Guru Parampara (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your guru lineage or tradition" {...field} />
                                </FormControl>
                                <FormDescription>
                                  If you follow a specific tradition or parampara, please mention it
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="additionalSpecializations"
                          render={() => (
                            <FormItem>
                              <div className="mb-4">
                                <FormLabel>Additional Specializations</FormLabel>
                                <FormDescription>Select any additional areas of expertise you have</FormDescription>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                {additionalSpecializationOptions.map((option) => (
                                  <FormField
                                    key={option.id}
                                    control={form.control}
                                    name="additionalSpecializations"
                                    render={({ field }) => {
                                      return (
                                        <FormItem key={option.id} className="flex flex-row items-start space-x-3 space-y-0">
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(option.id)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...field.value || [], option.id])
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
                        
                        <div className="space-y-3">
                          <Label>Certificates & Credentials (Optional)</Label>
                          <div className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                            <Label htmlFor="certificate-upload" className="cursor-pointer text-center">
                              <Upload className="h-8 w-8 mb-2 mx-auto text-muted-foreground" />
                              <span className="text-sm font-normal">Upload certificates or credentials</span>
                              <Input 
                                id="certificate-upload" 
                                type="file" 
                                className="hidden" 
                                onChange={handleCertificateUpload}
                                accept="image/*,.pdf"
                                multiple
                              />
                            </Label>
                          </div>
                          {uploadedCertificates.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {uploadedCertificates.map((cert, i) => (
                                <div key={i} className="relative border rounded-md px-3 py-2 text-sm flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-primary" />
                                  <span>Certificate {i+1}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          <FormField
                            control={form.control}
                            name="certificates"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder="Or provide links to your certificates"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  You can also provide links to your certificates or qualifications (Google Drive, etc.)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Services & Availability */}
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
                          <Scroll className="h-4 w-4 text-primary" />
                          <h3 className="font-medium text-sm">Ritual Services</h3>
                        </div>

                        <FormField
                          control={form.control}
                          name="ritualTypes"
                          render={() => (
                            <FormItem>
                              <div className="mb-4">
                                <FormLabel>Rituals You Can Perform</FormLabel>
                                <FormDescription>Select the rituals and ceremonies you can conduct</FormDescription>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {ritualTypeOptions.map((option) => (
                                  <FormField
                                    key={option.id}
                                    control={form.control}
                                    name="ritualTypes"
                                    render={({ field }) => {
                                      return (
                                        <FormItem key={option.id} className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(option.id)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...field.value || [], option.id])
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
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <h3 className="font-medium text-sm">Availability & Travel</h3>
                        </div>

                        <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
                          <p className="text-sm font-medium">When are you generally available to perform rituals?</p>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="availableTimes.mornings"
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
                                      Mornings (6 AM - 12 PM)
                                    </FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="availableTimes.afternoons"
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
                                      Afternoons (12 PM - 5 PM)
                                    </FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="availableTimes.evenings"
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
                                      Evenings (5 PM - 10 PM)
                                    </FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="availableTimes.weekends"
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
                                      Weekends (Sat-Sun)
                                    </FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <FormField
                          control={form.control}
                          name="travelDistance"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Maximum Travel Distance</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="How far can you travel?" />
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
                                The maximum distance you are willing to travel for performing rituals
                              </FormDescription>
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
                          {uploadedImage && (
                            <div className="flex justify-center mb-4">
                              <img src={uploadedImage} alt="Profile" className="h-20 w-20 rounded-full object-cover" />
                            </div>
                          )}

                          <div>
                            <h3 className="font-medium text-base flex items-center gap-2">
                              <User className="h-4 w-4 text-primary" /> Personal Information
                            </h3>
                            <Separator className="my-2" />
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="col-span-2">
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
                              <GraduationCap className="h-4 w-4 text-primary" /> Expertise & Qualifications
                            </h3>
                            <Separator className="my-2" />
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Primary Specialization:</span>
                                <p className="font-medium capitalize">{form.getValues().specialization}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Experience:</span>
                                <p className="font-medium">{form.getValues().experience}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Education:</span>
                                <p className="font-medium">{form.getValues().educationLevel}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Languages:</span>
                                <p className="font-medium">{form.getValues().languages}</p>
                              </div>
                              {form.getValues().guruParampara && (
                                <div className="col-span-2">
                                  <span className="text-muted-foreground">Guru Parampara:</span>
                                  <p className="font-medium">{form.getValues().guruParampara}</p>
                                </div>
                              )}
                              {form.getValues().additionalSpecializations?.length > 0 && (
                                <div className="col-span-2">
                                  <span className="text-muted-foreground">Additional Specializations:</span>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {form.getValues().additionalSpecializations.map((spec) => (
                                      <Badge key={spec} variant="outline">
                                        {additionalSpecializationOptions.find(o => o.id === spec)?.label}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <h3 className="font-medium text-base flex items-center gap-2">
                              <Scroll className="h-4 w-4 text-primary" /> Services & Availability
                            </h3>
                            <Separator className="my-2" />
                            <div className="space-y-3 text-sm">
                              <div>
                                <span className="text-muted-foreground">Available Times:</span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {form.getValues().availableTimes.mornings && <Badge variant="outline">Mornings</Badge>}
                                  {form.getValues().availableTimes.afternoons && <Badge variant="outline">Afternoons</Badge>}
                                  {form.getValues().availableTimes.evenings && <Badge variant="outline">Evenings</Badge>}
                                  {form.getValues().availableTimes.weekends && <Badge variant="outline">Weekends</Badge>}
                                </div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Max Travel Distance:</span>
                                <p className="font-medium mt-1">{form.getValues().travelDistance}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Rituals & Ceremonies:</span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {form.getValues().ritualTypes?.map((ritual) => (
                                    <Badge key={ritual} variant="outline">
                                      {ritualTypeOptions.find(o => o.id === ritual)?.label}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-medium text-base flex items-center gap-2">
                              <Book className="h-4 w-4 text-primary" /> Bio
                            </h3>
                            <Separator className="my-2" />
                            <p className="text-sm">{form.getValues().bio}</p>
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
                                  By submitting, you agree to be contacted by our team for verification of your credentials
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
                        {isSubmitting ? "Submitting Application..." : "Submit Application"}
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
