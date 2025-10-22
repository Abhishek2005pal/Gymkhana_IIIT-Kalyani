"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  studentId: z.string().min(1, {
    message: "Student ID is required.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Please confirm your password.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match.",
});

type FormData = z.infer<typeof formSchema>

export default function Register() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      studentId: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      // Fix: Add proper value to Promise resolve
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 500))
      
      // Actually send the registration data to your API
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          studentId: data.studentId,
          password: data.password,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }
      
      toast({
        title: "Success",
        description: "Registration successful!",
      })
      router.push("/login")
    } catch (error: any) {
      console.error(error)
      toast({
        title: "Error",
        description: error.message || "Registration failed.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Enter your details to register</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Name"
                  {...register("name")}
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
              </div>
              
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  {...register("email")}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
              </div>
              
              <div>
                <Input
                  type="text"
                  placeholder="Student ID"
                  {...register("studentId")}
                />
                {errors.studentId && <p className="text-sm text-red-500 mt-1">{errors.studentId.message}</p>}
              </div>
              
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  {...register("password")}
                />
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
              </div>
              
              <div>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>
            <Button type="submit" className="w-full mt-4" disabled={isLoading}>
              {isLoading ? "Loading..." : "Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}