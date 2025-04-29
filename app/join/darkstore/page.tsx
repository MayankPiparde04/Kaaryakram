"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion } from "framer-motion";
import {
  Store,
  MapPin,
  Building,
  FileText,
  Package,
  ChevronRight,
  Upload,
  Check,
  ArrowLeft,
  Home,
  CheckCircle2,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth";
import { darkstoreSchema } from "@/lib/Roles/Darkstore/darkstoreSchema";
import { Badge } from "@/components/ui/badge";

// const formSchema = z.object({
//   storeName: z.string().min(1, { message: "Please enter your store name" }),
//   storeType: z.string().min(1, { message: "Please select your store type" }),
//   address: z.string().min(1, { message: "Please enter your address" }),
//   city: z.string().min(1, { message: "Please enter your city" }),
//   state: z.string().min(1, { message: "Please enter your state" }),
//   pincode: z.string().min(6, { message: "Please enter a valid PIN code" }),
//   gstNumber: z.string().optional(),
//   storeSize: z.string().min(1, { message: "Please select your store size" }),
//   itemCategories: z.array(z.string()).min(1, { message: "Please select at least one item category" }),
//   storeDescription: z.string().min(10, { message: "Description must be at least 10 characters" }),
//   storeImages: z.array(z.string()).optional(),
//   operatingHours: z.string().min(1, { message: "Please provide your operating hours" }),
//   hasStorage: z.boolean().default(false),
//   deliveryCapability: z.string().min(1, { message: "Please select a delivery capability option" }),
//   agreeToTerms: z.boolean().refine(val => val, { message: "You must agree to the terms and conditions" })
// })

export default function DarkstoreOwnerApplicationPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      setShouldRedirect("/login");
    } else if (user.role) {
      setShouldRedirect("/");
    }
  }, [user]);

  useEffect(() => {
    if (shouldRedirect) {
      router.push(shouldRedirect);
    }
  }, [shouldRedirect, router]);

  const form = useForm<z.infer<typeof darkstoreSchema>>({
    resolver: zodResolver(darkstoreSchema),
    defaultValues: {
      storeName: "",
      storeType: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      gstNumber: "",
      storeSize: "",
      itemCategories: [],
      storeDescription: "",
      storeImages: [],
      operatingHours: "",
      hasStorage: false,
      deliveryCapability: "",
      agreeToTerms: false,
    },
  });

  const nextStep = async () => {
    if (currentStep === 1) {
      const basicFields = [
        "storeName",
        "storeType",
        "address",
        "city",
        "state",
        "pincode",
      ];
      const result = await form.trigger(basicFields as any);
      if (result) setCurrentStep(2);
    } else if (currentStep === 2) {
      const inventoryFields = ["storeSize", "itemCategories", "hasStorage"];
      const result = await form.trigger(inventoryFields as any);
      if (result) setCurrentStep(3);
    } else if (currentStep === 3) {
      const detailsFields = [
        "storeDescription",
        "operatingHours",
        "deliveryCapability",
      ];
      const result = await form.trigger(detailsFields as any);
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
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setUploadedImages([...uploadedImages, ...newImages]);
      form.setValue("storeImages", [...uploadedImages, ...newImages]);
    }
  };

  async function onSubmit(values: z.infer<typeof darkstoreSchema>) {
    setIsSubmitting(true);
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Application submitted",
        description:
          "Your application to become a Darkstore Owner has been submitted for review.",
      });

      // Show success for a moment before redirecting
      setTimeout(() => router.push("/"), 2000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description:
          "There was an error submitting your application. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const itemCategoryOptions = [
    { id: "pooja-items", label: "Pooja Items" },
    { id: "idols", label: "Idols & Statues" },
    { id: "incense", label: "Incense & Dhoop" },
    { id: "flowers", label: "Flowers & Garlands" },
    { id: "books", label: "Religious Books" },
    { id: "clothing", label: "Religious Clothing" },
    { id: "food", label: "Prasad & Food Items" },
  ];

  if (shouldRedirect) {
    return null;
  }

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="container max-w-5xl py-12 px-4">
      <Button variant="ghost" className="mb-6" onClick={() => router.push("/")}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
      </Button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Info */}
        <div className="lg:w-1/3 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Become a Darkstore Owner</h1>
            <p className="text-muted-foreground mt-2">
              Join our platform as a darkstore owner and provide quality pooja
              items to devotees in your area.
            </p>
          </div>

          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Store className="h-5 w-5 text-primary" />
                Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <p>Reach more customers and expand your business</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <p>Get access to our delivery network</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <p>Maintain inventory through our easy-to-use dashboard</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <p>Higher visibility during festivals and special occasions</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <p>Access to bulk purchasing opportunities</p>
              </div>
            </CardContent>
          </Card>

          {/* Progress indicator */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-5">
                <div className="flex gap-2 items-center">
                  <div
                    className={`w-8 h-8 rounded-full ${
                      currentStep >= 1 ? "bg-primary" : "bg-secondary"
                    } flex items-center justify-center text-sm text-primary-foreground`}
                  >
                    {currentStep > 1 ? <Check className="h-5 w-5" /> : "1"}
                  </div>
                  <div>
                    <p
                      className={`font-medium ${
                        currentStep >= 1 ? "text-primary" : ""
                      }`}
                    >
                      Basic Information
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Store details and location
                    </p>
                  </div>
                </div>
                <div className="w-0.5 h-4 bg-border ml-4"></div>
                <div className="flex gap-2 items-center">
                  <div
                    className={`w-8 h-8 rounded-full ${
                      currentStep >= 2 ? "bg-primary" : "bg-secondary"
                    } flex items-center justify-center text-sm text-primary-foreground`}
                  >
                    {currentStep > 2 ? <Check className="h-5 w-5" /> : "2"}
                  </div>
                  <div>
                    <p
                      className={`font-medium ${
                        currentStep >= 2 ? "text-primary" : ""
                      }`}
                    >
                      Inventory Information
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Categories and capacity
                    </p>
                  </div>
                </div>
                <div className="w-0.5 h-4 bg-border ml-4"></div>
                <div className="flex gap-2 items-center">
                  <div
                    className={`w-8 h-8 rounded-full ${
                      currentStep >= 3 ? "bg-primary" : "bg-secondary"
                    } flex items-center justify-center text-sm text-primary-foreground`}
                  >
                    {currentStep > 3 ? <Check className="h-5 w-5" /> : "3"}
                  </div>
                  <div>
                    <p
                      className={`font-medium ${
                        currentStep >= 3 ? "text-primary" : ""
                      }`}
                    >
                      Additional Details
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Hours and capabilities
                    </p>
                  </div>
                </div>
                <div className="w-0.5 h-4 bg-border ml-4"></div>
                <div className="flex gap-2 items-center">
                  <div
                    className={`w-8 h-8 rounded-full ${
                      currentStep >= 4 ? "bg-primary" : "bg-secondary"
                    } flex items-center justify-center text-sm text-primary-foreground`}
                  >
                    {currentStep > 4 ? <Check className="h-5 w-5" /> : "4"}
                  </div>
                  <div>
                    <p
                      className={`font-medium ${
                        currentStep >= 4 ? "text-primary" : ""
                      }`}
                    >
                      Review & Submit
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Final confirmation
                    </p>
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
                {currentStep === 1 && "Store Information"}
                {currentStep === 2 && "Inventory Capabilities"}
                {currentStep === 3 && "Additional Details"}
                {currentStep === 4 && "Review & Submit"}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Provide basic details about your store"}
                {currentStep === 2 &&
                  "Tell us about what you can stock and sell"}
                {currentStep === 3 &&
                  "Add more information about your operations"}
                {currentStep === 4 &&
                  "Review your information and submit your application"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Step 1: Basic Information */}
                  {currentStep === 1 && (
                    <motion.div
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={pageVariants}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="storeName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Store Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your store name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="storeType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Store Type</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your store type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="temple-shop">
                                    Temple Shop
                                  </SelectItem>
                                  <SelectItem value="retail-store">
                                    Retail Store
                                  </SelectItem>
                                  <SelectItem value="warehouse">
                                    Warehouse
                                  </SelectItem>
                                  <SelectItem value="home-based">
                                    Home-based
                                  </SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <h3 className="font-medium text-sm">
                            Location Information
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Your store address"
                                    {...field}
                                  />
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
                                  <Input
                                    placeholder="Your PIN code"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="gstNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>GST Number (Optional)</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Your GST number"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Inventory Information */}
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
                          <Package className="h-4 w-4 text-primary" />
                          <h3 className="font-medium text-sm">
                            Inventory Capabilities
                          </h3>
                        </div>

                        <FormField
                          control={form.control}
                          name="storeSize"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Store Size</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your store size" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="small">
                                    Small (&lt; 500 sq ft)
                                  </SelectItem>
                                  <SelectItem value="medium">
                                    Medium (500-1000 sq ft)
                                  </SelectItem>
                                  <SelectItem value="large">
                                    Large (1000-2000 sq ft)
                                  </SelectItem>
                                  <SelectItem value="xl">
                                    Extra Large (&gt; 2000 sq ft)
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="hasStorage"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Dedicated Storage Space</FormLabel>
                                <FormDescription>
                                  Do you have a dedicated storage space for
                                  maintaining inventory?
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="itemCategories"
                          render={() => (
                            <FormItem>
                              <div className="mb-4">
                                <FormLabel>Item Categories</FormLabel>
                                <FormDescription>
                                  Select the categories of items you can provide
                                </FormDescription>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {itemCategoryOptions.map((option) => (
                                  <FormField
                                    key={option.id}
                                    control={form.control}
                                    name="itemCategories"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={option.id}
                                          className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(
                                                option.id
                                              )}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([
                                                      ...field.value,
                                                      option.id,
                                                    ])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) =>
                                                          value !== option.id
                                                      )
                                                    );
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                            {option.label}
                                          </FormLabel>
                                        </FormItem>
                                      );
                                    }}
                                  />
                                ))}
                              </div>
                              <FormMessage className="mt-2" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Additional Details */}
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
                          <FileText className="h-4 w-4 text-primary" />
                          <h3 className="font-medium text-sm">Store Details</h3>
                        </div>

                        <FormField
                          control={form.control}
                          name="storeDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Store Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe your store, experience, and the items you specialize in"
                                  className="min-h-32"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="operatingHours"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Operating Hours</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., Mon-Sat 9:00 AM - 8:00 PM"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Specify your normal business hours
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="deliveryCapability"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Delivery Capability</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-1"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="self" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      We can handle our own deliveries
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="platform" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      We need platform delivery partners
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="both" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      We can do both depending on volume
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-3">
                          <Label>Store Images (Optional)</Label>
                          <div className="grid grid-cols-2 gap-4 mt-1">
                            <div className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                              <Label
                                htmlFor="store-image"
                                className="cursor-pointer text-center"
                              >
                                <Upload className="h-8 w-8 mb-2 mx-auto text-muted-foreground" />
                                <span className="text-sm font-normal text-muted-foreground">
                                  Upload Store Front
                                </span>
                                <Input
                                  id="store-image"
                                  type="file"
                                  className="hidden"
                                  onChange={handleImageUpload}
                                  accept="image/*"
                                />
                              </Label>
                            </div>
                            <div className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                              <Label
                                htmlFor="interior-image"
                                className="cursor-pointer text-center"
                              >
                                <Upload className="h-8 w-8 mb-2 mx-auto text-muted-foreground" />
                                <span className="text-sm font-normal text-muted-foreground">
                                  Upload Interior
                                </span>
                                <Input
                                  id="interior-image"
                                  type="file"
                                  className="hidden"
                                  onChange={handleImageUpload}
                                  accept="image/*"
                                />
                              </Label>
                            </div>
                          </div>
                          {uploadedImages.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {uploadedImages.map((img, i) => (
                                <div
                                  key={i}
                                  className="relative w-20 h-20 rounded-md overflow-hidden border"
                                >
                                  <img
                                    src={img}
                                    alt={`Uploaded image ${i}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
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
                              <Store className="h-4 w-4 text-primary" /> Store
                              Information
                            </h3>
                            <Separator className="my-2" />
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">
                                  Store Name:
                                </span>
                                <p className="font-medium">
                                  {form.getValues().storeName}
                                </p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Store Type:
                                </span>
                                <p className="font-medium">
                                  {form.getValues().storeType ===
                                    "temple-shop" && "Temple Shop"}
                                  {form.getValues().storeType ===
                                    "retail-store" && "Retail Store"}
                                  {form.getValues().storeType === "warehouse" &&
                                    "Warehouse"}
                                  {form.getValues().storeType ===
                                    "home-based" && "Home-based"}
                                  {form.getValues().storeType === "other" &&
                                    "Other"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-medium text-base flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-primary" />{" "}
                              Location
                            </h3>
                            <Separator className="my-2" />
                            <div>
                              <p className="text-sm">
                                {form.getValues().address}
                              </p>
                              <p className="text-sm">
                                {form.getValues().city},{" "}
                                {form.getValues().state} -{" "}
                                {form.getValues().pincode}
                              </p>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-medium text-base flex items-center gap-2">
                              <Package className="h-4 w-4 text-primary" />{" "}
                              Inventory
                            </h3>
                            <Separator className="my-2" />
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">
                                  Store Size:
                                </span>
                                <p className="font-medium">
                                  {form.getValues().storeSize === "small" &&
                                    "Small (< 500 sq ft)"}
                                  {form.getValues().storeSize === "medium" &&
                                    "Medium (500-1000 sq ft)"}
                                  {form.getValues().storeSize === "large" &&
                                    "Large (1000-2000 sq ft)"}
                                  {form.getValues().storeSize === "xl" &&
                                    "Extra Large (> 2000 sq ft)"}
                                </p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Has Storage:
                                </span>
                                <p className="font-medium">
                                  {form.getValues().hasStorage ? "Yes" : "No"}
                                </p>
                              </div>
                            </div>
                            <div className="mt-2">
                              <span className="text-muted-foreground text-sm">
                                Categories:
                              </span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {form
                                  .getValues()
                                  .itemCategories.map((category) => (
                                    <Badge key={category} variant="outline">
                                      {
                                        itemCategoryOptions.find(
                                          (opt) => opt.id === category
                                        )?.label
                                      }
                                    </Badge>
                                  ))}
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-medium text-base flex items-center gap-2">
                              <Clock className="h-4 w-4 text-primary" />{" "}
                              Operations
                            </h3>
                            <Separator className="my-2" />
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">
                                  Hours:
                                </span>
                                <p className="font-medium">
                                  {form.getValues().operatingHours}
                                </p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Delivery Capability:
                                </span>
                                <p className="font-medium">
                                  {form.getValues().deliveryCapability ===
                                    "self" && "Self-managed"}
                                  {form.getValues().deliveryCapability ===
                                    "platform" && "Platform delivery partners"}
                                  {form.getValues().deliveryCapability ===
                                    "both" && "Both options"}
                                </p>
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
                                  I agree to the{" "}
                                  <a href="#" className="text-primary">
                                    Terms of Service
                                  </a>{" "}
                                  and{" "}
                                  <a href="#" className="text-primary">
                                    Privacy Policy
                                  </a>
                                </FormLabel>
                                <FormDescription>
                                  By submitting, you agree to be contacted by
                                  our team for verification
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
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                      >
                        Previous
                      </Button>
                    )}

                    {currentStep < 4 && (
                      <Button
                        type="button"
                        className="ml-auto"
                        onClick={nextStep}
                      >
                        Continue <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}

                    {currentStep === 4 && (
                      <Button
                        type="submit"
                        className="ml-auto"
                        disabled={
                          isSubmitting || !form.getValues().agreeToTerms
                        }
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
  );
}
