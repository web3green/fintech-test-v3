
import React from 'react';
import { Calendar, User, Clock } from 'lucide-react';

interface BlogPostHeaderProps {
  post: any;
  getLocalizedContent: (content: any) => string;
}

export const BlogPostHeader = ({ post, getLocalizedContent }: BlogPostHeaderProps) => {
  if (!post) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
      <div className="flex items-center">
        <User className="h-4 w-4 mr-1" />
        <span>{post.author}</span>
      </div>
      <div className="flex items-center">
        <Calendar className="h-4 w-4 mr-1" />
        <span>{post.date}</span>
      </div>
      <div className="flex items-center">
        <Clock className="h-4 w-4 mr-1" />
        <span>{post.readingTime}</span>
      </div>
    </div>
  );
};
