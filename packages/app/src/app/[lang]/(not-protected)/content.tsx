"use client"

import { useState } from "react"
import { z } from "zod"

import { useDictionary } from "@/contexts/dictionary/utils"
import { getNodesResponseSchema } from "@/lib/schemas/nodes"
import { trpc } from "@/lib/trpc/client"
import { Button, Input, Spinner } from "@nextui-org/react"

import AddNode from "./add-node"
import Node from "./node"

export default function NodesPageContent({ isLoggedIn }: { isLoggedIn: boolean }) {
  const dictionary = useDictionary()
  const nodes = trpc.node.getNodes.useQuery(undefined, {
    refetchInterval: 15000,
  })
  const utils = trpc.useUtils()
  const session = trpc.node.getSession.useQuery(undefined)
  const updateSessionMutation = trpc.node.updateSession.useMutation()
  const deleteSessionDataMutation = trpc.node.deleteSession.useMutation()

  const handleToggleSession = async () => {
    if (!session.data) return
    await updateSessionMutation.mutateAsync({
      enabled: !session.data.enabled,
      id: session.data.id,
    })
    utils.node.invalidate()
  }

  const handleDeleteSessionData = async () => {
    if (!session.data) return
    await deleteSessionDataMutation.mutateAsync()
    utils.node.invalidate()
  }

  const [search, setSearch] = useState("")

  const nodesFilled:
    | (z.infer<ReturnType<typeof getNodesResponseSchema>>["nodes"][number] & {
        rank: number
      })[]
    | null = nodes.data
    ? nodes.data.nodes
        .sort((a, b) => b.points - a.points)
        .map((node, index) => ({
          ...node,
          rank: index + 1,
        }))
    : null

  return (
    <div className="flex flex-1 flex-col gap-8">
      <div className="flex flex-row justify-between">
        <h1 className="text-4xl font-bold">{dictionary.homePage.title}</h1>
        {isLoggedIn && (
          <div className="flex flex-row justify-end gap-2">
            <Button
              isDisabled={session.isLoading || session.data?.enabled}
              onClick={handleDeleteSessionData}
              isLoading={deleteSessionDataMutation.isLoading}
              color="danger"
              variant="flat"
            >
              {dictionary.deleteSessionData}
            </Button>
            <Button
              isDisabled={session.isLoading}
              onClick={handleToggleSession}
              isLoading={updateSessionMutation.isLoading || deleteSessionDataMutation.isLoading}
              color={session.data?.enabled ? "danger" : "success"}
            >
              {session.data?.enabled ? dictionary.disable : dictionary.enable} session
            </Button>
            <AddNode />
          </div>
        )}
      </div>
      <Input placeholder="Search..." value={search} onValueChange={setSearch} />
      <div className="relative flex flex-1 flex-row flex-wrap gap-2">
        {nodesFilled ? (
          nodesFilled
            .filter((node) => node.name.toLowerCase().includes(search.toLowerCase()))
            .map((node) => <Node key={node.id} node={node} isLoggedIn={isLoggedIn} />)
        ) : (
          <Spinner className="absolute left-1/2 top-1/2 h-max -translate-x-1/2 -translate-y-1/2" />
        )}
      </div>
    </div>
  )
}
