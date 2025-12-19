"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Eye, CheckCircle, XCircle, Filter } from "lucide-react"
import { StoreRequest } from "@/lib/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function StoreRequestsManagement() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [requests, setRequests] = useState<StoreRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<StoreRequest | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "reject">("approve")
  const [actionLoading, setActionLoading] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [adminNotes, setAdminNotes] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (session?.user?.role !== "super_admin") {
      router.push("/unauthorized")
    }
  }, [session, status, router])

  useEffect(() => {
    if (session?.user?.role === "super_admin") {
      fetchRequests()
    }
  }, [session])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/store-requests")
      
      if (!response.ok) {
        throw new Error("Failed to fetch store requests")
      }

      const data = await response.json()
      setRequests(data.requests)
    } catch (error) {
      console.error("Fetch error:", error)
      toast({
        title: "Error",
        description: "Failed to load store requests",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleView = (request: StoreRequest) => {
    setSelectedRequest(request)
    setViewDialogOpen(true)
  }

  const handleAction = (request: StoreRequest, action: "approve" | "reject") => {
    setSelectedRequest(request)
    setActionType(action)
    setRejectionReason("")
    setAdminNotes("")
    setActionDialogOpen(true)
  }

  const submitAction = async () => {
    if (!selectedRequest) return

    if (actionType === "reject" && !rejectionReason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      })
      return
    }

    setActionLoading(true)

    try {
      const response = await fetch(`/api/admin/store-requests/${selectedRequest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: actionType,
          rejectionReason: actionType === "reject" ? rejectionReason : undefined,
          adminNotes: adminNotes || undefined,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Action failed")
      }

      toast({
        title: "Success",
        description: `Store request ${actionType === "approve" ? "approved" : "rejected"} successfully`,
      })

      setActionDialogOpen(false)
      fetchRequests()
    } catch (error) {
      console.error("Action error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Action failed",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const filteredRequests = requests.filter((req) => {
    if (statusFilter === "all") return true
    return req.status === statusFilter
  })

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (session?.user?.role !== "super_admin") {
    return null
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Store Registration Requests</h1>
        <p className="text-gray-600 mt-2">Review and manage vendor store applications</p>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="ml-auto">
          <Button variant="outline" onClick={fetchRequests}>
            Refresh
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No store requests found
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.businessName}</TableCell>
                  <TableCell>{request.contactPersonName}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell className="capitalize">{request.businessCategory}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        request.status === "approved"
                          ? "default"
                          : request.status === "rejected"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(request.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(request)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {request.status === "pending" && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleAction(request, "approve")}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleAction(request, "reject")}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Store Request Details</DialogTitle>
            <DialogDescription>Complete information about the store application</DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Business Name</Label>
                  <p>{selectedRequest.businessName}</p>
                </div>
                <div>
                  <Label className="font-semibold">Business Type</Label>
                  <p className="capitalize">{selectedRequest.businessType.replace(/_/g, " ")}</p>
                </div>
                <div>
                  <Label className="font-semibold">Category</Label>
                  <p className="capitalize">{selectedRequest.businessCategory}</p>
                </div>
                <div>
                  <Label className="font-semibold">GST Number</Label>
                  <p>{selectedRequest.gstNumber || "N/A"}</p>
                </div>
                <div>
                  <Label className="font-semibold">PAN Number</Label>
                  <p>{selectedRequest.panNumber || "N/A"}</p>
                </div>
                <div>
                  <Label className="font-semibold">Years in Business</Label>
                  <p>{selectedRequest.yearsInBusiness || "N/A"}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Label className="font-semibold">Contact Information</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-gray-600">Contact Person</p>
                    <p>{selectedRequest.contactPersonName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p>{selectedRequest.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p>{selectedRequest.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Alternate Phone</p>
                    <p>{selectedRequest.alternatePhone || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Label className="font-semibold">Business Address</Label>
                <p className="mt-2">
                  {selectedRequest.addressLine1}
                  {selectedRequest.addressLine2 && `, ${selectedRequest.addressLine2}`}
                  <br />
                  {selectedRequest.city}, {selectedRequest.state} - {selectedRequest.postalCode}
                  <br />
                  {selectedRequest.country}
                </p>
              </div>

              {selectedRequest.businessDescription && (
                <div className="pt-4 border-t">
                  <Label className="font-semibold">Business Description</Label>
                  <p className="mt-2">{selectedRequest.businessDescription}</p>
                </div>
              )}

              {(selectedRequest.bankName || selectedRequest.accountNumber) && (
                <div className="pt-4 border-t">
                  <Label className="font-semibold">Bank Details</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm text-gray-600">Bank Name</p>
                      <p>{selectedRequest.bankName || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Account Holder</p>
                      <p>{selectedRequest.accountHolderName || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Account Number</p>
                      <p>{selectedRequest.accountNumber || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">IFSC Code</p>
                      <p>{selectedRequest.ifscCode || "N/A"}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <Label className="font-semibold">Documents</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {selectedRequest.businessLogo && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Business Logo</p>
                      <img
                        src={selectedRequest.businessLogo}
                        alt="Logo"
                        className="max-h-32 border rounded"
                      />
                    </div>
                  )}
                  {selectedRequest.gstCertificate && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">GST Certificate</p>
                      <a
                        href={selectedRequest.gstCertificate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        View Document
                      </a>
                    </div>
                  )}
                  {selectedRequest.panCard && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">PAN Card</p>
                      <a
                        href={selectedRequest.panCard}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        View Document
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {selectedRequest.rejectionReason && (
                <div className="pt-4 border-t">
                  <Label className="font-semibold text-red-600">Rejection Reason</Label>
                  <p className="mt-2">{selectedRequest.rejectionReason}</p>
                </div>
              )}

              {selectedRequest.adminNotes && (
                <div className="pt-4 border-t">
                  <Label className="font-semibold">Admin Notes</Label>
                  <p className="mt-2">{selectedRequest.adminNotes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Approve" : "Reject"} Store Request
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? "This will create a store and promote the user to admin role"
                : "Provide a reason for rejecting this store request"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {actionType === "reject" && (
              <div>
                <Label htmlFor="rejectionReason">
                  Rejection Reason <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="rejectionReason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why this request is being rejected..."
                  rows={4}
                />
              </div>
            )}

            <div>
              <Label htmlFor="adminNotes">Admin Notes (Optional)</Label>
              <Textarea
                id="adminNotes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Internal notes about this request..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={actionType === "approve" ? "default" : "destructive"}
              onClick={submitAction}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : actionType === "approve" ? (
                "Approve Store"
              ) : (
                "Reject Request"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
