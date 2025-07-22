import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md border-2 border-primary/20 shadow-md">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <h3 className="text-xl font-semibold mb-2">Loading weather data...</h3>
          <p className="text-muted-foreground text-center">Fetching the latest weather information from the station.</p>
        </CardContent>
      </Card>
    </div>
  )
}
