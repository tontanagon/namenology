"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Database,
  Search,
  Filter,
  Sparkles,
  Edit2,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

interface CharacterScoreItem {
  id: string;
  character: string;
  language: "TH" | "EN";
  score: number;
  isActive: boolean;
}

export default function AdminCharactersPage() {
  const [characters, setCharacters] = useState<CharacterScoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 40;

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editScore, setEditScore] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const fetchCharacters = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (language !== "ALL") params.append("language", language);
      if (search.trim()) params.append("search", search.trim());

      const res = await fetch(`/api/admin/characters?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCharacters(data.characters || []);
        setTotal(data.total || 0);
      }
    } catch {
      // Ignored
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, [page, language]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCharacters();
  };

  const handleStartEdit = (char: CharacterScoreItem) => {
    setEditingId(char.id);
    setEditScore(char.score);
    setSaveSuccess(null);
    setSaveError(null);
  };

  const handleSaveEdit = async (id: string) => {
    try {
      setSaving(true);
      setSaveError(null);

      const res = await fetch(`/api/admin/characters/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: Number(editScore) }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update score.");

      setCharacters((prev) =>
        prev.map((c) => (c.id === id ? { ...c, score: Number(editScore) } : c))
      );
      setSaveSuccess("Score updated and logged in audit trail.");
      setEditingId(null);
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/admin/characters/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !current }),
      });

      if (res.ok) {
        setCharacters((prev) =>
          prev.map((c) => (c.id === id ? { ...c, isActive: !current } : c))
        );
      }
    } catch {
      // Ignored
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Character Score Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Configure numeric weights for Thai (ก-ฮ, vowels, tone marks) and Latin (A-Z) characters
          </p>
        </div>
        <Badge variant="brand">Dynamic Mapping Table</Badge>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-lg bg-teal-500/10 border border-teal-500/20 text-xs text-teal-700 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {saveError && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <Card glass className="p-4 flex flex-col sm:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search character (e.g. ก, A, ภ)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              setPage(1);
            }}
            className="h-9 px-3 rounded-lg border border-border bg-background text-foreground text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="ALL">All Alphabets</option>
            <option value="TH">Thai Alphabet (ก-ฮ & Vowels)</option>
            <option value="EN">Latin Alphabet (A-Z)</option>
          </select>
        </div>
      </Card>

      {/* Characters Table */}
      <Card glass className="overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-muted-foreground text-xs flex flex-col items-center gap-2">
            <Sparkles className="w-5 h-5 animate-spin text-brand-500" />
            <span>Loading character scores...</span>
          </div>
        ) : characters.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground text-xs">
            No characters matched your query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground">
                  <th className="py-3 px-4 font-semibold">Character</th>
                  <th className="py-3 px-4 font-semibold">Language</th>
                  <th className="py-3 px-4 font-semibold">Numeric Score</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {characters.map((char) => {
                  const isEditing = editingId === char.id;

                  return (
                    <tr key={char.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-muted/80 border border-border font-bold text-base text-foreground">
                          {char.character}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={char.language === "TH" ? "brand" : "outline"}>
                          {char.language === "TH" ? "Thai" : "English"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min={0}
                              max={100}
                              value={editScore}
                              onChange={(e) => setEditScore(Number(e.target.value))}
                              className="w-20 h-8 text-xs font-bold"
                            />
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleSaveEdit(char.id)}
                              disabled={saving}
                              className="h-8 px-2"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingId(null)}
                              className="h-8 px-2"
                            >
                              <X className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <span className="font-bold text-sm text-foreground">
                            {char.score}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(char.id, char.isActive)}
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full border cursor-pointer ${
                            char.isActive
                              ? "bg-teal-500/10 text-teal-700 border-teal-500/20"
                              : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {char.isActive ? "Active" : "Disabled"}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {!isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStartEdit(char)}
                            className="h-7 text-xs px-2"
                          >
                            <Edit2 className="w-3.5 h-3.5 mr-1" />
                            <span>Edit Score</span>
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
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
    </div>
  );
}
