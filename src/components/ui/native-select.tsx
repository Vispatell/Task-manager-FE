import { NativeSelect as ChakraSelect } from "@chakra-ui/react"
import { forwardRef } from "react"
import { LuChevronDown } from "react-icons/lu"

export interface NativeSelectRootProps extends ChakraSelect.RootProps {
  icon?: React.ReactNode
}

export const NativeSelectRoot = forwardRef<
  HTMLDivElement,
  NativeSelectRootProps
>(function NativeSelect(props, ref) {
  const { icon, children, ...rest } = props
  return (
    <ChakraSelect.Root ref={ref} {...rest}>
      {children}
      <ChakraSelect.Indicator>
        {icon || <LuChevronDown />}
      </ChakraSelect.Indicator>
    </ChakraSelect.Root>
  )
})

export const NativeSelectField = ChakraSelect.Field
