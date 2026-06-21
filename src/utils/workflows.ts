import { WorkflowStep } from "../types";

export const workflows: Record<string, WorkflowStep[]> = {
  "social-media": [
    {
      id: "business",
      question: "شنو نوع نشاطك التجاري أو مشروعك؟",
      type: "text",
      placeholder: "مثال: مطعم، متجر إلكتروني...",
    },
    {
      id: "platform",
      question: "اختر المنصة اللي تريد التصميم لها:",
      type: "select",
      options: ["انستغرام", "فيسبوك", "تويتر", "لينكد إن", "سناب شات", "تيك توك"],
    },
    {
      id: "goal",
      question: "شنو الهدف من التصميم؟",
      type: "textarea",
      placeholder: "مثال: زيادة المبيعات، الترويج لمنتج جديد...",
    },
  ],
  "video-production": [
    {
      id: "product",
      question: "شنو المنتج أو الخدمة اللي تريد تعمل لها فيديو؟",
      type: "text",
      placeholder: "مثال: تطبيق توصيل طعام...",
    },
    {
      id: "duration",
      question: "شنو المدة التقريبية للفيديو؟",
      type: "select",
      options: ["15 ثانية", "30 ثانية", "دقيقة واحدة", "2-3 دقائق", "5+ دقائق"],
    },
    {
      id: "style",
      question: "شنو الأسلوب المفضل للفيديو؟",
      type: "select",
      options: ["موسيقي سريع", "شرح هادئ", "قصصي", "مضحك", "احترافي"],
    },
  ],
  "content-writing": [
    {
      id: "topic",
      question: "شنو الموضوع اللي تريد أكتب عنه؟",
      type: "text",
      placeholder: "مثال: أهمية التسويق الرقمي...",
    },
    {
      id: "contentType",
      question: "شنو نوع المحتوى المطلوب؟",
      type: "select",
      options: ["مقال", "منشور سوشيال", "إعلان", "بريد إلكتروني", "سكريبت فيديو"],
    },
    {
      id: "tone",
      question: "شنو النبرة المطلوبة؟",
      type: "select",
      options: ["رسمي", "ودود", "حماسي", "تعليمي", "روائي"],
    },
  ],
  "website-creation": [
    {
      id: "purpose",
      question: "شنو الغرض من الموقع؟",
      type: "text",
      placeholder: "مثال: متجر إلكتروني، موقع شخصي...",
    },
    {
      id: "siteType",
      question: "شنو نوع الموقع المطلوب؟",
      type: "select",
      options: ["موقع عرض", "متجر إلكتروني", "موقع شخصي", "مدونة", "منصة خدمات"],
    },
    {
      id: "features",
      question: "شنو أهم الميزات اللي تحتاجها؟",
      type: "textarea",
      placeholder: "مثال: نظام حجوزات، متجر، مدونة...",
    },
  ],
  "app-creation": [
    {
      id: "idea",
      question: "صف فكرة التطبيق اللي تريد بناءه:",
      type: "textarea",
      placeholder: "مثال: تطبيق لتوصيل الطعام...",
    },
    {
      id: "platform",
      question: "شنو المنصات المستهدفة؟",
      type: "select",
      options: ["iOS فقط", "Android فقط", "iOS و Android", "تطبيق ويب"],
    },
    {
      id: "appFeatures",
      question: "شنو أهم الميزات المطلوبة؟",
      type: "textarea",
      placeholder: "مثال: نظام دفع، خرائط، إشعارات...",
    },
  ],
  "ai-prompts": [
    {
      id: "tool",
      question: "شنو الأداة اللي تريد استخدامها؟",
      type: "select",
      options: ["ChatGPT", "Midjourney", "DALL-E", "Claude", "Gemini", "أخرى"],
    },
    {
      id: "goal",
      question: "شنو الهدف من البرومبت؟",
      type: "text",
      placeholder: "مثال: إنشاء صورة فنية، كتابة قصة...",
    },
    {
      id: "details",
      question: "أضف أي تفاصيل إضافية:",
      type: "textarea",
      placeholder: "مثال: الأسلوب، الألوان، الجمهور المستهدف...",
    },
  ],
};