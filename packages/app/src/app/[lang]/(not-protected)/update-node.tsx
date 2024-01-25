"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import FormField from "@/components/ui/form"
import { useDictionary } from "@/contexts/dictionary/utils"
import { updateNodeSchema } from "@/lib/schemas/nodes"
import { trpc } from "@/lib/trpc/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react"

const formSchema = updateNodeSchema

export default function UpdateNode({ id, name, ip }: { id: string; name: string; ip: string }) {
  const dictionary = useDictionary()
  const utils = trpc.useUtils()

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

  const updateNodeMutation = trpc.node.updateNode.useMutation()

  const form = useForm<z.infer<ReturnType<typeof formSchema>>>({
    resolver: zodResolver(formSchema(dictionary)),
    values: {
      id,
      name,
      ip,
    },
  })

  const onSubmit = async (data: z.infer<ReturnType<typeof formSchema>>) => {
    await updateNodeMutation.mutateAsync(data)
    utils.node.invalidate()
    onClose()
  }

  useEffect(() => {
    form.reset()
  }, [updateNodeMutation.isSuccess, form])

  return (
    <>
      <Button onPress={onOpen} color="warning">
        {dictionary.updateNode}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{dictionary.updateNode}</ModalHeader>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <ModalBody>
                  <FormField
                    name="name"
                    label={dictionary.nodeName}
                    placeholder="My Node"
                    form={form}
                    type="text"
                    isRequired
                  />
                  <FormField
                    name="ip"
                    form={form}
                    type="text"
                    label={dictionary.nodeIp}
                    placeholder="http://yourdomain.com"
                    isRequired
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="default" variant="light" onPress={onClose}>
                    {dictionary.cancel}
                  </Button>
                  <Button color="warning" type="submit" isLoading={updateNodeMutation.isLoading}>
                    {dictionary.update}
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
