
export const getLocalizedContent = (content: any, language: string) => {
  if (typeof content === 'object') {
    return content[language] || content.en;
  }
  return content;
};

export const getImageUrl = (imageUrl: string) => {
  if (imageUrl && imageUrl.startsWith('http')) {
    return imageUrl;
  }
  return 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop';
};
