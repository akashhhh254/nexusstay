import type { ReviewItem } from '@/types/hotel';

export function ReviewCard({ item, onApprove, onReject }: { item: ReviewItem; onApprove: (id: string) => void; onReject: (id: string) => void }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-sm text-slate-500">Matching score</div>
          <div className="text-2xl font-bold text-primary-600">{item.score.toFixed(2)}</div>
        </div>
        <div className="badge border-slate-200 bg-slate-50 text-slate-700">{item.decision ? item.decision : 'Pending review'}</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="mb-2 text-sm font-semibold text-slate-900">Hotel A</div>
          <div className="font-medium">{item.hotel_a.name}</div>
          <div className="text-sm text-slate-600">{item.hotel_a.city}</div>
          <div className="text-sm text-slate-600">{item.hotel_a.address}</div>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="mb-2 text-sm font-semibold text-slate-900">Hotel B</div>
          <div className="font-medium">{item.hotel_b.name}</div>
          <div className="text-sm text-slate-600">{item.hotel_b.city}</div>
          <div className="text-sm text-slate-600">{item.hotel_b.address}</div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        <div className="mb-2 font-medium text-slate-900">LLM explanation</div>
        <p>{item.llm_explanation}</p>
      </div>

      <div className="mt-5 flex gap-3">
        <button onClick={() => onApprove(item.id)} className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700">Approve Merge</button>
        <button onClick={() => onReject(item.id)} className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700">Reject</button>
      </div>
    </div>
  );
}
