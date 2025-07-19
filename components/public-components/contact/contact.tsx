"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2, Mail, MessageSquare, Phone, MapPin, Clock } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { PersonalInfo } from "@/app/dashboard/page"
import { useToast } from "@/hooks/use-toast"


const Contact: React.FC<Partial<PersonalInfo>> = ({ location, email, phone })  => {

  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    urgent: false,
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ 
      ...prev, 
      urgent: checked,
    }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
    //   toast(`Form submitted: ${formData}`);

      toast({
        title: "MEssage submitted",
        description: JSON.stringify(formData),
      })
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        urgent: false,
      })
      
    } catch (error) {
      console.error('Error submitting form:', error)
      alert("Failed to send message. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const isFormValid = formData.name.trim() && 
                     formData.email.trim() && 
                     formData.subject.trim() && 
                     formData.message.trim()

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6" id="contact">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-2xl lg:text-2xl font-bold text-[#131313] mb-0">Contact Me</h2>
          <div className="w-24 h-1 bg-[#059669] mx-auto rounded-full"></div>
        </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Contact Form - Takes up 2 columns */}
        <div className="lg:col-span-2">
          <Card className="border-secondary">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Send Message
              </CardTitle>
              <CardDescription className="text-primary/60">Fill out the form below and I'll get back to you as soon as possible</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-primary">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="border-secondary focus:border-green"
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-primary">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className="border-secondary focus:border-green"
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <Label htmlFor="subject" className="text-primary">
                  Subject *
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Project inquiry, job opportunity, etc."
                  className="border-secondary focus:border-green"
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-primary">
                  Message *
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell me about your project, timeline, budget, or any specific requirements you have in mind..."
                  rows={6}
                  className="border-secondary focus:border-green resize-none"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="urgent"
                  checked={formData.urgent}
                  onCheckedChange={handleSwitchChange}
                  disabled={submitting}
                />
                <Label htmlFor="urgent" className="text-primary">
                  This is urgent
                </Label>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-secondary text-primary hover:bg-secondary/50 bg-transparent"
                  disabled={submitting}
                  onClick={() => setFormData({
                    name: "",
                    email: "",
                    subject: "",
                    message: "",
                    urgent: false,
                  })}
                >
                  Clear
                </Button>
                
                <Button
                  onClick={handleSubmit}
                  disabled={!isFormValid || submitting}
                  className="bg-green hover:bg-green/90 text-white disabled:opacity-50 flex-1"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info Sidebar */}
        <div className="space-y-6">
          <Card className="border-secondary">
            <CardHeader>
              <CardTitle className="text-primary">Get In Touch</CardTitle>
              <CardDescription className="text-primary/60">Other ways to reach me</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-green mt-0.5" />
                <div>
                  <p className="text-primary font-medium text-sm">Email</p>
                  <p className="text-primary/70 text-[12px]">{ email }</p>
                </div>
              </div>
              
             {
                phone && (
                <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-green mt-0.5" />
                    <div>
                    <p className="text-primary font-medium text-sm">Phone</p>
                    <p className="text-primary/70 text-[12px]">{ phone }</p>
                    </div>
                </div>
                )
             }


             {
                location && (
                <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-green mt-0.5" />
                    <div>
                    <p className="text-primary font-medium text-sm">Location</p>
                    <p className="text-primary/70 text-[12px]">{ location }</p>
                    </div>
                </div>
                )
             }
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-green mt-0.5" />
                <div>
                  <p className="text-primary font-medium text-sm">Response Time</p>
                  <p className="text-primary/70 text-[12px]">Usually within 24 hours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Contact;