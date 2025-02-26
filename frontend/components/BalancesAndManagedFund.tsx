import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BalancesAndManagedFund() {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2 px-5 pt-4">
        <CardTitle className="text-xl">Overview</CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h3 className="text-base font-semibold mb-2">Balances</h3>
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Wallet className="text-primary" size={16} />
                    <span className="text-sm font-medium">ETH</span>
                  </div>
                  <ArrowUpRight className="text-green-500" size={16} />
                </div>
                <p className="text-lg font-bold mt-1">0.001</p>
                <p className="text-xs text-muted-foreground">$1,850.00 USD</p>
              </Card>
              <Card className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Wallet className="text-primary" size={16} />
                    <span className="text-sm font-medium">stETH</span>
                  </div>
                  <ArrowDownRight className="text-red-500" size={16} />
                </div>
                <p className="text-lg font-bold mt-1">0</p>
                <p className="text-xs text-muted-foreground">$0.00 USD</p>
              </Card>
            </div>
            <Card className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Wallet className="text-primary" size={16} />
                  <span className="text-sm font-medium">Staked Amount</span>
                </div>
                <ArrowUpRight className="text-green-500" size={16} />
              </div>
              <p className="text-lg font-bold mt-1">0.01</p>
              <p className="text-xs text-muted-foreground">$18.50 USD</p>
            </Card>
          </div>
          <div>
            <h3 className="text-base font-semibold mb-3">Managed Fund</h3>
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Total Value</span>
                <TrendingUp className="text-green-500" size={16} />
              </div>
              <div className="text-2xl font-bold">$12,358.72</div>
              <div className="flex items-center mt-1">
                <ArrowUpRight className="text-green-500 mr-1" size={14} />
                <span className="text-green-500 text-sm font-medium">
                  +3.3%
                </span>
                <span className="text-xs text-muted-foreground ml-2">
                  vs last week
                </span>
              </div>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
