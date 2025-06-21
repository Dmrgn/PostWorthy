import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users } from "lucide-react"

interface SubredditSelectorProps {
  onComplete: (data: { subreddit: string; postLimit: number }) => void
}

const popularSubreddits = [
  { name: "marketing", members: "2.1M", description: "Marketing strategies and discussions" },
  { name: "entrepreneur", members: "1.8M", description: "Entrepreneurship and business" },
  { name: "socialmedia", members: "450K", description: "Social media marketing" },
  { name: "content_marketing", members: "180K", description: "Content marketing strategies" },
  { name: "digital_marketing", members: "320K", description: "Digital marketing discussions" },
  { name: "startups", members: "1.2M", description: "Startup community" },
]

export default function SubredditSelector({ onComplete }: SubredditSelectorProps) {
  const [selectedSubreddit, setSelectedSubreddit] = useState("")
  const [postLimit, setPostLimit] = useState(50)
  const [customSubreddit, setCustomSubreddit] = useState("")

  const handleSubmit = () => {
    const subreddit = selectedSubreddit || customSubreddit
    if (subreddit) {
      onComplete({ subreddit: subreddit.replace("r/", ""), postLimit })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium mb-4 block">Choose a Popular Subreddit</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularSubreddits.map((sub) => (
            <Card
              key={sub.name}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedSubreddit === sub.name ? "ring-2 ring-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => {
                setSelectedSubreddit(sub.name)
                setCustomSubreddit("")
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-slate-900">r/{sub.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    <Users className="w-3 h-3 mr-1" />
                    {sub.members}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600">{sub.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="h-px bg-slate-200 flex-1" />
        <span className="text-sm text-slate-500">OR</span>
        <div className="h-px bg-slate-200 flex-1" />
      </div>

      <div>
        <Label htmlFor="custom-subreddit" className="text-base font-medium">
          Enter Custom Subreddit
        </Label>
        <Input
          id="custom-subreddit"
          placeholder="e.g., technology, business, etc."
          value={customSubreddit}
          onChange={(e) => {
            setCustomSubreddit(e.target.value)
            setSelectedSubreddit("")
          }}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="post-limit" className="text-base font-medium">
          Number of Posts to Analyze
        </Label>
        <div className="flex items-center gap-4 mt-2">
          <Input
            id="post-limit"
            type="number"
            min="10"
            max="200"
            value={postLimit}
            onChange={(e) => setPostLimit(Number.parseInt(e.target.value) || 50)}
            className="w-32"
          />
          <span className="text-sm text-slate-500">Recommended: 50-100 posts</span>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSubmit}
          disabled={!selectedSubreddit && !customSubreddit}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Continue to Scraping
          <TrendingUp className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
