"use client"
import { Badge } from "@/components/ui/badge"
import { Input, InputProps } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { XIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { Dispatch, forwardRef, SetStateAction, useState } from "react"
import { useFormContext } from "react-hook-form"
type InputTagsProps = InputProps & {
    value: string[]
    onChange: Dispatch<SetStateAction<string[]>>
}
export const InputTags = forwardRef<HTMLInputElement, InputTagsProps>(({ onChange, value, ...props }, ref) => {
    const [pendingDataPoint, setPendingDataPoint] = useState("")
    const [focused, setFocused] = useState(false)

    function addPendingDataPoint() {
        if (pendingDataPoint) {
            const newDataPoints = new Set([...value, pendingDataPoint])
            onChange(Array.from(newDataPoints))
            setPendingDataPoint("")
        }
    }

    const { setFocus } = useFormContext()
    return (
        <div className={cn("flex min-h-5 w-full rounded-md border border-input bg-background text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            focused
                ? "ring-offset-2 outline-none ring-ring ring-2" :
                "ring-offset-0 outline-none ring-ring ring-0")}
            onClick={() => setFocus("tags")}>
            <motion.div className="rounded-md min-h-[2.5rem] p-2 flex gap-2
            flex-wrap items-center">
                <AnimatePresence>
                    {value.map((tag) => (
                        <motion.div
                            animate={{ scale: 1 }}
                            initial={{ scale: 0 }}
                            exit={{ scale: 0 }}
                            key={tag}
                        >
                            <Badge variant={"secondary"}>{tag}</Badge>
                            <button
                                className="w-3 ml-2"
                                onClick={() => onChange(value.filter((i) => i !== tag))}>
                                <XIcon className="w-3" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
            <div className="flex">
                <Input
                    className="focus-visible:border-transparent
                    border-transparent focus-visible:ring-0
                    focus-visible:ring-offset-0"
                    placeholder="Add tags"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault()
                            addPendingDataPoint()
                        }
                        if (e.key === "Backspace" &&
                            !pendingDataPoint &&
                            value.length > 0) {
                            e.preventDefault()
                            const newValue = [...value]
                            newValue.pop()
                            onChange(newValue)
                        }
                    }}
                    value={pendingDataPoint}
                    onFocus={(e) => setFocused(true)}
                    onBlurCapture={(e) => setFocused(false)}
                    onChange={(e) => setPendingDataPoint(e.target.value)}
                    {...props}
                />
            </div>
        </div>
    )
})

InputTags.displayName = "InputTags"