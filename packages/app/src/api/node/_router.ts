import {
  addNodeResponseSchema,
  addNodeSchema,
  deleteNodeResponseSchema,
  deleteNodeSchema,
  deleteSessionResponseSchema,
  getNodesResponseSchema,
  getSessionResponseSchema,
  updateNodeResponseSchema,
  updateNodeSchema,
  updateSessionResponseSchema,
  updateSessionSchema,
} from "@/lib/schemas/nodes"
import { authenticatedProcedure, publicProcedure, router } from "@/lib/server/trpc"

import { addNode, deleteNode, deleteSession, updateNode, updateSession } from "./mutations"
import { getNodes, getSession } from "./queries"

export const nodeRouter = router({
  addNode: authenticatedProcedure.input(addNodeSchema()).output(addNodeResponseSchema()).mutation(addNode),
  deleteNode: authenticatedProcedure.input(deleteNodeSchema()).output(deleteNodeResponseSchema()).mutation(deleteNode),
  updateNode: authenticatedProcedure.input(updateNodeSchema()).output(updateNodeResponseSchema()).mutation(updateNode),
  getNodes: publicProcedure.output(getNodesResponseSchema()).query(getNodes),
  getSession: publicProcedure.output(getSessionResponseSchema()).query(getSession),
  updateSession: authenticatedProcedure
    .input(updateSessionSchema())
    .output(updateSessionResponseSchema())
    .mutation(updateSession),
  deleteSession: authenticatedProcedure.output(deleteSessionResponseSchema()).mutation(deleteSession),
})
