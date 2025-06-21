"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, AlertCircle, ExternalLink } from "lucide-react"

interface PostScraperProps {
  subreddit: string
  onComplete: (data: { posts: any[] }) => void
}

export default function PostScraper({ subreddit, onComplete }: PostScraperProps) {
  const [isScrapingActive, setIsScrapingActive] = useState(false)
  const [progress, setProgress] = useState(0)
  const [scrapedPosts, setScrapedPosts] = useState<any[]>([])
  const [currentStatus, setCurrentStatus] = useState("")
  const [error, setError] = useState("")

  const startScraping = async () => {
    setIsScrapingActive(true)
    setError("")
    setProgress(0)
    setCurrentStatus("Initializing Puppeteer...")

    try {
      const response = await fetch("/api/scrape-reddit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subreddit, postLimit: 50 }),
      })

      if (!response.ok) {
        throw new Error("Failed to start scraping")
      }

      // Smooth progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const remaining = 100 - prev;
          if (remaining < 5) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + remaining * 0.01;
        });
      }, 500);

      const statusMessages = [
        "Launching browser...",
        "Navigating to Reddit...",
        "Loading subreddit posts...",
        "Extracting post data...",
        "Processing content...",
        "Finalizing results...",
      ]

      let messageIndex = 0
      const statusInterval = setInterval(() => {
        if (messageIndex < statusMessages.length - 1) {
          setCurrentStatus(statusMessages[messageIndex])
          messageIndex++
        } else {
          clearInterval(statusInterval)
        }
      }, 2000)

      const data = await response.json()

      clearInterval(progressInterval)
      clearInterval(statusInterval)

      setProgress(100)
      setCurrentStatus("Scraping completed!")
      setScrapedPosts(data.posts)

      setTimeout(() => {
        setIsScrapingActive(false)
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setIsScrapingActive(false)
    }
  }

  const handleComplete = () => {
    onComplete({ posts: scrapedPosts })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-slate-900 mb-2">Ready to scrape r/{subreddit}</h3>
        <p className="text-slate-600">This will use Puppeteer to extract posts, titles, content, and metadata</p>
      </div>

      {!isScrapingActive && scrapedPosts.length === 0 && (
        <div className="text-center">
          <Button onClick={startScraping} size="lg" className="bg-green-600 hover:bg-green-700 text-white">
            Start Scraping
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {isScrapingActive && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center mb-4">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
              <span className="text-lg font-medium">Scraping in Progress</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>{currentStatus}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="text-center text-sm text-slate-600">
                <p>Please wait while we extract posts from Reddit...</p>
                <p className="text-xs mt-1">This may take 1-3 minutes depending on the subreddit size</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center text-red-700">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="font-medium">Scraping Failed</span>
            </div>
            <p className="text-red-600 mt-1">{error}</p>
            <Button onClick={startScraping} variant="outline" className="mt-3 bg-white text-red-700 border-red-300">
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {scrapedPosts.length > 0 && !isScrapingActive && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-green-700">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">Scraping Completed</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {scrapedPosts.length} posts extracted
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">Sample Post Preview</h4>
                <div className="text-sm text-slate-600 space-y-1">
                  <p>
                    <strong>Title:</strong> {scrapedPosts[0]?.title?.substring(0, 60)}...
                  </p>
                  <p>
                    <strong>Score:</strong> {scrapedPosts[0]?.score} upvotes
                  </p>
                  <p>
                    <strong>Comments:</strong> {scrapedPosts[0]?.comments} comments
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">Extraction Summary</h4>
                <div className="text-sm text-slate-600 space-y-1">
                  <p>✓ Post titles and content</p>
                  <p>✓ Engagement metrics</p>
                  <p>✓ Timestamps and metadata</p>
                  <p>✓ Author information</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button onClick={handleComplete} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Continue to Analysis
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
