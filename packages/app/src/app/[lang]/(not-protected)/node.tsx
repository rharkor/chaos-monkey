"use client"

import { z } from "zod"

import { useDictionary } from "@/contexts/dictionary/utils"
import { getNodesResponseSchema } from "@/lib/schemas/nodes"
import { cn } from "@/lib/utils"
import { Card, CardBody, CardFooter, CardHeader, Link, Tooltip } from "@nextui-org/react"

import DeleteNode from "./delete-node"
import UpdateNode from "./update-node"

export default function Node({
  node,
  isLoggedIn,
}: {
  node: z.infer<ReturnType<typeof getNodesResponseSchema>>["nodes"][number] & { rank: number }
  isLoggedIn: boolean
}) {
  const dictionary = useDictionary()

  const last20Status = node.results.slice(-20)
  const last20StatusFormatted = last20Status.map((status) => {
    return {
      isOk: parseInt(status.status) >= 200 && parseInt(status.status) < 300,
      date: new Date(status.createdAt).toLocaleString(),
      isSkel: false,
      code: status.status,
    }
  })
  const last20StatusFormattedWithEmpty = [
    ...Array(20 - last20StatusFormatted.length).fill({ isOk: false, date: "", isSkel: true, code: 0 }),
    ...last20StatusFormatted,
  ].reverse()

  return (
    <Card className="relative h-max min-w-[260px] max-w-[320px] flex-1">
      <CardHeader className="z-10 flex flex-col items-start gap-1">
        <p className="max-w-[220px] truncate">{node.name}</p>
        <span className="">
          (
          <Link
            href={`${node.ip.startsWith("http") ? "" : "http://"}${node.ip}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary/70 text-xs hover:underline"
          >
            {node.ip}
          </Link>
          )
        </span>
        <div className="absolute right-2 top-2">
          <p
            className={cn("text-muted-foreground text-xl font-medium", {
              "text-[#FFD700]": node.rank === 1,
              "text-[#C0C0C0]": node.rank === 2,
              "text-[#CD7F32]": node.rank === 3,
            })}
          >
            #{node.rank}
          </p>
        </div>
      </CardHeader>
      <CardBody className="z-10 flex flex-col gap-2">
        <p className="text-foreground text-center text-xl font-medium">
          {node.points}
          <span className="text-muted-foreground ml-1 text-xs">{dictionary.points}</span>
        </p>
        <div className="flex flex-row justify-center gap-1">
          {last20StatusFormattedWithEmpty.map((status, index) => (
            <Tooltip
              content={
                <>
                  {status.isSkel === false && (
                    <p>
                      {status.isOk ? dictionary.statusOk : dictionary.statusError}:{" "}
                      {status.code === "0" ? "Timeout" : status.code}
                    </p>
                  )}
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
        </div>
      </CardBody>
      {isLoggedIn && (
        <CardFooter className="z-10 flex flex-row items-center justify-center gap-2">
          <UpdateNode id={node.id} name={node.name} ip={node.ip} />
          <DeleteNode id={node.id} name={node.name} ip={node.ip} />
        </CardFooter>
      )}
      <div className="pointer-events-none absolute left-0 top-0 z-0 h-full w-full bg-gradient-to-b from-transparent to-black opacity-50" />
    </Card>
  )
}
