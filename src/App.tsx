import { useState } from "react";
import SubredditSelector from "@/components/subreddit-selector";
import PostScraper from "@/components/post-scraper";
import AnalysisResults from "@/components/analysis-results";
import PostGenerator from "@/components/post-generator";
import PostRanking from "@/components/post-ranking";
import RAGUpload from "@/components/rag-upload";
import "./index.css";

type AppState =
  | "SUBREDDIT_SELECTION"
  | "POST_SCRAPING"
  | "ANALYSIS_RESULTS"
  | "RAG_UPLOAD"
  | "POST_GENERATION"
  | "POST_RANKING";

export function App() {
  const [appState, setAppState] = useState<AppState>("SUBREDDIT_SELECTION");
  const [subreddit, setSubreddit] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [ragContext, setRagContext] = useState<any>(null);
  const [generatedPosts, setGeneratedPosts] = useState<any[]>([]);

  const handleSubredditSelection = (data: {
    subreddit: string;
    postLimit: number;
  }) => {
    setSubreddit(data.subreddit);
    setAppState("POST_SCRAPING");
  };

  const handleScrapingComplete = (data: { posts: any[] }) => {
    setPosts(data.posts);
    setAppState("ANALYSIS_RESULTS");
  };

  const handleAnalysisComplete = (data: { analysis: any }) => {
    setAnalysis(data.analysis);
    setAppState("RAG_UPLOAD");
  };

  const handleRagUploadComplete = (data: { context: any }) => {
    setRagContext(data.context);
    setAppState("POST_GENERATION");
  };

  const handlePostGenerationComplete = (data: { posts: any[] }) => {
    setGeneratedPosts(data.posts);
    setAppState("POST_RANKING");
  };

  const renderStep = () => {
    switch (appState) {
      case "SUBREDDIT_SELECTION":
        return <SubredditSelector onComplete={handleSubredditSelection} />;
      case "POST_SCRAPING":
        return (
          <PostScraper
            subreddit={subreddit}
            onComplete={handleScrapingComplete}
          />
        );
      case "ANALYSIS_RESULTS":
        return (
          <AnalysisResults
            posts={posts}
            onComplete={handleAnalysisComplete}
          />
        );
      case "RAG_UPLOAD":
        return <RAGUpload onComplete={handleRagUploadComplete} />;
      case "POST_GENERATION":
        return (
          <PostGenerator
            analysis={analysis}
            ragContext={ragContext}
            onComplete={handlePostGenerationComplete}
          />
        );
      case "POST_RANKING":
        return <PostRanking posts={generatedPosts} analysis={analysis} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          AI-Powered Content Generation
        </h1>
        {renderStep()}
      </div>
    </div>
  );
}

export default App;
