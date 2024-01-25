import { getServerSession } from "next-auth"
import { Locale } from "i18n-config"

import NavSettings from "@/components/nav-settings"
import { nextAuthOptions } from "@/lib/auth"

import NodesPageContent from "./content"

export default async function Home({
  params: { lang },
}: {
  params: {
    lang: Locale
  }
}) {
  const session = await getServerSession(nextAuthOptions)

  return (
    <main className="container m-auto flex min-h-screen flex-1 flex-col gap-3 p-4 pt-16">
      <NavSettings lang={lang} />
      <NodesPageContent isLoggedIn={!!session} />
    </main>
  )
}
