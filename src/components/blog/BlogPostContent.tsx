
import React from 'react';

interface BlogPostContentProps {
  language: string;
  post: any;
  getLocalizedContent: (content: any) => string;
}

export const BlogPostContent = ({ language, post, getLocalizedContent }: BlogPostContentProps) => {
  if (!post) return null;

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium">
        {getLocalizedContent(post.excerpt)}
      </p>
      
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p>
          {language === 'en' 
            ? `In today's rapidly evolving global business landscape, understanding the intricacies of ${getLocalizedContent(post.category).toLowerCase()} is more crucial than ever. This comprehensive guide explores the key aspects that businesses need to consider in 2025.`
            : `В сегодняшнем быстро меняющемся глобальном бизнес-ландшафте понимание тонкостей ${getLocalizedContent(post.category).toLowerCase()} важнее, чем когда-либо. Это комплексное руководство исследует ключевые аспекты, которые бизнесу необходимо учитывать в 2025 году.`}
        </p>
        
        <h3>
          {language === 'en' ? 'Key Considerations for 2025' : 'Ключевые соображения на 2025 год'}
        </h3>
        
        <p>
          {language === 'en'
            ? `The regulatory environment has seen significant changes in recent months, with new frameworks being implemented across various jurisdictions. Companies must stay informed about these changes to ensure compliance and optimize their operations.`
            : `Нормативно-правовая среда претерпела значительные изменения в последние месяцы, с новыми рамками, внедряемыми в различных юрисдикциях. Компании должны быть в курсе этих изменений, чтобы обеспечить соответствие требованиям и оптимизировать свою деятельность.`}
        </p>
        
        <p>
          {language === 'en'
            ? `Technology continues to play a pivotal role in shaping how businesses approach ${post.tags[0]} strategies. From blockchain applications to AI-driven analytics, the technological landscape offers both challenges and opportunities.`
            : `Технологии продолжают играть ключевую роль в формировании подходов бизнеса к стратегиям ${post.tags[0]}. От применения блокчейна до аналитики на основе ИИ, технологический ландшафт предлагает как вызовы, так и возможности.`}
        </p>
        
        <h3>
          {language === 'en' ? 'Market Trends and Predictions' : 'Рыночные тенденции и прогнозы'}
        </h3>
        
        <p>
          {language === 'en'
            ? `Experts predict that the ${getLocalizedContent(post.category).toLowerCase()} sector will continue to grow at a rate of approximately 15% annually through 2027. This growth is driven by increasing demand for transparent and efficient business structures that can operate across multiple jurisdictions.`
            : `Эксперты прогнозируют, что сектор ${getLocalizedContent(post.category).toLowerCase()} продолжит расти примерно на 15% ежегодно до 2027 года. Этот рост обусловлен растущим спросом на прозрачные и эффективные бизнес-структуры, которые могут работать в нескольких юрисдикциях.`}
        </p>
        
        <p>
          {language === 'en'
            ? `As we move further into 2025, businesses that adapt quickly to these changes and leverage new opportunities will be best positioned for success in the global marketplace.`
            : `По мере продвижения в 2025 год, предприятия, которые быстро адаптируются к этим изменениям и используют новые возможности, будут в наилучшем положении для успеха на глобальном рынке.`}
        </p>
        
        <h3>
          {language === 'en' ? 'Conclusion' : 'Заключение'}
        </h3>
        
        <p>
          {language === 'en'
            ? `The landscape of ${getLocalizedContent(post.category).toLowerCase()} continues to evolve rapidly. Staying informed about regulatory changes, embracing technological innovations, and working with experienced professionals are essential strategies for navigating this complex environment successfully.`
            : `Ландшафт ${getLocalizedContent(post.category).toLowerCase()} продолжает быстро развиваться. Быть в курсе нормативных изменений, внедрять технологические инновации и работать с опытными профессионалами - это важные стратегии для успешной навигации в этой сложной среде.`}
        </p>
      </div>
    </div>
  );
};
