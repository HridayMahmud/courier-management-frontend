"use client";

import { Package, SearchX, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ParcelActions } from "@/components/admin/parcel-actions";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ErrorState } from "@/components/dashboard/error-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusSelect } from "@/components/parcels/status-select";
import { Pager } from "@/components/shared/pager";
import { SearchInput } from "@/components/shared/search-input";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDebounced } from "@/hooks/use-debounced";
import { useParcelList } from "@/hooks/use-parcels";
import { formatDate, formatNumber } from "@/lib/format";
import { fmt, useI18n } from "@/lib/i18n";
import type { ParcelStatus, UserRef } from "@/lib/types";

const asUser = (v: unknown) => (v && typeof v === "object" ? (v as UserRef) : null);

export default function AdminParcelsPage() {
  const { dict, lang } = useI18n();
  const t = dict.admin;
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ParcelStatus | "">("");
  const [page, setPage] = useState(1);
  const debounced = useDebounced(search.trim());
  const { data, isPending, isFetching, isError, error, refetch } = useParcelList({ page, limit: 10, status, search: debounced });

  const hasFilters = !!search || !!status;
  const href = (id: string) => `/admin/parcels/${id}`;

  return (
    <>
      <PageHeader title={t.parcelsTitle} description={t.parcelsSubtitle} />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder={t.searchPlaceholder}
        />
        <StatusSelect
          value={status}
          onChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
        />
      </div>

      {isPending ? (
        <div className="space-y-2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : isError && !data ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : !data || data.total === 0 ? (
        hasFilters ? (
          <EmptyState
            icon={SearchX}
            title={dict.customer.noResults}
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setStatus("");
                }}
              >
                {dict.customer.clearFilters}
              </Button>
            }
          />
        ) : (
          <EmptyState icon={Package} title={t.noData} />
        )
      ) : (
        <>
          <p className="mb-3 text-sm text-muted-foreground" aria-live="polite">
            {data.total === 1 ? dict.customer.countOne : fmt(dict.customer.count, { count: formatNumber(data.total, lang) })}
          </p>
          <div className={`overflow-hidden rounded-2xl border bg-card shadow-soft transition-opacity ${isFetching ? "opacity-70" : ""}`}>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="pl-5">{dict.parcel.title}</TableHead>
                  <TableHead className="hidden md:table-cell">{t.customer}</TableHead>
                  <TableHead className="hidden lg:table-cell">{t.destination}</TableHead>
                  <TableHead className="hidden sm:table-cell">{dict.parcel.courier}</TableHead>
                  <TableHead>{dict.parcel.status}</TableHead>
                  <TableHead className="hidden xl:table-cell">{dict.parcel.created}</TableHead>
                  <TableHead className="w-12 pr-4 text-right">
                    <span className="sr-only">{t.actions}</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((p) => {
                  const customer = asUser(p.userId);
                  const courier = asUser(p.assignedCourier);
                  return (
                    <TableRow key={p._id} className="cursor-pointer" onClick={() => router.push(href(p._id))}>
                      <TableCell className="max-w-56 pl-5">
                        <Link href={href(p._id)} onClick={(e) => e.stopPropagation()} className="block truncate font-medium hover:text-primary">
                          {p.title}
                        </Link>
                        <span className="font-mono text-xs tracking-wide text-muted-foreground">{p.trackingId ?? "—"}</span>
                      </TableCell>
                      <TableCell className="hidden max-w-44 md:table-cell">
                        <span className="block truncate">{customer?.name ?? "—"}</span>
                        <span className="block truncate text-xs text-muted-foreground">{customer?.email}</span>
                      </TableCell>
                      <TableCell className="hidden max-w-52 lg:table-cell">
                        <span className="block truncate">{p.receiverName || "—"}</span>
                        <span className="block truncate text-xs text-muted-foreground">{p.address}</span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {courier ? (
                          <span className="inline-flex items-center gap-1.5">
                            <UserRound className="size-3.5 text-muted-foreground" /> {courier.name}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">{dict.parcel.notAssigned}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={p.status} />
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground xl:table-cell">{formatDate(p.createdAt, lang)}</TableCell>
                      <TableCell className="pr-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <ParcelActions parcel={p} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4">
            <Pager page={data.page} pages={data.pages} onChange={setPage} />
          </div>
        </>
      )}
    </>
  );
}
