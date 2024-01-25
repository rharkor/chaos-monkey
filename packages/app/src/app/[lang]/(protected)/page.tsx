import { Locale } from "i18n-config"

import NavSettings from "@/components/nav-settings"
import { getDictionary } from "@/lib/langs"

import NodesPageContent from "./content"

export default async function Home({
  params: { lang },
}: {
  params: {
    lang: Locale
  }
}) {
  const dictionary = await getDictionary(lang)

  return (
    <main className="container m-auto flex min-h-screen flex-1 flex-col gap-3 p-4 pt-16">
      <NavSettings lang={lang} />
      <h1 className="text-4xl font-bold">{dictionary.homePage.title}</h1>
      <NodesPageContent />
    </main>
  )
}
