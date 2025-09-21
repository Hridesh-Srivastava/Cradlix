import ExcelJS from "exceljs"
import { db } from "@/lib/db/postgres"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function buildUsersWorkbookBuffer() {
  // Fetch all users
  const all = await db.select().from(users)
  // Create workbook
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet("Users")
  ws.columns = [
    { header: "Name", key: "name", width: 26 },
    { header: "Email", key: "email", width: 30 },
    { header: "Role", key: "role", width: 14 },
    { header: "Status", key: "status", width: 14 },
    { header: "Created At", key: "createdAt", width: 24 },
  ]
  all
    .sort((a: any, b: any) => new Date(a.createdAt as any).getTime() - new Date(b.createdAt as any).getTime())
    .forEach((u: any) => {
      ws.addRow({
        name: u.name,
        email: u.email,
        role: (u as any).role || "customer",
        status: (u as any).status || "approved",
        createdAt: u.createdAt ? new Date(u.createdAt as any).toISOString() : "",
      })
    })
  return wb.xlsx.writeBuffer()
}
