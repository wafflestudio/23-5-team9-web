import { z } from 'zod';

export const productFormSchema = z.object({
  title: z.string()
    .min(1, '상품 제목을 입력해주세요.')
    .transform((v) => v.trim()),
  price: z.number({ error: '가격을 입력해주세요.' })
    .min(1, '가격을 입력해주세요.'),
  content: z.string()
    .min(1, '상품 설명을 입력해주세요.')
    .transform((v) => v.trim()),
  is_sold: z.boolean().optional(),
});

export type ProductFormData = z.infer<typeof productFormSchema>;
