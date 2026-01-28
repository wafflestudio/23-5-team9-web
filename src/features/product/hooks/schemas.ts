import { z } from 'zod';

// Shared base fields used by both product and auction
export const baseFormFields = {
  title: z.string().min(1, '상품 제목을 입력해주세요.').transform(v => v.trim()),
  content: z.string().min(1, '상품 설명을 입력해주세요.').transform(v => v.trim()),
  image_ids: z.array(z.string()).optional(),
};

export const productFormSchema = z.object({
  ...baseFormFields,
  price: z.number({ error: '가격을 입력해주세요.' }).min(1, '가격을 입력해주세요.'),
  is_sold: z.boolean().optional(),
});

export type ProductFormData = z.infer<typeof productFormSchema>;
