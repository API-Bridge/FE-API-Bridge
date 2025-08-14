import { BarChart, CheckCircle, Database, ShieldAlert, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const recentActivities = [
    { user: 'Alice', action: 'Created API "Product Feed"', timestamp: '2 minutes ago', ip: '192.168.1.10' },
    { user: 'Bob', action: 'Generated new key for "Weather API"', timestamp: '5 minutes ago', ip: '203.0.113.25' },
    { user: 'Charlie', action: 'Deleted API "Old User Service"', timestamp: '1 hour ago', ip: '198.51.100.3' },
    { user: 'Alice', action: 'Updated "Product Feed" settings', timestamp: '2 hours ago', ip: '192.168.1.10' },
    { user: 'David', action: 'User login', timestamp: '3 hours ago', ip: '192.0.2.88' },
];

export default function MonitoringPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Operational</div>
            <p className="text-xs text-muted-foreground">Last check: 1 minute ago</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Sources</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Connected and healthy</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84</div>
            <p className="text-xs text-muted-foreground">Online in the last 15 minutes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No critical alerts today</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Grafana Dashboard</CardTitle>
            <CardDescription>Real-time system metrics and performance.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center border">
              <div className="text-center text-muted-foreground">
                <BarChart className="h-16 w-16 mx-auto" />
                <p className="mt-4">Grafana dashboard embedded here</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Kibana Dashboard</CardTitle>
            <CardDescription>Log analysis and application tracing.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center border">
              <div className="text-center text-muted-foreground">
                <BarChart className="h-16 w-16 mx-auto" />
                 <p className="mt-4">Kibana dashboard embedded here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="font-headline">User Activity Stream</CardTitle>
          <CardDescription>An overview of recent user activities across the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivities.map((activity, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{activity.user}</TableCell>
                  <TableCell>{activity.action}</TableCell>
                  <TableCell className="text-muted-foreground">{activity.timestamp}</TableCell>
                  <TableCell className="text-muted-foreground">{activity.ip}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
