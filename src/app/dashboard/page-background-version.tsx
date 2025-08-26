"use client";

import {
  Activity,
  ArrowUpRight,
  Copy,
  CreditCard,
  KeyRound,
  MoreVertical,
  Share2,
  CodeXml as ApiIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const apis = [
  {
    name: "날씨 데이터 API",
    status: "활성",
    calls: "1,203,489",
    successRate: "99.8%",
    isShared: true,
    isImported: false,
    originalAuthor: null,
  },
  {
    name: "주식 시장 피드",
    status: "활성",
    calls: "8,456,123",
    successRate: "99.5%",
    isShared: false,
    isImported: false,
    originalAuthor: null,
  },
  {
    name: "사용자 위치정보 서비스",
    status: "비활성",
    calls: "50,123",
    successRate: "100%",
    isShared: false,
    isImported: true,
    originalAuthor: "locationdev",
  },
  {
    name: "제품 카탈로그 API",
    status: "활성",
    calls: "2,345,678",
    successRate: "98.9%",
    isShared: true,
    isImported: false,
    originalAuthor: null,
  },
  {
    name: "결제 게이트웨이 브릿지",
    status: "오류",
    calls: "987,654",
    successRate: "92.1%",
    isShared: false,
    isImported: true,
    originalAuthor: "paymentexpert",
  },
];

export default function DashboardBackgroundVersion() {
  const [apiSharedStatus, setApiSharedStatus] = useState(
    apis.reduce((acc, api) => {
      acc[api.name] = api.isShared;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const toggleShare = (apiName: string) => {
    setApiSharedStatus(prev => ({
      ...prev,
      [apiName]: !prev[apiName]
    }));
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 API</CardTitle>
            <ApiIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              지난달 이후 +2
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">활성 키</CardTitle>
            <KeyRound className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              지난주 이후 +3
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 호출 (30일)</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,234,567</div>
            <p className="text-xs text-muted-foreground">
              지난달 대비 +19%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">가동 시간</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-xs text-muted-foreground">
              모든 활성 API에서
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle className="font-headline">내 API</CardTitle>
            <CardDescription>
              사용자 지정 데이터 소스 API를 관리합니다.
            </CardDescription>
          </div>
          <Button asChild size="sm" className="ml-auto gap-1">
            <Link href="#">
              API 생성
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>API 이름</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">호출 (30일)</TableHead>
                <TableHead className="text-right">성공률</TableHead>
                <TableHead className="text-center">공유</TableHead>
                <TableHead>
                  <span className="sr-only">작업</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apis.map((api) => (
                <TableRow 
                  key={api.name}
                  className={`${
                    api.isImported 
                      ? "bg-orange-50/50 hover:bg-orange-100/50 border-l-4 border-l-orange-200" 
                      : "bg-blue-50/30 hover:bg-blue-100/30 border-l-4 border-l-blue-200"
                  }`}
                >
                  <TableCell className="font-medium">
                    <div>
                      {api.name}
                      {api.isImported && api.originalAuthor && (
                        <div className="text-xs text-muted-foreground mt-1">
                          원작자: {api.originalAuthor}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        api.status === "활성"
                          ? "default"
                          : api.status === "오류"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {api.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{api.calls}</TableCell>
                  <TableCell className="text-right">
                    {api.successRate}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      variant={apiSharedStatus[api.name] ? "default" : "outline"}
                      onClick={() => toggleShare(api.name)}
                      className={`gap-1 ${
                        apiSharedStatus[api.name]
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                      }`}
                    >
                      <Share2 className="h-3 w-3" />
                      {apiSharedStatus[api.name] ? "Sharing" : "Share"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">메뉴 전환</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>작업</DropdownMenuLabel>
                        <DropdownMenuItem>분석 보기</DropdownMenuItem>
                        <DropdownMenuItem>키 관리</DropdownMenuItem>
                        <DropdownMenuItem>설정</DropdownMenuItem>
                        <DropdownMenuLabel>API 키</DropdownMenuLabel>
                        <DropdownMenuItem className="flex justify-between items-center cursor-pointer">
                          sk_...a4f2 <Copy className="h-4 w-4 text-muted-foreground" />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}