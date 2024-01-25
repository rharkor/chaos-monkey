import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { getNodesResponseSchema } from "@/lib/schemas/nodes"
import { ensureLoggedIn, handleApiError } from "@/lib/utils/server-utils"
import { apiInputFromSchema } from "@/types"

export const getNodes = async ({ ctx: { session } }: apiInputFromSchema<undefined>) => {
  try {
    ensureLoggedIn(session)

    const nodes = await prisma.node.findMany({
      include: {
        pingResults: {
          take: 20,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    const data: z.infer<ReturnType<typeof getNodesResponseSchema>> = {
      nodes: nodes.map((node) => ({
        id: node.id,
        name: node.name,
        ip: node.ip,
        results: node.pingResults.map((result) => ({
          id: result.id,
          status: result.status,
          createdAt: result.createdAt.toISOString(),
        })),
      })),
    }
    return data
  } catch (error: unknown) {
    return handleApiError(error)
  }
}
