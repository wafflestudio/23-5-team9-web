import { z } from 'zod';

export const auctionFormSchema = z.object({
  title: z.string()
    .min(1, '상품 제목을 입력해주세요.')
    .transform((v) => v.trim()),
  content: z.string()
    .min(1, '상품 설명을 입력해주세요.')
    .transform((v) => v.trim()),
  starting_price: z.number({ error: '시작가를 입력해주세요.' })
    .min(1, '시작가는 1원 이상이어야 합니다.'),
  end_date: z.string().min(1, '종료 날짜를 선택해주세요.'),
  end_time: z.string().min(1, '종료 시간을 선택해주세요.'),
  image_ids: z.array(z.string()).optional(),
  category_id: z.string().min(1, '카테고리를 선택해주세요.'),
});

export type AuctionFormData = z.infer<typeof auctionFormSchema>;
