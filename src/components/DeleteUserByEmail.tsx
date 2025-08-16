import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function DeleteUserByEmail() {
  const [email, setEmail] = useState("");
  const [dryRun, setDryRun] = useState(true);
  const [confirm, setConfirm] = useState(false);
  const [resJson, setResJson] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!email || (!dryRun && !confirm)) return;

    setLoading(true);
    setResJson(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setResJson({ error: 'Not authenticated' });
        return;
      }

      const { data, error } = await supabase.functions.invoke('wipe-user-by-email', {
        body: { email, dryRun, hardDeleteAuth: !dryRun },
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      if (error) {
        setResJson({ error: error.message || error });
        return;
      }

      setResJson(data);
    } catch (e: any) {
      setResJson({ error: e?.message || 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const emailInvalid = !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
      <h3 className="text-lg font-semibold mb-4">Delete ALL data by email (admin)</h3>

      <input
        type="email"
        placeholder="user@example.com"
        className="border rounded px-3 py-2 w-full mb-3"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label className="flex items-center gap-2 mb-2">
        <input
          type="checkbox"
          checked={dryRun}
          onChange={(e) => setDryRun(e.target.checked)}
        />
        <span>Dry run (no delete)</span>
      </label>

      {!dryRun && (
        <label className="flex items-center gap-2 text-red-600 mb-2">
          <input
          type="checkbox"
          checked={confirm}
          onChange={(e) => setConfirm(e.target.checked)}
          />
          <span>Confirm irreversible deletion</span>
        </label>
      )}

      <button
        disabled={loading || emailInvalid || (!dryRun && !confirm)}
        onClick={run}
        className="px-4 py-2 rounded bg-red-600 text-white disabled:opacity-50"
      >
        {loading ? "Working..." : dryRun ? "Preview (dry run)" : "DELETE NOW"}
      </button>

      {resJson && (
        <pre className="bg-gray-100 mt-4 p-3 rounded text-xs max-h-64 overflow-auto">
          {JSON.stringify(resJson, null, 2)}
        </pre>
      )}
    </div>
  );
}
