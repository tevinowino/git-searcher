'use client'

import { Search } from "lucide-react";
import { useState, useEffect } from "react";



export default function Home() {
  // Initialize user as null to handle the "no data" state properly
  let [user, setUser] = useState(null)
  let [userInput, setUserInput] = useState("");
  let [userName, setUserName] = useState('')

  // Effect to handle the async data fetching whenever userName changes
  useEffect(() => {
    if (!userName) return;

    // We use an async IIFE or a named function to handle the Promise result
    async function loadData() {
      const data = await fetchUser(userName);
      setUser(data);
    }
    
    loadData();
  }, [userName])

  /**
   * Fetches user data and their repositories from GitHub API.
   * Transforms the raw response into the structure expected by the UI.
   */
  async function fetchUser(input) {
    try {
      // 1. Fetch user profile
      const userRes = await fetch(`https://api.github.com/users/${input}`);
      if (!userRes.ok) return null;
      const userData = await userRes.json();

      // 2. Fetch user repositories
      const repoRes = await fetch(`https://api.github.com/users/${input}/repos?sort=updated&per_page=5`);
      const repoData = await repoRes.json();

      // 3. Transform data to match UI requirements
      return {
        name: userData.name || userData.login,
        handle: `@${userData.login}`,
        location: userData.location || "Earth",
        bio: userData.bio || "No bio provided.",
        initials: (userData.name || userData.login).substring(0, 2).toUpperCase(),
        // Mocking tags based on languages or default values
        tags: Array.from(new Set(repoData.map(r => r.language).filter(Boolean))).slice(0, 3),
        // Mapping metrics to the stats array
        stats: [
          { label: "REPOS", value: userData.public_repos },
          { label: "FOLLOWERS", value: userData.followers },
          { label: "FOLLOWING", value: userData.following },
          { label: "GISTS", value: userData.public_gists }
        ],
        // Formatting repositories
        repos: repoData.map(repo => ({
          name: repo.name,
          lang: repo.language || "Plain",
          stars: repo.stargazers_count
        }))
      };
    } catch (error) {
      console.error("Fetch failed:", error);
      return null;
    }
  }

  function handleSubmit() {
    // Trigger the search by updating userName
    setUserName(userInput.trim())
  }


  return (
    <div className="min-h-screen bg-[#050f05] flex items-center justify-center p-6 font-mono">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=VT323&display=swap');
        .font-vt323 { font-family: 'VT323', monospace; }
        .font-share { font-family: 'Share Tech Mono', monospace; }
        .scanlines {
          background: repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 3px,
            rgba(0,0,0,0.18) 3px,
            rgba(0,0,0,0.18) 4px
          );
        }
        @keyframes crt-flicker {
          0%, 97%, 100% { opacity: 1; }
          98% { opacity: 0.93; }
          99% { opacity: 0.97; }
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
        .crt-flicker { animation: crt-flicker 8s infinite; }
        .blink { animation: blink 1.1s step-end infinite; }
        .glow-text { text-shadow: 0 0 8px rgba(0,255,60,0.5); }
        .glow-text-sm { text-shadow: 0 0 5px rgba(0,255,60,0.35); }
        .glow-box { box-shadow: 0 0 8px rgba(0,255,60,0.12); }
      `}</style>

      {/* CRT Screen */}
      <div className="crt-flicker font-share relative w-full max-w-2xl bg-[#0a0f0a] border-[3px] border-[#1a2e1a] rounded-2xl p-7 overflow-hidden">

        {/* Scanline overlay */}
        <div className="scanlines pointer-events-none absolute inset-0 z-10 rounded-2xl" />

        {/* Title Bar */}
        <div className="flex items-end gap-3 border-b border-[#1c3a1c] pb-4 mb-5">
          <span className="font-vt323 text-[32px] text-[#00ff3c] tracking-[3px] glow-text leading-none">
            ▌GIT SEARCHER
          </span>
          <span className="text-[11px] text-[#2a6e2a] tracking-[2px] mb-[2px]">
            v1.0.4 — TERMINAL EDITION
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2 bg-[#050f05] border border-[#1c3a1c] rounded px-3 py-2 mb-5">
          <span className="font-vt323 text-[#00ff3c] text-lg glow-text">C:\GIT&gt;</span>
          <input
            type="text"
            value={userInput} // Controlled input
            onChange={(e) => {
              setUserInput(e.target.value)
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} // Allow Enter to search
            placeholder="search username..."
            className="flex-1 bg-transparent border-none outline-none text-[#00cc30] text-[15px] font-share placeholder:text-[#1c4a1c] caret-[#00ff3c]"
          />
          <button onClick={handleSubmit} className="flex items-center gap-2 bg-[#003d0f] border border-[#00cc30] text-[#00ff3c] text-[12px] tracking-widest px-3 py-1.5 rounded-sm hover:bg-[#005a18] transition-colors glow-text-sm cursor-pointer">
            <Search size={13} />
            EXECUTE
          </button>
        </div>

        {/* Section Label */}
        <p className="text-[11px] text-[#2a6e2a] tracking-[3px] uppercase mb-3">// PROFILE RECORD</p>

        {user ? (
          <>
            {/* Profile Card */}
            <div className="flex gap-4 border border-[#1c3a1c] rounded bg-[#050f05] p-4 mb-4">
              <div className="w-[72px] h-[72px] shrink-0 border border-[#00cc30] rounded-sm bg-[#021002] flex items-center justify-center font-vt323 text-[28px] text-[#00ff3c] glow-box glow-text">
                {user.initials}
              </div>
              <div>
                <p className="font-vt323 text-[28px] text-[#00ff3c] tracking-[2px] leading-tight glow-text">
                  {user.name}
                </p>
                <p className="text-[12px] text-[#2a7a2a] tracking-wide mt-0.5 mb-2">
                  {user.handle} · {user.location}
                </p>
                <p className="text-[13px] text-[#00aa28] leading-relaxed mb-2">{user.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {user.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] text-[#00cc30] border border-[#1c5a1c] bg-[#021a06] px-2 py-0.5 rounded-sm tracking-wide"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <StatsComponent user={user} />

            {/* Status Bar */}
            <div className="flex justify-between text-[10px] text-[#1c5a1c] tracking-[2px] mt-5 pt-3 border-t border-[#0f2a0f]">
              <span>CONNECTED · GITHUB_API</span>
              <span>RECORDS: {user.repos.length} OF {user.stats[0].value}</span>
              <span>
                MEM: 640K OK<span className="blink">_</span>
              </span>
            </div>
          </>
        ) : (
          <div className="border border-[#1c3a1c] rounded bg-[#050f05] p-10 text-center">
            <p className="font-vt323 text-[#2a6e2a] text-lg tracking-[2px]">
              NO RECORD LOADED. PLEASE EXECUTE SEARCH.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Component to display user metrics and repository index.
 * Receives the formatted user object as a prop.
 */
function StatsComponent({ user }) {
  return (
    <div>
      <p className="text-[11px] text-[#2a6e2a] tracking-[3px] uppercase mb-3">// SYSTEM METRICS</p>
      <div className="grid grid-cols-4 gap-2.5 mb-4">
        {user.stats.map((stat) => (
          <div
            key={stat.label}
            className="border border-[#1c3a1c] bg-[#050f05] rounded-sm py-3 text-center"
          >
            <span className="font-vt323 text-[26px] text-[#00ff3c] glow-text leading-none block">
              {stat.value}
            </span>
            <p className="text-[10px] text-[#2a6e2a] tracking-[2px] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Divider */}
      <hr className="border-t border-[#0f2a0f] my-4" />

      {/* Repositories List */}
      <p className="text-[11px] text-[#2a6e2a] tracking-[3px] uppercase mb-3">// REPOSITORY INDEX</p>
      <div className="flex flex-col gap-2.5">
        {user.repos.map((repo) => (
          <div
            key={repo.name}
            className="flex items-center gap-3 border border-[#1c3a1c] bg-[#050f05] rounded-sm px-3.5 py-3 hover:border-[#2a6e2a] transition-colors cursor-default"
          >
            <div className="w-2 h-2 rounded-full bg-[#00cc30] shrink-0 glow-box" />
            <span className="flex-1 text-[14px] text-[#00ff3c] tracking-wide">{repo.name}</span>
            <span className="text-[11px] text-[#2a7a2a] tracking-wide w-12 text-right">{repo.lang}</span>
            <span className="text-[11px] text-[#2a6e2a] tracking-wide w-14 text-right">★ {repo.stars}</span>
          </div>
        ))}
      </div>
    </div>
  );
}