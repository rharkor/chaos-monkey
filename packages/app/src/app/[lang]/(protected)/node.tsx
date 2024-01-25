"use client"

import { z } from "zod"

import { useDictionary } from "@/contexts/dictionary/utils"
import { getNodesResponseSchema } from "@/lib/schemas/nodes"
import { cn } from "@/lib/utils"
import { Card, CardBody, CardFooter, CardHeader, Tooltip } from "@nextui-org/react"

import DeleteNode from "./delete-node"
import UpdateNode from "./update-node"

export default function Node({ node }: { node: z.infer<ReturnType<typeof getNodesResponseSchema>>["nodes"][number] }) {
  const dictionary = useDictionary()

  const last20Status = node.results.slice(-20)
  const last20StatusFormatted = last20Status.map((status) => {
    return {
      isOk: parseInt(status.status) >= 200 && parseInt(status.status) < 300,
      date: new Date(status.createdAt).toLocaleString(),
      isSkel: false,
    }
  })
  const last20StatusFormattedWithEmpty = [
    ...Array(20 - last20StatusFormatted.length).fill({ isOk: false, date: "", isSkel: true }),
    ...last20StatusFormatted,
  ].reverse()

  return (
    <Card>
      <CardHeader>
        <p>
          {node.name}
          <span className="text-muted-foreground ml-2 text-xs">({node.ip})</span>
        </p>
      </CardHeader>
      <CardBody className="flex flex-row gap-1">
        {last20StatusFormattedWithEmpty.map((status, index) => (
          <Tooltip
            content={
              <>
                {status.isSkel === false && <p>{status.isOk ? dictionary.statusOk : dictionary.statusError}</p>}
                <p>{status.date}</p>
              </>
            }
            key={index}
          >
            <div
              className={cn("h-5 w-2 rounded-full", {
                "bg-green-500": status.isOk,
                "bg-red-500": !status.isOk,
                "bg-muted-foreground animate-pulse": status.isSkel,
              })}
            />
          </Tooltip>
        ))}
      </CardBody>
      <CardFooter className="flex flex-row gap-2">
        <UpdateNode id={node.id} name={node.name} ip={node.ip} />
        <DeleteNode id={node.id} name={node.name} ip={node.ip} />
      </CardFooter>
    </Card>
  )
}
