"use client"

import { trpc } from "@/lib/trpc/client"

import AddNode from "./add-node"
import Node from "./node"

export default function NodesPageContent() {
  const nodes = trpc.node.getNodes.useQuery()

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row justify-end">
        <AddNode />
      </div>
      <div className="flex flex-row flex-wrap gap-2">
        {nodes.data?.nodes.map((node) => <Node key={node.id} node={node} />)}
      </div>
    </div>
  )
}
