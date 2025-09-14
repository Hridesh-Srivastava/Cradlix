import { db } from "@/lib/db/postgres"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

async function main() {
  const email = process.argv[2]
  const role = process.argv[3] || 'admin'
  if (!email) {
    console.error("Usage: tsx scripts/promote-user.ts <email> [role]")
    process.exit(1)
  }
  if (!['admin','moderator','super-admin','customer'].includes(role)) {
    console.error("Role must be one of: admin|moderator|super-admin|customer")
    process.exit(1)
  }

  const res = await db.update(users).set({ role }).where(eq(users.email, email)).returning({ id: users.id, email: users.email, role: users.role })
  if (res.length === 0) {
    console.error("No user found with email", email)
    process.exit(2)
  }
  console.log("Updated:", res[0])
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })
