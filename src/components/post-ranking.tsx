"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Heart, Share, Copy, Download, Star } from "lucide-react"

interface PostRankingProps {
  posts: any[]
  analysis: any
}

export default function PostRanking({ posts, analysis }: PostRankingProps) {
  const [sortBy, setSortBy] = useState("overall")
  const [filterBy, setFilterBy] = useState("all")
  const [sortedPosts, setSortedPosts] = useState(posts)
  const [error, setError] = useState("")

  useEffect(() => {
    try {
      let filtered = posts

      // Apply filters
      if (filterBy !== "all") {
        filtered = posts.filter(post => post.format === filterBy)
      }

      // Apply sorting
      const sorted = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case "engagement":
            return b.engagement_prediction - a.engagement_prediction
          case "relevance":
            return b.relevance_score - a.relevance_score
          case "brand":
            return b.brand_alignment - a.brand_alignment
          case "overall":
          default:
            return b.score - a.score
        }
      })

      setSortedPosts(sorted)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
    }
  }, [sortBy, filterBy, posts])

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const exportPosts = (limit?: number) => {
    try {
      const postsToExport = limit ? sortedPosts.slice(0, limit) : sortedPosts
      const exportData = postsToExport.map((post, index) => ({
        rank: index + 1,
        content: post.content,
        hashtags: post.hashtags.join(" "),
        format: post.format,
        scores: {
          overall: post.score,
          engagement: post.engagement_prediction,
          relevance: post.relevance_score,
          brand_alignment: post.brand_alignment,
        },
      }))

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `generated-posts${limit ? "-top-10" : ""}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
    }
  }

  const copyAllContent = () => {
    const allContent = sortedPosts
      .map(
        (post, index) =>
          `Rank #${index + 1}\nScore: ${post.score}\n\n${
            post.content
          }\n\nHashtags: ${post.hashtags.join(" ")}`
      )
      .join("\n\n---\n\n");
    copyToClipboard(allContent);
    alert("All post content copied to clipboard!");
  };

  const startNewAnalysis = () => {
    window.location.reload();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100"
    if (score >= 60) return "text-yellow-600 bg-yellow-100"
    return "text-red-600 bg-red-100"
  }

  const getRankBadge = (index: number) => {
    if (index === 0) return <Badge className="bg-yellow-500 text-white">🥇 #1</Badge>
    if (index === 1) return <Badge className="bg-gray-400 text-white">🥈 #2</Badge>
    if (index === 2) return <Badge className="bg-amber-600 text-white">🥉 #3</Badge>
    return <Badge variant="outline">#{index + 1}</Badge>
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>Error: {error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-medium text-slate-900 mb-2">Ranked Posts Ready for Use</h3>
        <p className="text-slate-600">
          AI-ranked content based on engagement potential, relevance, and brand alignment
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overall">Overall Score</SelectItem>
              <SelectItem value="engagement">Engagement Potential</SelectItem>
              <SelectItem value="relevance">Relevance Score</SelectItem>
              <SelectItem value="brand">Brand Alignment</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Formats</SelectItem>
              <SelectItem value="text">Text Posts</SelectItem>
              <SelectItem value="question">Questions</SelectItem>
              <SelectItem value="tip">Tips</SelectItem>
              <SelectItem value="story">Stories</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={() => exportPosts()}
          variant="outline"
          className="bg-white text-slate-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Export All
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{sortedPosts.length}</div>
            <div className="text-sm text-slate-600">Total Posts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(sortedPosts.reduce((acc, post) => acc + post.score, 0) / sortedPosts.length)}
            </div>
            <div className="text-sm text-slate-600">Avg Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {sortedPosts.filter((post) => post.score >= 80).length}
            </div>
            <div className="text-sm text-slate-600">High Quality</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(sortedPosts.reduce((acc, post) => acc + post.estimated_reach, 0) / 1000)}K
            </div>
            <div className="text-sm text-slate-600">Est. Reach</div>
          </CardContent>
        </Card>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {sortedPosts.map((post, index) => (
          <Card key={index} className={`${index < 3 ? "border-2 border-blue-200" : ""}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getRankBadge(index)}
                  <Badge variant="outline" className="capitalize">
                    {post.format}
                  </Badge>
                </div>
                <div>{post.title}</div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={`px-2 py-1 text-xs ${getScoreColor(post.score)}`}
                  >
                    {post.score}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(post.content)}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">{post.content}</p>

                <div className="flex flex-wrap gap-1">
                  {post.hashtags.map((tag: string, i: number) => (
                    <span key={i} className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t">
                  <div className="text-center">
                    <div className="flex items-center justify-center text-slate-600 mb-1">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span className="text-xs">Engagement</span>
                    </div>
                    <div className="font-medium">{Math.round(post.engagement_prediction)}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center text-slate-600 mb-1">
                      <Star className="w-4 h-4 mr-1" />
                      <span className="text-xs">Relevance</span>
                    </div>
                    <div className="font-medium">{post.relevance_score}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center text-slate-600 mb-1">
                      <Heart className="w-4 h-4 mr-1" />
                      <span className="text-xs">Brand Fit</span>
                    </div>
                    <div className="font-medium">{post.brand_alignment}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center text-slate-600 mb-1">
                      <Share className="w-4 h-4 mr-1" />
                      <span className="text-xs">Est. Reach</span>
                    </div>
                    <div className="font-medium">{(post.estimated_reach / 1000).toFixed(1)}K</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="text-center pt-6 border-t">
        <div className="space-y-4">
          <p className="text-slate-600">
            🎉 Your AI-powered content analysis and generation is complete!
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              onClick={() => exportPosts(10)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Top 10
            </Button>
            <Button
              onClick={copyAllContent}
              variant="outline"
              className="bg-white text-slate-700"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy All Content
            </Button>
            <Button
              onClick={startNewAnalysis}
              variant="outline"
              className="bg-white text-slate-700"
            >
              Start New Analysis
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
