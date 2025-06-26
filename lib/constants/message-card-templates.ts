import { Heart, Star, Sparkles, Flower2, Leaf } from 'lucide-react';

export interface MessageCardTemplate {
  id: string;
  name: string;
  icon: any;
  color: string;
}

export const MESSAGE_CARD_TEMPLATES: MessageCardTemplate[] = [
  { id: 'heart', name: '사랑', icon: Heart, color: 'bg-pink-100 text-pink-600' },
  { id: 'star', name: '응원', icon: Star, color: 'bg-yellow-100 text-yellow-600' },
  { id: 'sparkle', name: '반짝임', icon: Sparkles, color: 'bg-indigo-100 text-indigo-600' },
  { id: 'flower', name: '꽃', icon: Flower2, color: 'bg-rose-100 text-rose-600' },
  { id: 'leaf', name: '나뭇잎', icon: Leaf, color: 'bg-green-100 text-green-600' },
];

/**
 * ID로 템플릿을 찾는 헬퍼 함수
 */
export const getTemplateById = (id: string): MessageCardTemplate | undefined => {
  return MESSAGE_CARD_TEMPLATES.find((template) => template.id === id);
};

/**
 * 기본 템플릿 (fallback)
 */
export const DEFAULT_TEMPLATE: MessageCardTemplate = {
  id: 'heart',
  name: '사랑',
  icon: Heart,
  color: 'bg-pink-100 text-pink-600',
};
