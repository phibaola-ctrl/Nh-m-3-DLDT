import React from "react";
import { Plane } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen relative bg-cream-bg flex flex-col">
      <header className="h-16 px-8 flex items-center justify-between border-b border-cream-border bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sage rounded-lg flex items-center justify-center text-white">
            <Plane size={18} />
          </div>
          <span className="serif text-xl font-bold tracking-tight text-zinc-900">
            Phi <span className="text-sage italic">vô cùng đẹp trai</span>
          </span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-zinc-500">
          <a href="#" className="text-sage font-bold">Lập kế hoạch</a>
          <a href="#" className="hover:text-sage transition-colors">Khám phá</a>
          <a href="#" className="hover:text-sage transition-colors">Chuyến đi đã lưu</a>
          <a href="#" className="hover:text-sage transition-colors">Cộng đồng</a>
        </nav>
        <button className="px-5 py-2 bg-sage text-white rounded-full text-sm font-medium shadow-lg shadow-sage/10 hover:opacity-90 transition-opacity">
          Đăng nhập
        </button>
      </header>

      <main className="flex-1 px-6 pt-12 max-w-7xl mx-auto w-full">
        {children}
      </main>

      <footer className="py-12 px-8 border-t border-cream-border mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-zinc-400 text-xs font-medium uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Plane size={14} />
            <span>© 2026 AI Travel Planner. Kiến tạo mọi hành trình.</span>
          </div>
          <div className="flex gap-10">
            <a href="#" className="hover:text-sage transition-colors">Quyền riêng tư</a>
            <a href="#" className="hover:text-sage transition-colors">Điều khoản</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
