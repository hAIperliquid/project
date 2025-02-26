import { DollarSign, Wallet, PieChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Sidebar() {
  return (
    <div className="w-full lg:w-80 bg-secondary p-4 lg:p-6 overflow-auto">
      <h2 className="text-xl lg:text-2xl font-semibold mb-4 lg:mb-6">
        User Dashboard
      </h2>
      <Card className="mb-4 lg:mb-6">
        <CardHeader>
          <CardTitle>Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="flex items-center">
                <Wallet className="mr-2" size={16} /> ETH Balance:
              </span>
              <span>0.001</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center">
                <Wallet className="mr-2" size={16} /> stETH Balance:
              </span>
              <span>0</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center">
                <Wallet className="mr-2" size={16} /> Staked Amount:
              </span>
              <span>0.01</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="mb-4 lg:mb-6">
        <CardHeader>
          <CardTitle>Managed Fund</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl lg:text-2xl font-bold">$12,358.72</div>
          <div className="text-green-500">+3.3%</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Fund Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl lg:text-2xl font-bold mb-4">$28,000,000</div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="flex items-center">
                <DollarSign className="mr-2" size={16} /> USDC:
              </span>
              <span>20,000,000</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center">
                <PieChart className="mr-2" size={16} /> BTC:
              </span>
              <span>100</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center">
                <PieChart className="mr-2" size={16} /> ETH:
              </span>
              <span>50</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center">
                <PieChart className="mr-2" size={16} /> SOL:
              </span>
              <span>100</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
