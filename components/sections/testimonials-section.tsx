import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/woman-profile.png",
    rating: 5,
    comment:
      "Amazing quality products! My baby loves the toys we ordered. Fast shipping and excellent customer service.",
    location: "New York, NY",
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "/man-profile.png",
    rating: 5,
    comment:
      "Best baby store online! Everything is safe, well-made, and arrives quickly. Highly recommend to all parents.",
    location: "Los Angeles, CA",
  },
  {
    id: 3,
    name: "Emily Davis",
    avatar: "/woman-profile.png",
    rating: 5,
    comment: "Love the variety and quality. The educational toys have been perfect for my toddler's development.",
    location: "Chicago, IL",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">What Parents Say</h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Join thousands of happy parents who trust us for their baby's needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>

                <blockquote className="text-muted-foreground mb-4">"{testimonial.comment}"</blockquote>

                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
