"use client"

import { useDictionary } from "@/contexts/dictionary/utils"
import { trpc } from "@/lib/trpc/client"
import { Button } from "@nextui-org/react"

import AddNode from "./add-node"
import Node from "./node"

export default function NodesPageContent() {
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

  return (
    <div className="flex flex-col gap-2">
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
      <div className="flex flex-row flex-wrap gap-2">
        {nodes.data?.nodes.map((node) => <Node key={node.id} node={node} />)}
      </div>
    </div>
  )
}
