"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { searchHelpArticles, getSuggestedArticles } from "@/lib/customer-support/support-utils";
import { HelpArticle } from "@/lib/customer-support/support-utils";

interface HelpWidgetProps {
  articles: HelpArticle[];
  onContactSupport?: () => void;
}

export function HelpWidget({ articles, onContactSupport }: HelpWidgetProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<HelpArticle[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setResults(searchHelpArticles(query, articles));
    } else {
      setResults([]);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Help & Support</CardTitle>
        <CardDescription>Search our knowledge base or contact support</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Search for help..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {results.length > 0 && (
          <div className="space-y-2">
            {results.map((article) => (
              <Card key={article.id} className="p-4">
                <h3 className="font-semibold">{article.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{article.content}</p>
                <div className="flex gap-2 mt-2">
                  {article.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-muted px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
        {onContactSupport && (
          <Button onClick={onContactSupport} className="w-full">
            Contact Support
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
