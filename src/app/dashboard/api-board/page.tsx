"use client";

import {
  Copy,
  Download,
  KeyRound,
  MessageSquare,
  Search,
  Share2,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

const sharedApis = [
  {
    name: "영화 추천 API",
    author: "user123",
    description: "개인 취향 기반 영화 추천 시스템",
    uses: 245,
    shared: "2일 전",
  },
  {
    name: "암호화폐 가격 트래커",
    author: "cryptodev",
    description: "실시간 암호화폐 가격 추적 API",
    uses: 892,
    shared: "5일 전",
  },
  {
    name: "소셜 미디어 분석기",
    author: "dataanalyst",
    description: "SNS 게시물 감정 분석 및 트렌드 파악",
    uses: 156,
    shared: "1주 전",
  },
  {
    name: "음식 배달 최적화",
    author: "foodtech",
    description: "배달 경로 최적화 및 시간 예측",
    uses: 67,
    shared: "3일 전",
  },
];

export default function APIBoard() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredApis = sharedApis.filter(
    (api) =>
      api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      api.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      api.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyAPI = (apiName: string) => {
    // API 복사 로직
    alert(`${apiName}을(를) 내 대시보드로 복사했습니다!`);
  };

  return (
    <>
      {/* 상단 통계 박스 3개 */}
      <div className="grid gap-4 md:grid-cols-3 md:gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">내가 공유한 키</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              이번 달 +1
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">가져온 키</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              이번 달 +2
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 게시판 키</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              이번 주 +23
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 검색 기능 */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="API 이름, 설명 또는 작성자로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* 공유된 API 목록 */}
      <Card>
        <CardHeader>
          <div className="grid gap-2">
            <CardTitle className="font-headline">공유된 API</CardTitle>
            <CardDescription>
              커뮤니티에서 공유한 커스텀 API를 탐색하고 사용해보세요.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>API 이름</TableHead>
                <TableHead>작성자</TableHead>
                <TableHead>설명</TableHead>
                <TableHead className="text-right">사용 횟수</TableHead>
                <TableHead className="text-right">공유일</TableHead>
                <TableHead>
                  <span className="sr-only">작업</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApis.map((api) => (
                <TableRow key={api.name}>
                  <TableCell className="font-medium">{api.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {api.author}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {api.description}
                  </TableCell>
                  <TableCell className="text-right">{api.uses.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {api.shared}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyAPI(api.name)}
                      className="gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      가져오기
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredApis.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">검색 결과가 없습니다</p>
              <p className="text-sm text-muted-foreground">
                다른 검색어를 시도해보세요.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}