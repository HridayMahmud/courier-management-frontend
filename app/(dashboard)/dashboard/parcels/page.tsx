"use client";

import { cn } from "cn";
import { ArrowUpRight, LayoutGrid, List, Package, PackagePlus, SearchX } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { ParcelCard } from "@/components/parcels/parcel-card";
import { StatusSelect } from "@/components/parcels/status-select";
import { Pager } from "@/components/shared/pager";
import { SearchInput } from "@/components/shared/search-input";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useMyParcels } from "@/hooks/use-parcels";
import { formatDate, formatNumber } from "@/lib/format";
import { fmt, useI18n } from "@/lib/i18n";
import type { ParcelStatus } from "@/lib/types";

const PAGE_SIZE = 10;

export default function MyParcelsPage() {
  const { dict, lang } = useI18n();
  const t = dict.customer;
  const router = useRouter();
  const { data, isPending } = useMyParcels();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ParcelStatus | "">("");
  const [view, setView] = useState<"table" | "cards">("table");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data ?? []).filter((p) => {
      if (status && p.status !== status) return false;
      if (!q) return true;
      return [p.title, p.trackingId, p.receiverName, p.address, p.pickupAddress].some((v) => v?.toLowerCase().includes(q));
    });
  }, [data, search, status]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const hasFilters = !!search || !!status;
  const href = (id: string) => `/dashboard/parcels/${id}`;

  return (
    <>
      <PageHeader
        title={t.listTitle}
        description={t.listSubtitle}
        actions={
          <Button asChild size="xl" className="shadow-glow">
            <Link href="/dashboard/parcels/new">
              <PackagePlus data-icon="inline-start" /> {t.newParcel}
            </Link>
          </Button>
        }
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder={t.searchPlaceholder}
        />
        <div className="flex items-center gap-2">
          <StatusSelect
            value={status}
            onChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
          />
          <div className="flex rounded-xl border bg-card p-1" role="group">
            {(
              [
                ["table", List, t.viewTable],
                ["cards", LayoutGrid, t.viewCards],
              ] as const
            ).map(([key, Icon, label]) => (
              <Tooltip key={key}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => setView(key)}
                    aria-label={label}
                    aria-pressed={view === key}
                    className={cn(
                      "grid size-8 place-items-center rounded-lg transition-colors",
                      view === key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent",
                    )}
                  >
                    <Icon className="size-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>{label}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>

      {isPending ? (
        <div className="space-y-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : (data ?? []).length === 0 ? (
        <EmptyState
          icon={Package}
          title={t.emptyTitle}
          text={t.emptyText}
          action={
            <Button asChild size="lg">
              <Link href="/dashboard/parcels/new">{t.emptyCta}</Link>
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title={t.noResults}
          action={
            hasFilters && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setStatus("");
                }}
              >
                {t.clearFilters}
              </Button>
            )
          }
        />
      ) : (
        <>
          <p className="mb-3 text-sm text-muted-foreground">{filtered.length === 1 ? t.countOne : fmt(t.count, { count: formatNumber(filtered.length, lang) })}</p>
          {view === "table" ? (
            <div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="pl-5">{dict.parcel.title}</TableHead>
                    <TableHead>{dict.parcel.trackingId}</TableHead>
                    <TableHead className="hidden md:table-cell">{dict.parcel.receiver}</TableHead>
                    <TableHead className="hidden lg:table-cell">{dict.parcel.address}</TableHead>
                    <TableHead>{dict.parcel.status}</TableHead>
                    <TableHead className="hidden sm:table-cell">{dict.parcel.created}</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((p) => (
                    <TableRow key={p._id} className="group cursor-pointer" onClick={() => router.push(href(p._id))}>
                      <TableCell className="max-w-48 truncate pl-5 font-medium">
                        <Link href={href(p._id)} onClick={(e) => e.stopPropagation()} className="hover:text-primary">
                          {p.title}
                        </Link>
                      </TableCell>
                      <TableCell className="font-mono text-xs tracking-wide">{p.trackingId ?? "—"}</TableCell>
                      <TableCell className="hidden md:table-cell">{p.receiverName || "—"}</TableCell>
                      <TableCell className="hidden max-w-56 truncate text-muted-foreground lg:table-cell">{p.address}</TableCell>
                      <TableCell>
                        <StatusBadge status={p.status} />
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground sm:table-cell">{formatDate(p.createdAt, lang)}</TableCell>
                      <TableCell>
                        <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {rows.map((p) => (
                <ParcelCard key={p._id} parcel={p} href={href(p._id)} />
              ))}
            </div>
          )}
          <div className="mt-4">
            <Pager page={current} pages={pages} onChange={setPage} />
          </div>
        </>
      )}
    </>
  );
}
