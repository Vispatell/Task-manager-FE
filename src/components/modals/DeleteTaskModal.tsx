import { Button, Text, VStack } from '@chakra-ui/react'
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '../ui/dialog'

interface DeleteTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  taskTitle: string
  isLoading: boolean
}

export default function DeleteTaskModal({
  isOpen,
  onClose,
  onConfirm,
  taskTitle,
  isLoading,
}: DeleteTaskModalProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm()
    } catch (error) {
      console.error('Delete confirmation error:', error)
    }
  }

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => {
        if (!e.open && !isLoading) {
          onClose()
        }
      }}
      size="md"
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Task</DialogTitle>
          {!isLoading && <DialogCloseTrigger />}
        </DialogHeader>

        <DialogBody>
          <VStack align="start" gap={3}>
            <Text>Are you sure you want to delete this task?</Text>
            <Text 
              fontWeight="semibold" 
              color="gray.700" 
              _dark={{ color: 'gray.300' }}
              wordBreak="break-word"
              whiteSpace="normal"
              maxW="100%"
            >
              "{taskTitle}"
            </Text>
            <Text color="red.600" _dark={{ color: 'red.400' }} fontWeight="medium">
              This action cannot be undone.
            </Text>
          </VStack>
        </DialogBody>

        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </DialogActionTrigger>
          <Button
            colorScheme="red"
            onClick={handleConfirm}
            loading={isLoading}
            loadingText="Deleting..."
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  )
}
