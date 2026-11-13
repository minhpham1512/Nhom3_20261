// Component thông báo màn hình đang trong lộ trình phát triển
export const ComingSoonPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
    <div className="rounded-full bg-blue-50 p-4 text-blue-600">
      <span className="text-2xl font-bold">🚀</span>
    </div>
    <h3 className="mt-4 text-lg font-bold text-slate-800">{title}</h3>
    <p className="mt-1 text-sm text-slate-500">
      Màn hình này nằm trong các giai đoạn tiếp theo của lộ trình Sprint 2.
    </p>
  </div>
)
