import { IconButton as ChakraIconButton } from "@chakra-ui/react"
import { forwardRef } from "react"
import { LuX } from "react-icons/lu"
import type { IconButtonProps } from "@chakra-ui/react"

export interface CloseButtonProps extends IconButtonProps {}

export const CloseButton = forwardRef<HTMLButtonElement, CloseButtonProps>(
  function CloseButton(props, ref) {
    return (
      <ChakraIconButton variant="ghost" aria-label="Close" ref={ref} {...props}>
        <LuX />
      </ChakraIconButton>
    )
  },
)
