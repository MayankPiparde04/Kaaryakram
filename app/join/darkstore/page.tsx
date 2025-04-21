"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"

const formSchema = z.object({
  storeName: z.string().min(1, { message: "Please enter your store name" }),
  storeType: z.string().min(1, { message: "Please select your store type" }),
  address: z.string().min(1, { message: "Please enter your address" }),
  city: z.string().min(1, { message: "Please enter your city" }),
  state: z.string().min(1, { message: "Please enter your state" }),
  pincode: z.string().min(6, { message: "Please enter a valid PIN code" }),
  gstNumber: z.string().optional(),
  storeSize: z.string().min(1, { message: "Please select your store size" }),
  itemCategories: z.array(z.string()).min(1, { message: "Please select at least one item category" }),
  storeDescription: z.string().min(10, { message: "Description must be at least 10 characters" }),
})

export default function DarkstoreOwnerApplicationPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shouldRedirect, setShouldRedirect] = useState<string | null>(null)

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
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Application submitted",
        description: "Your application to become a Darkstore Owner has been submitted for review.",
      })

      router.push("/")
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

  const itemCategoryOptions = [
    { id: "pooja-items", label: "Pooja Items" },
    { id: "idols", label: "Idols & Statues" },
    { id: "incense", label: "Incense & Dhoop" },
    { id: "flowers", label: "Flowers & Garlands" },
    { id: "books", label: "Religious Books" },
    { id: "clothing", label: "Religious Clothing" },
    { id: "food", label: "Prasad & Food Items" },
  ]

  if (shouldRedirect) {
    return null
  }

  return (
    <div className="container max-w-2xl py-12">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Become a Darkstore Owner</h1>
          <p className="text-muted-foreground">
            Join our platform as a darkstore owner and provide quality pooja items to devotees.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="storeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your store name" {...field} />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your store type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="temple-shop">Temple Shop</SelectItem>
                        <SelectItem value="retail-store">Retail Store</SelectItem>
                        <SelectItem value="warehouse">Warehouse</SelectItem>
                        <SelectItem value="home-based">Home-based</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Your store address" {...field} />
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

              <FormField
                control={form.control}
                name="gstNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GST Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Your GST number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="storeSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Size</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your store size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="small">Small (&lt; 500 sq ft)</SelectItem>
                        <SelectItem value="medium">Medium (500-1000 sq ft)</SelectItem>
                        <SelectItem value="large">Large (1000-2000 sq ft)</SelectItem>
                        <SelectItem value="xl">Extra Large (&gt; 2000 sq ft)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="itemCategories"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Item Categories</FormLabel>
                    <FormDescription>Select the categories of items you can provide</FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {itemCategoryOptions.map((option) => (
                      <FormField
                        key={option.id}
                        control={form.control}
                        name="itemCategories"
                        render={({ field }) => {
                          return (
                            <FormItem key={option.id} className="flex flex-row items-start space-x-3 space-y-0">
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

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting Application..." : "Submit Application"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
