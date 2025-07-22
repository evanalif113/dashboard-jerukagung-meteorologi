"use client"

import { AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
  error: Error
}

export default function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md border-2 border-destructive/20 shadow-md">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-xl font-semibold mb-2">Error loading data</h3>
          <p className="text-muted-foreground text-center mb-4">
            {error.message || "There was a problem fetching the weather data."}
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </CardContent>
      </Card>
    </div>
  )
}
