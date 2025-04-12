import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'project' | 'internship';
  url: string;
}

interface RecommendationsProps {
  recommendations: Recommendation[];
}

export function Recommendations({ recommendations }: RecommendationsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {recommendations.map((recommendation) => (
        <Card key={recommendation.id}>
          <CardHeader>
            <CardTitle>{recommendation.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">{recommendation.description}</p>
            <a 
              href={recommendation.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
            >
              View {recommendation.type}
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 
export const recommendations = {
  searchExperiences: async (query: string) => {
    const res = await fetch(`/api/recommendations/search-experiences?q=${query}`);
    return await res.json();
  },
};
