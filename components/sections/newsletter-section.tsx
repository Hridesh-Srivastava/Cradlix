import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Gift } from "lucide-react"

export function NewsletterSection() {
  return (
    <section className="py-16 md:py-24 bg-primary/5">
      <div className="container">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8 md:p-12">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-balance">Stay Updated with Cradlix</h2>
                <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                  Get exclusive offers, new product alerts, and parenting tips delivered to your inbox. Plus, get 10%
                  off your first order!
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Gift className="h-4 w-4" />
                <span>10% off your first order when you subscribe</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input type="email" placeholder="Enter your email address" className="flex-1" />
                <Button size="lg" className="sm:w-auto">
                  Subscribe
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
