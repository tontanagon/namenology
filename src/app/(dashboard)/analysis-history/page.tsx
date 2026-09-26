"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  History,
  Search,
  Download,
  Filter,
  ArrowUpDown,
  FileText,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface AnalysisHistoryItem {
  id: string;
  analysisType: "FIRST_NAME" | "SURNAME" | "COMBINED";
  inputText: string;
  normalizedText: string;
  finalScore: number;
  calculationVersion: string;
  createdAt: string;
}

export default function AnalysisHistoryPage() {
  const [items, setItems] = useState<AnalysisHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (selectedType !== "ALL") {
        params.append("type", selectedType);
      }

      const res = await fetch(`/api/analysis?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.analyses || []);
        setTotal(data.total || 0);
      }
    } catch {
      // Ignored
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, selectedType]);

  // Client-side search filtering
  const filteredItems = items.filter((item) =>
    item.inputText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // CSV Export (REQ-B47)
  const handleExportCSV = () => {
    if (items.length === 0) return;

    const headers = ["ID", "Type", "Input Text", "Score", "Formula Version", "Date"];
    const rows = items.map((i) => [
      i.id,
      i.analysisType,
      `"${i.inputText.replace(/"/g, '""')}"`,
      i.finalScore,
      i.calculationVersion,
      new Date(i.createdAt).toISOString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `namenology_analysis_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-brand-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="brand">Audit Ledger</Badge>
              <span className="text-xs text-muted-foreground font-mono">Total: {total} records</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Calculation History
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Historical archive of all evaluated names with immutable formula snapshots
            </p>
          </div>

          <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={items.length === 0}>
            <Download className="w-4 h-4 mr-1.5" />
            <span>Export CSV</span>
          </Button>
        </div>

        {/* Filter and Search Bar */}
        <Card glass className="p-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search analyzed name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setPage(1);
              }}
              className="h-9 px-3 rounded-lg border border-border bg-background text-foreground text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="ALL">All Analysis Types</option>
              <option value="FIRST_NAME">First Name Only</option>
              <option value="SURNAME">Surname Only</option>
              <option value="COMBINED">Combined (Full Name)</option>
            </select>
          </div>
        </Card>

        {/* History Table */}
        <Card glass className="overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-muted-foreground text-xs flex flex-col items-center gap-2">
              <Sparkles className="w-5 h-5 animate-spin text-brand-500" />
              <span>Loading historical analyses...</span>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground text-xs space-y-3">
              <History className="w-8 h-8 mx-auto opacity-40" />
              <p className="font-medium text-foreground">No analysis history found</p>
              <p className="text-muted-foreground">Perform your first calculation to see records archived here.</p>
              <Link href="/analyze">
                <Button variant="primary" size="sm" className="mt-2">
                  Start Analysis
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground">
                    <th className="py-3 px-4 font-semibold">Analyzed Name</th>
                    <th className="py-3 px-4 font-semibold">Type</th>
                    <th className="py-3 px-4 font-semibold">Harmonic Score</th>
                    <th className="py-3 px-4 font-semibold">Version</th>
                    <th className="py-3 px-4 font-semibold">Date</th>
                    <th className="py-3 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-foreground">{item.inputText}</td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            item.analysisType === "COMBINED"
                              ? "gold"
                              : item.analysisType === "FIRST_NAME"
                              ? "brand"
                              : "outline"
                          }
                        >
                          {item.analysisType.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-sm text-foreground">
                          {Math.round(item.finalScore)}{" "}
                          <span className="text-[10px] text-muted-foreground font-normal">/ 100</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-muted-foreground">
                        v{item.calculationVersion}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground text-[11px]">
                        {new Date(item.createdAt).toLocaleDateString(undefined, {
                          dateStyle: "medium",
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link href={`/analyze/result/${item.id}`}>
                          <Button variant="ghost" size="sm" className="h-7 text-xs px-2.5">
                            <FileText className="w-3.5 h-3.5 mr-1" />
                            <span>Report</span>
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {total > limit && (
            <div className="flex items-center justify-between p-4 border-t border-border bg-muted/20 text-xs">
              <span className="text-muted-foreground">
                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total}
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="h-7 text-xs px-2"
                >
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                  <span>Previous</span>
                </Button>
                <span className="px-2 font-mono font-medium">{page}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page * limit >= total}
                  className="h-7 text-xs px-2"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
