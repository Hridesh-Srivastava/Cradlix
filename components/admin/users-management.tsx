"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { MoreHorizontal } from "lucide-react"

type UserRow = {
  id: string
  email: string
  name: string
  role: string
  createdAt?: string
}

const ROLE_LABEL: Record<string, string> = {
  'customer': 'Customer',
  'moderator': 'Moderator',
  'admin': 'Admin',
  'super-admin': 'Super Admin',
}

export function UsersManagement() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const load = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search.trim()) params.set('search', search.trim())
      const res = await fetch(`/api/admin/users?${params.toString()}`)
      if (!res.ok) throw new Error(res.status === 401 ? 'Unauthorized' : `Failed (${res.status})`)
      const j = await res.json()
      setUsers(j.users || [])
    } catch (e: any) {
      toast({ title: 'Load failed', description: e.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const doUpdate = async (id: string, role: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      })
      if (!res.ok) throw new Error(res.status === 401 ? 'Unauthorized' : `Failed (${res.status})`)
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)))
      toast({ title: 'User updated', description: `Role set to ${ROLE_LABEL[role] || role}` })
    } catch (e: any) {
      toast({ title: 'Update failed', description: e.message, variant: 'destructive' })
    }
  }

  const doReject = async (id: string) => {
    // Reject = set back to customer
    await doUpdate(id, 'customer')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Input placeholder="Search users by name/email" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button onClick={load}>Search</Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4}>Loading...</TableCell></TableRow>
            ) : users.length === 0 ? (
              <TableRow><TableCell colSpan={4}>No users found</TableCell></TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell className="font-mono text-sm">{u.email}</TableCell>
                  <TableCell><Badge>{ROLE_LABEL[u.role] || u.role}</Badge></TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => doUpdate(u.id, 'moderator')}>Approve as Moderator</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => doUpdate(u.id, 'admin')}>Promote to Admin</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => doUpdate(u.id, 'super-admin')}>Make Super Admin</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => doReject(u.id)} className="text-destructive">Reject (Back to Customer)</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
