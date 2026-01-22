import client from '@/shared/api/client';

// 1. 공통으로 사용될 지역 정보 인터페이스
export interface Region {
  id: string;
  sido: string;
  sigugun: string;
  dong: string;
  full_name: string;
}

// 동(Dong) 목록 조회 시 사용되는 인터페이스 (명세서의 동 조회 응답 참조)
export interface DongEntry {
  id: string;
  dong: string;
}

// 2. 지역 검색 (검색어 포함)
// GET /api/region/search
export async function searchRegions(query: string, limit: number = 10, offset: number = 0): Promise<Region[]> {
  const response = await client.get<Region[]>('/api/region/search', {
    params: {
      query,
      limit,
      offset,
    },
  });
  return response.data;
}

// 3. 내 주변 지역 찾기 (좌표 기반)
// GET /api/region/nearby (명세서에 따라 GET 및 lat, long 파라미터 사용)
export async function fetchNearbyRegion(lat: number, long: number): Promise<Region> {
  const response = await client.get<Region>('/api/region/nearby', {
    params: {
      lat,
      long,
    },
  });
  return response.data;
}

// 4. 시/도 목록 조회
// GET /api/region/sido
export async function fetchSidoList(): Promise<string[]> {
  const response = await client.get<string[]>('/api/region/sido');
  return response.data;
}

// 5. 시/구/군 목록 조회
// GET /api/region/sido/{sido_name}/sigugun
export async function fetchSigugunList(sidoName: string): Promise<string[]> {
  const response = await client.get<string[]>(
    `/api/region/sido/${sidoName}/sigugun`
  );
  return response.data;
}

// 6. 동 목록 조회
// GET /api/region/sido/{sido_name}/sigugun/{sigugun_name}/dong
export async function fetchDongList(sidoName: string, sigugunName: string): Promise<DongEntry[]> {
  const response = await client.get<DongEntry[]>(
    `/api/region/sido/${sidoName}/sigugun/${sigugunName}/dong`
  );
  return response.data;
}

// 7. 특정 지역 ID로 상세 조회
// GET /api/region/{region_id}
export async function fetchRegionById(regionId: string): Promise<Region> {
  const response = await client.get<Region>(`/api/region/${regionId}`);
  return response.data;
}