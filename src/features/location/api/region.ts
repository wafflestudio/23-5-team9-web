import client from '@/shared/api/client';

// 공통으로 사용될 지역 정보 인터페이스
export interface Region {
  id: string;
  sido: string;
  sigugun: string;
  dong: string;
  full_name: string;
}

// 동(Dong) 목록 조회 시 사용되는 인터페이스
export interface DongEntry {
  id: string;
  dong: string;
}

// 지역 검색 (검색어 포함)
export async function searchRegions(
  query: string,
  limit: number = 10,
  offset: number = 0
): Promise<Region[]> {
  return client
    .get('/api/region/search', {
      searchParams: { query, limit, offset },
    })
    .json<Region[]>();
}

// 내 주변 지역 찾기 (좌표 기반)
export async function fetchNearbyRegion(lat: number, long: number): Promise<Region> {
  return client
    .get('/api/region/nearby', {
      searchParams: { lat, long },
    })
    .json<Region>();
}

// 시/도 목록 조회
export async function fetchSidoList(): Promise<string[]> {
  return client.get('/api/region/sido').json<string[]>();
}

// 시/구/군 목록 조회
export async function fetchSigugunList(sidoName: string): Promise<string[]> {
  return client.get(`/api/region/sido/${sidoName}/sigugun`).json<string[]>();
}

// 동 목록 조회
export async function fetchDongList(
  sidoName: string,
  sigugunName: string
): Promise<DongEntry[]> {
  return client
    .get(`/api/region/sido/${sidoName}/sigugun/${sigugunName}/dong`)
    .json<DongEntry[]>();
}

// 특정 지역 ID로 상세 조회
export async function fetchRegionById(regionId: string): Promise<Region> {
  return client.get(`/api/region/${regionId}`).json<Region>();
}
