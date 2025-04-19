import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import type { ChannelFormData } from "@/lib/db/schema/channels"

interface WebhookFieldsProps {
    form: UseFormReturn<ChannelFormData>
}

export function WebhookFields({ form }: WebhookFieldsProps) {
    return (
        <>
            <FormField
                control={form.control}
                name="webhook"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            默认 Webhook URL
                            <span className="text-red-500 ml-1">*</span>
                        </FormLabel>
                        <FormControl>
                            <Input
                                placeholder="https://api.example.com/send/xxx"
                                className="font-mono"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    )
} 