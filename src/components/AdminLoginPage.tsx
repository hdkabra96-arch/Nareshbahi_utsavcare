import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Lock, User, KeyRound, Database, CheckCircle2, AlertCircle, RefreshCw, Eye, EyeOff } from "lucide-react";
import { verifyAdminCredentials, testSupabaseConnection, isSupabaseConfigured } from "../lib/supabase";

interface AdminLoginPageProps {
  onLoginSuccess: (username: string) => void;
  triggerToast: (msg: string, type?: "success" | "error") => void;
}

export default function AdminLoginPage({ onLoginSuccess, triggerToast }: AdminLoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Database status
  const [dbStatus, setDbStatus] = useState<{
    loading: boolean;
    connected: boolean;
    adminTableExists: boolean;
    error?: string;
  }>({
    loading: true,
    connected: false,
    adminTableExists: false,
  });

  const checkDbConnection = async () => {
    setDbStatus((prev) => ({ ...prev, loading: true }));
    try {
      const res = await testSupabaseConnection();
      setDbStatus({
        loading: false,
        connected: res.connected,
        adminTableExists: res.adminAccountsTable,
        error: res.error,
      });
    } catch (e: any) {
      setDbStatus({
        loading: false,
        connected: false,
        adminTableExists: false,
        error: e?.message || "Unknown error",
      });
    }
  };

  useEffect(() => {
    checkDbConnection();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      triggerToast("Please enter both username and password.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await verifyAdminCredentials(username.trim(), password.trim());
      setIsSubmitting(false);

      if (result.success) {
        triggerToast(result.message, "success");
        onLoginSuccess(username.trim());
      } else {
        triggerToast(result.message, "error");
      }
    } catch (err: any) {
      setIsSubmitting(false);
      triggerToast(err?.message || "Authentication error", "error");
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-neutral-50 px-4 py-12" id="admin-login-page-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl border border-neutral-200/80 shadow-xl overflow-hidden"
      >
        {/* Banner Headers */}
        <div className="bg-neutral-950 text-white p-8 relative overflow-hidden">
          {/* Subtle grid decor */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
          
          <div className="relative z-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-neutral-950 mb-4 shadow-lg shadow-amber-500/20">
              <Lock className="h-5.5 w-5.5 stroke-[2.5]" />
            </div>
            <h1 className="font-serif text-2xl font-bold tracking-tight">Admin System Terminal</h1>
            <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
              Authenticate via Supabase cloud cluster to access administrator panel controls and sync system logs.
            </p>
          </div>
        </div>

        {/* Database Sync Status Widget */}
        <div className="bg-neutral-900 border-b border-neutral-800 px-6 py-3.5 flex items-center justify-between text-xs text-neutral-300">
          <div className="flex items-center space-x-2">
            <Database className="h-4 w-4 text-neutral-400" />
            <span className="font-mono text-neutral-400">DB Status:</span>
            {dbStatus.loading ? (
              <span className="flex items-center text-amber-400 font-semibold font-mono animate-pulse">
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" /> Check...
              </span>
            ) : dbStatus.connected ? (
              dbStatus.adminTableExists ? (
                <span className="flex items-center text-emerald-400 font-semibold font-mono">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Active & Sync
                </span>
              ) : (
                <span className="flex items-center text-amber-400 font-semibold font-mono" title="Admin table does not exist. Fallback enabled.">
                  <AlertCircle className="h-3.5 w-3.5 mr-1" /> Schema Pending
                </span>
              )
            ) : (
              <span className="flex items-center text-rose-400 font-semibold font-mono">
                <AlertCircle className="h-3.5 w-3.5 mr-1" /> Disconnected
              </span>
            )}
          </div>
          
          <button 
            type="button"
            onClick={checkDbConnection}
            className="text-[10px] text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-2 py-1 rounded transition-colors font-mono flex items-center gap-1 cursor-pointer"
            title="Refresh database connection status"
          >
            <RefreshCw className="h-3 w-3" /> Sync Status
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider block">
              Admin Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-neutral-400">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                className="w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 py-3 text-xs text-neutral-900 placeholder-neutral-400 focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 outline-none transition-all font-mono"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider block">
                Security Password
              </label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-neutral-400">
                <KeyRound className="h-4 w-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-10 py-3 text-xs text-neutral-900 placeholder-neutral-400 focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 outline-none transition-all font-mono tracking-wider"
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Warning or fallback alerts */}
          {!dbStatus.loading && dbStatus.connected && !dbStatus.adminTableExists && (
            <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3.5 text-[11px] text-amber-800 leading-relaxed">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Supabase Schema Missing admin_accounts</p>
                  <p className="mt-1 text-amber-700/90">
                    To connect fully to Supabase, run the SQL code in the Admin Settings tab. Currently using local credentials fallback:
                  </p>
                  <div className="mt-1.5 font-mono text-[10px] bg-white border border-amber-100 p-1 rounded inline-block text-neutral-800">
                    User: <strong className="text-neutral-950">admin</strong> | Pass: <strong className="text-neutral-950">admin123</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isSupabaseConfigured && (
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3.5 text-[11px] text-neutral-600 leading-relaxed">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-neutral-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-neutral-700">Supabase Connection Idle</p>
                  <p className="mt-1">
                    Connect your Supabase URL & Key to save records in the cloud. You can login with default credential values:
                  </p>
                  <div className="mt-2 font-mono text-[10px] bg-white border border-neutral-200 p-1 rounded text-neutral-800">
                    Username: <span className="font-bold text-neutral-950">admin</span> / Password: <span className="font-bold text-neutral-950">admin123</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-neutral-950 text-white hover:bg-gold-500 hover:text-neutral-950 py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-md shadow-neutral-950/5 flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> VERIFYING TERMINAL...
              </span>
            ) : (
              "SECURE LOGIN"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
