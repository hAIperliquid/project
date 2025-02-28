"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ChevronRight,
  Shield,
  Zap,
  BarChart,
  Cpu,
  TrendingUp,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShinyText from "@/components/ShinyText";
import ContractRead from "@/components/testing/ContractRead";

function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);
  const [increasing, setIncreasing] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayValue((prev) => {
        const change = Math.random() * 0.5;
        const newValue = increasing ? prev + change : prev - change;
        if (Math.random() < 0.02) {
          setIncreasing(!increasing);
        }
        return Number(newValue.toFixed(2));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [increasing]);

  return (
    <motion.div
      className="flex items-center text-7xl font-bold text-accent-foreground"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      $
      {displayValue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </motion.div>
  );
}

export default function Home() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [0, 1]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-secondary to-background py-20 h-screen flex flex-col justify-center">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              className="mb-12 flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center mb-4">
                <h3 className="text-lg">Assets Under Management</h3>
                <div className="ml-2 h-3 w-3 rounded-full bg-primary"></div>
              </div>
              <AnimatedNumber value={12358.72} />
            </motion.div>
            <motion.p
              className="text-xl mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Optimizing your liquidity with AI Agents to maximize returns in
              the complex world of DeFi.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button
                asChild
                size="lg"
                className="rounded-full transition-all duration-200 hover:shadow-lg relative overflow-hidden group py-6 px-8 bg-zinc-800/90 hover:bg-zinc-800/80"
              >
                <Link href="/dashboard">
                  <ShinyText text="Launch App" speed={2} className="text-lg" />
                </Link>
              </Button>
            </motion.div>
          </div>
          <ContractRead />
        </section>

        <motion.section className="py-16" style={{ opacity }}>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Why hAIperliquid?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: "Simplified DeFi",
                  description:
                    "Navigate the complex world of DeFi protocols effortlessly. Our AI agents handle the research and monitoring for you.",
                },
                {
                  icon: Zap,
                  title: "Optimized Yields",
                  description:
                    "Our AI agents constantly monitor and adjust strategies to ensure you're always getting the best possible returns.",
                },
                {
                  icon: BarChart,
                  title: "Competitive Agents",
                  description:
                    "Our unique system incentivizes AI agents to compete, ensuring only the best-performing strategies are used.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <feature.icon className="text-primary h-12 w-12 mb-4" />
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section className="bg-muted py-16" style={{ opacity }}>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              How It Works
            </h2>
            <Tabs defaultValue="deposit" className="max-w-3xl mx-auto">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="deposit">Deposit</TabsTrigger>
                <TabsTrigger value="compete">Compete</TabsTrigger>
                <TabsTrigger value="validate">Validate</TabsTrigger>
                <TabsTrigger value="execute">Execute</TabsTrigger>
                <TabsTrigger value="earn">Earn</TabsTrigger>
              </TabsList>
              <TabsContent value="deposit">
                <Card>
                  <CardHeader>
                    <CardTitle>1. Deposit Funds</CardTitle>
                    <CardDescription>
                      Securely deposit your funds into our Treasury Contract.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Lock className="text-primary h-16 w-16 mx-auto mb-4" />
                    <p>
                      Your funds are safely stored and ready for our AI agents
                      to work their magic.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="compete">
                <Card>
                  <CardHeader>
                    <CardTitle>2. AI Agents Compete</CardTitle>
                    <CardDescription>
                      Our AI agents compete to propose the best yield
                      strategies.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Cpu className="text-primary h-16 w-16 mx-auto mb-4" />
                    <p>
                      Multiple AI agents analyze market conditions and propose
                      optimal strategies for your funds.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="validate">
                <Card>
                  <CardHeader>
                    <CardTitle>3. AVS Validation</CardTitle>
                    <CardDescription>
                      Proposals are validated by our Advanced Validation System
                      (AVS).
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Shield className="text-primary h-16 w-16 mx-auto mb-4" />
                    <p>
                      Our AVS ensures that only safe and promising strategies
                      are approved for execution.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="execute">
                <Card>
                  <CardHeader>
                    <CardTitle>4. Strategy Execution</CardTitle>
                    <CardDescription>
                      Approved strategies are executed automatically.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Zap className="text-primary h-16 w-16 mx-auto mb-4" />
                    <p>
                      The best strategies are implemented swiftly and
                      efficiently to maximize your returns.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="earn">
                <Card>
                  <CardHeader>
                    <CardTitle>5. Earn Optimized Yields</CardTitle>
                    <CardDescription>
                      You earn optimized yields without the complexity of
                      managing it yourself.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TrendingUp className="text-primary h-16 w-16 mx-auto mb-4" />
                    <p>
                      Sit back and watch your investments grow while our AI
                      agents work tirelessly for you.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </motion.section>

        <motion.section
          className="py-16 bg-gradient-to-t from-secondary to-background"
          style={{ opacity }}
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">
              Ready to Optimize Your Crypto Investments?
            </h2>
            <Button
              asChild
              size="lg"
              className="rounded-full text-black transition-all hover:shadow-lg relative overflow-hidden group"
            >
              <Link href="/dashboard">
                <span className="relative z-10">Get Started Now</span>
                <ChevronRight className="ml-2 relative z-10" />
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary via-accent to-primary group-hover:animate-shine" />
              </Link>
            </Button>
          </div>
        </motion.section>
      </main>

      <footer className="bg-secondary text-secondary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 hAIperliquid. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
