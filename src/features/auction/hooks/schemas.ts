import { z } from 'zod';
import { baseFormFields } from '@/features/product/hooks/schemas';

export const auctionFormSchema = z.object({
  ...baseFormFields,
  starting_price: z.number({ error: '시작가를 입력해주세요.' }).min(1, '시작가는 1원 이상이어야 합니다.'),
  end_date: z.string().min(1, '종료 날짜를 선택해주세요.'),
  end_time: z.string().min(1, '종료 시간을 선택해주세요.'),
  category_id: z.string().min(1, '카테고리를 선택해주세요.'),
});

export type AuctionFormData = z.infer<typeof auctionFormSchema>;
