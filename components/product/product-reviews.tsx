"use client"

import type React from "react"

import { useState } from "react"
import { Star, ThumbsUp, Flag, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface Review {
  id: string
  rating: number
  title: string
  comment: string
  isVerifiedPurchase: boolean
  createdAt: Date | string
  user: { name: string; image?: string | null }
  helpfulCount?: number
}

interface ProductReviewsProps {
  productId: string
  reviews: Review[]
  averageRating: number
  totalReviews: number
}

export function ProductReviews({ productId, reviews, averageRating, totalReviews }: ProductReviewsProps) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 5, title: "", comment: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: session } = useSession()
  const { toast } = useToast()

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to write a review.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Review submitted",
        description: "Thank you for your review! It will be published after moderation.",
      })

      setNewReview({ rating: 5, title: "", comment: "" })
      setShowReviewForm(false)
    } catch (error) {
      toast({
        title: "Failed to submit review",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleHelpful = (reviewId: string) => {
    toast({
      title: "Thank you!",
      description: "Your feedback helps other customers.",
    })
  }

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0]
    reviews.forEach((review) => {
      distribution[review.rating - 1]++
    })
    return distribution.reverse() // 5 stars first
  }

  const ratingDistribution = getRatingDistribution()

  return (
    <div className="space-y-8">
      {/* Reviews Header */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

        {/* Rating Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold">{averageRating}</div>
              <div>
                <div className="flex mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "h-5 w-5",
                        star <= averageRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
                      )}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Based on {totalReviews} reviews</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating, index) => (
              <div key={rating} className="flex items-center gap-2 text-sm">
                <span className="w-8">{rating}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${totalReviews > 0 ? (ratingDistribution[index] / totalReviews) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="w-8 text-muted-foreground">{ratingDistribution[index]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Write Review Button */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Reviews ({totalReviews})</h3>
          <Button onClick={() => setShowReviewForm(!showReviewForm)} variant={showReviewForm ? "outline" : "default"}>
            {showReviewForm ? "Cancel" : "Write a Review"}
          </Button>
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Write Your Review</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <Label>Rating</Label>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview((prev) => ({ ...prev, rating: star }))}
                      className="p-1"
                    >
                      <Star
                        className={cn(
                          "h-6 w-6 transition-colors",
                          star <= newReview.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300 hover:text-yellow-400",
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="review-title">Review Title</Label>
                <input
                  id="review-title"
                  type="text"
                  placeholder="Summarize your review"
                  value={newReview.title}
                  onChange={(e) => setNewReview((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full mt-2 px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <Label htmlFor="review-comment">Your Review</Label>
                <Textarea
                  id="review-comment"
                  placeholder="Tell others about your experience with this product"
                  value={newReview.comment}
                  onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
                  className="mt-2 min-h-[100px]"
                  required
                />
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={review.user.image || ""} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.user.name}</span>
                          {review.isVerifiedPurchase && (
                            <Badge variant="secondary" className="text-xs">
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={cn(
                                  "h-4 w-4",
                                  star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <Button variant="ghost" size="sm">
                        <Flag className="h-4 w-4" />
                      </Button>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">{review.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleHelpful(review.id)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Helpful ({review.helpfulCount || 0})
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
