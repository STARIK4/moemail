import { Header } from "@/components/layout/header"
import { ThreeColumnLayout } from "@/components/emails/three-column-layout"
import { NoPermissionDialog } from "@/components/no-permission-dialog"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { hasPermission, PERMISSIONS, type Role } from "@/lib/permissions"
import type { Locale } from "@/i18n/config"

export const runtime = "edge"

export default async function MoePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeFromParams } = await params
  const locale = localeFromParams as Locale
  const session = await auth()
  
  if (!session?.user) {
    redirect(`/${locale}`)
  }

  // auth() already resolves the user's roles. Reusing them avoids a second
  // NextAuth pass and another D1 lookup, which can exceed Pages' CPU limit.
  const canManageEmail = hasPermission(
    (session.user.roles ?? []).map(({ name }) => name as Role),
    PERMISSIONS.MANAGE_EMAIL
  )

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 h-screen">
      <div className="container mx-auto h-full px-4 lg:px-8 max-w-[1600px]">
        <Header />
        <main className="h-full">
          <ThreeColumnLayout />
          {!canManageEmail && <NoPermissionDialog />}
        </main>
      </div>
    </div>
  )
}
