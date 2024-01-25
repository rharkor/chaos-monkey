import {
  addNodeResponseSchema,
  addNodeSchema,
  deleteNodeResponseSchema,
  deleteNodeSchema,
  getNodesResponseSchema,
  updateNodeResponseSchema,
  updateNodeSchema,
} from "@/lib/schemas/nodes"
import { authenticatedProcedure, router } from "@/lib/server/trpc"

import { addNode, deleteNode, updateNode } from "./mutations"
import { getNodes } from "./queries"

export const nodeRouter = router({
  addNode: authenticatedProcedure.input(addNodeSchema()).output(addNodeResponseSchema()).mutation(addNode),
  deleteNode: authenticatedProcedure.input(deleteNodeSchema()).output(deleteNodeResponseSchema()).mutation(deleteNode),
  updateNode: authenticatedProcedure.input(updateNodeSchema()).output(updateNodeResponseSchema()).mutation(updateNode),
  getNodes: authenticatedProcedure.output(getNodesResponseSchema()).query(getNodes),
})
