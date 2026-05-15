import { useMemo, useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import ProfilePage from './ProfilePage'

function App() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('signin') // 'signin' | 'signup'
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authError, setAuthError] = useState('')
  const [profileDropdown, setProfileDropdown] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setAuthLoading(false)
    })
    return unsub
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileDropdown && !e.target.closest('.profile-dropdown')) {
        setProfileDropdown(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [profileDropdown])

  const metrics = useMemo(
    () => [
      { label: 'Problems Solved', value: '1,284', delta: '+12% this week' },
      { label: 'Active Streak', value: '19 days', delta: 'Best: 42 days' },
      { label: 'Contests', value: '28', delta: 'Avg rank: 3,412' },
      { label: 'Acceptance', value: '61%', delta: 'Last 30 days' },
    ],
    [],
  )

  const platforms = useMemo(
    () => [
      {
        name: 'LeetCode',
        href: 'https://leetcode.com/',
        icon: 'https://leetcode.com/favicon.ico',
        status: 'Connected',
        meta: 'Sync: last 2h',
        accent: 'from-amber-400/20 to-orange-500/10',
      },
      {
        name: 'CodeChef',
        href: 'https://www.codechef.com/',
        icon: 'https://www.codechef.com/favicon.ico',
        status: 'Connect',
        meta: 'Sync in 1 click',
        accent: 'from-rose-400/15 to-fuchsia-500/10',
      },
      {
        name: 'AtCoder',
        href: 'https://atcoder.jp/',
        icon: 'https://atcoder.jp/favicon.ico',
        status: 'Connect',
        meta: 'Contest history',
        accent: 'from-sky-400/15 to-cyan-500/10',
      },
      {
        name: 'Codeforces',
        href: 'https://codeforces.com/',
        icon: 'https://codeforces.com/favicon.ico',
        status: 'Connected',
        meta: 'Sync: last 1d',
        accent: 'from-indigo-400/15 to-violet-500/10',
      },
      {
        name: 'GeeksforGeeks',
        href: 'https://www.geeksforgeeks.org/',
        icon: 'https://www.geeksforgeeks.org/favicon.ico',
        status: 'Connect',
        meta: 'Practice + articles',
        accent: 'from-emerald-400/15 to-green-500/10',
      },
      {
        name: 'HackerRank',
        href: 'https://www.hackerrank.com/',
        icon: 'https://www.hackerrank.com/favicon.ico',
        status: 'Connected',
        meta: 'Sync: last 6h',
        accent: 'from-lime-400/10 to-emerald-500/10',
      },
    ],
    [],
  )

  const AuthModal = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
      e.preventDefault()
      setAuthError('')
      setLoading(true)

      try {
        if (authMode === 'signup') {
          const { createUserWithEmailAndPassword } = await import('firebase/auth')
          await createUserWithEmailAndPassword(auth, email, password)
          // You could update displayName here if needed
        } else {
          const { signInWithEmailAndPassword } = await import('firebase/auth')
          await signInWithEmailAndPassword(auth, email, password)
        }
        setShowAuthModal(false)
        setEmail('')
        setPassword('')
        setName('')
      } catch (err) {
        setAuthError(err.message)
      } finally {
        setLoading(false)
      }
    }

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm"
        onClick={() => setShowAuthModal(false)}
      >
        <div
          className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">
              {authMode === 'signin' ? 'Sign in' : 'Sign up'}
            </h2>
            <button
              onClick={() => setShowAuthModal(false)}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-white/10"
              aria-label="Close modal"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {authError && (
            <div className="mb-4 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-xs text-red-200">
              {authError}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {authMode === 'signup' && (
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-cyan-400/30 focus:outline-none"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-cyan-400/30 focus:outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-cyan-400/30 focus:outline-none"
                placeholder="Min 6 characters"
              />
            </div>

            {authMode === 'signup' && (
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">Confirm password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-cyan-400/30 focus:outline-none"
                  placeholder="Confirm password"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:opacity-95 disabled:opacity-50"
            >
              {loading ? 'Loading…' : authMode === 'signin' ? 'Sign in' : 'Sign up'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-300">
            {authMode === 'signin' ? (
              <>
                New here?{' '}
                <button
                  onClick={() => setAuthMode('signup')}
                  className="font-semibold text-cyan-300 hover:text-cyan-200"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setAuthMode('signin')}
                  className="font-semibold text-cyan-300 hover:text-cyan-200"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute top-64 right-[-12rem] h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-[-10rem] h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-fuchsia-500 to-cyan-400" />
              <div className="leading-tight">
                <div className="text-sm font-semibold">TrackCode</div>
                <div className="text-xs text-slate-400">Coding platform tracker</div>
              </div>
            </div>

            <nav className="hidden items-center gap-6 md:flex">
              <a href="#features" className="text-sm text-slate-300 hover:text-white">
                Platforms
              </a>
              <a href="#analytics" className="text-sm text-slate-300 hover:text-white">
                Analytics
              </a>
              <a href="#pricing" className="text-sm text-slate-300 hover:text-white">
                Pricing
              </a>
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              {user ? (
                <>
                  <div className="relative profile-dropdown">
                    <button
                      onClick={() => setProfileDropdown(!profileDropdown)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10"
                    >
                      <svg className="h-5 w-5 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </button>
                    
                    {profileDropdown && (
                      <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-white/10 bg-white/5 p-2 shadow-lg">
                        <button
                          onClick={() => {
                            setProfileDropdown(false)
                            alert('Profile page (demo)')
                          }}
                          className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/10"
                        >
                          Profile
                        </button>
                        <button
                          onClick={() => {
                            setProfileDropdown(false)
                            alert('Dashboard (demo)')
                          }}
                          className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/10"
                        >
                          Dashboard
                        </button>
                        <div className="my-1 border-t border-white/5"></div>
                        <button
                          onClick={async () => {
                            setProfileDropdown(false)
                            const { signOut } = await import('firebase/auth')
                            await signOut(auth)
                          }}
                          className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/10"
                        >
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setShowAuthModal(true)
                      setAuthMode('signup')
                    }}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
                  >
                    Sign up
                  </button>
                  <button className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:opacity-95">
                    Get dashboard
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10 md:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? 'Close' : 'Menu'}
            </button>
          </div>

          {mobileOpen && (
            <div className="border-t border-white/5 py-4 md:hidden">
              <div className="flex flex-col gap-3">
                <a
                  href="#features"
                  className="rounded-lg px-2 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#analytics"
                  className="rounded-lg px-2 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  Analytics
                </a>
                <a
                  href="#activity"
                  className="rounded-lg px-2 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  Activity
                </a>
                <a
                  href="#pricing"
                  className="rounded-lg px-2 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  Pricing
                </a>
                <div className="mt-2 flex gap-3">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5">
                          <svg className="h-5 w-5 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          const { signOut } = await import('firebase/auth')
                          await signOut(auth)
                        }}
                        className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setShowAuthModal(true)
                          setAuthMode('signup')
                        }}
                        className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
                      >
                        Sign up
                      </button>
                      <button className="flex-1 rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:opacity-95">
                        Get dashboard
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main>
        <section className="relative">
          <div className="mx-auto max-w-6xl px-4 pb-16 pt-14 md:pb-20 md:pt-20">
            <div className="grid items-center gap-10 md:grid-cols-2">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Live tracking for your coding journey
                </div>
                <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-white md:text-5xl">
                  Track every solve, contest, and streak across platforms—automatically.
                </h1>
                <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-slate-300">
                  TrackCode turns your scattered submissions into a single dark, clean dashboard. Monitor progress,
                  analyze weaknesses, and share a recruiter-ready profile.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <button className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:opacity-95">
                    Connect platforms
                  </button>
                  <button className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-200 hover:bg-white/10">
                    View sample dashboard
                  </button>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {metrics.map((m) => (
                    <div
                      key={m.label}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="text-xs text-slate-400">{m.label}</div>
                      <div className="mt-1 text-xl font-semibold text-white">{m.value}</div>
                      <div className="mt-1 text-xs text-slate-400">{m.delta}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">Overview</div>
                    <div className="text-xs text-slate-400">Last 7 days snapshot</div>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                    Synced
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-200">Topic mix</div>
                      <div className="text-xs text-slate-400">Balanced</div>
                    </div>
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      <div className="h-2 rounded-full bg-emerald-400/80" />
                      <div className="h-2 rounded-full bg-cyan-400/70" />
                      <div className="h-2 rounded-full bg-fuchsia-500/70" />
                      <div className="h-2 rounded-full bg-white/10" />
                    </div>
                    <div className="mt-2 text-xs text-slate-400">Arrays • DP • Graphs • System design</div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-200">Consistency</div>
                      <div className="text-xs text-slate-400">Streak trend</div>
                    </div>
                    <div className="mt-3 grid grid-cols-12 gap-1">
                      {[2, 3, 5, 4, 7, 9, 8, 10, 7, 11, 9, 12].map((h, idx) => (
                        <div
                          key={idx}
                          className="flex items-end"
                        >
                          <div
                            className="w-full rounded-sm bg-white/10"
                            style={{ height: `${8 + h * 3}px` }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-slate-400">More solves on weekends</div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-200">Recommended next</div>
                      <div className="text-xs text-slate-400">Based on gaps</div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {['Binary Search', 'Sliding Window', 'Graphs', 'Greedy'].map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-4 py-14">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="text-xs font-semibold tracking-wide text-slate-400">PLATFORMS</div>
              <h2 className="mt-2 text-2xl font-semibold text-white md:text-3xl">Connect your coding platforms</h2>
              <p className="mt-2 text-sm text-slate-300">
                Add your profiles to sync solves, contests, streaks, and more.
              </p>
            </div>
            <button className="hidden rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10 md:inline-flex">
              Manage connections
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {platforms.map((p) => (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="group rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-white/7"
              >
                <div className={`rounded-2xl border border-white/10 bg-gradient-to-b ${p.accent} p-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50 text-sm font-semibold text-slate-200">
                        <span aria-hidden="true">{p.name.slice(0, 1)}</span>
                        <img
                          src={p.icon}
                          alt={`${p.name} icon`}
                          className="absolute inset-0 m-auto h-6 w-6"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.style.opacity = '0'
                          }}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{p.name}</div>
                        <div className="text-xs text-slate-300">{p.meta}</div>
                      </div>
                    </div>

                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                        p.status === 'Connected'
                          ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200'
                          : 'border-white/10 bg-white/5 text-slate-200'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-slate-400">Open platform</div>
                    <div className="text-xs font-semibold text-cyan-300 group-hover:text-cyan-200">
                      {p.status === 'Connected' ? 'View stats' : 'Connect now'}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[{ k: 'Solves', v: '—' }, { k: 'Rank', v: '—' }, { k: 'Streak', v: '—' }].map((x) => (
                    <div key={x.k} className="rounded-2xl border border-white/10 bg-slate-950/30 p-3">
                      <div className="text-[11px] text-slate-400">{x.k}</div>
                      <div className="mt-1 text-sm font-semibold text-white">{x.v}</div>
                    </div>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </section>

        <section id="analytics" className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-1">
              <div className="text-xs font-semibold tracking-wide text-slate-400">ANALYTICS</div>
              <h2 className="mt-2 text-2xl font-semibold text-white md:text-3xl">
                Know what to practice next
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                Track weak topics, difficulty drift, and consistency. Make your prep measurable.
              </p>
            </div>

            <div className="md:col-span-2">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="text-sm font-semibold text-white">Difficulty split</div>
                  <div className="mt-4 space-y-3">
                    {[
                      { label: 'Easy', pct: 42, color: 'bg-emerald-400/80' },
                      { label: 'Medium', pct: 46, color: 'bg-cyan-400/70' },
                      { label: 'Hard', pct: 12, color: 'bg-fuchsia-500/70' },
                    ].map((row) => (
                      <div key={row.label}>
                        <div className="flex items-center justify-between text-xs text-slate-300">
                          <span>{row.label}</span>
                          <span>{row.pct}%</span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                          <div className={`h-full ${row.color}`} style={{ width: `${row.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="text-sm font-semibold text-white">Weekly goal</div>
                  <div className="mt-4">
                    <div className="text-3xl font-semibold text-white">18 / 25</div>
                    <div className="mt-1 text-xs text-slate-400">solves completed</div>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[72%] bg-gradient-to-r from-emerald-400/80 to-cyan-400/80" />
                  </div>
                  <div className="mt-3 text-sm text-slate-300">
                    You're on track. Keep 2 solves/day to hit target.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
              <div className="text-xs font-semibold tracking-wide text-slate-400">START FREE</div>
              <h3 className="mt-2 text-2xl font-semibold text-white">Free dashboard</h3>
              <p className="mt-2 text-sm text-slate-300">
                Basic sync + stats. Perfect for daily tracking.
              </p>
              <div className="mt-6 text-4xl font-semibold text-white">₹0</div>
              <div className="mt-1 text-xs text-slate-400">forever</div>
              <button className="mt-6 w-full rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10">
                Create profile
              </button>
            </div>

            <div className="rounded-3xl border border-fuchsia-500/30 bg-gradient-to-b from-fuchsia-500/15 to-white/5 p-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                Recommended
              </div>
              <h3 className="mt-3 text-2xl font-semibold text-white">Pro tracking</h3>
              <p className="mt-2 text-sm text-slate-300">
                Advanced analytics + recruiter profile + exports.
              </p>
              <div className="mt-6 text-4xl font-semibold text-white">₹199</div>
              <div className="mt-1 text-xs text-slate-400">per month</div>
              <button className="mt-6 w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:opacity-95">
                Start Pro
              </button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:flex md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-white">Ready to track your growth?</h3>
              <p className="mt-2 text-sm text-slate-300">
                Connect your profiles and get a unified dashboard in minutes.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-0">
              <button className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:opacity-95">
                Connect now
              </button>
              <button className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-200 hover:bg-white/10">
                Talk to us
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-slate-400">
              © {new Date().getFullYear()} TrackCode. Built for consistent practice.
            </div>
            <div className="flex gap-5 text-sm">
              <a className="text-slate-400 hover:text-white" href="#features">
                Platforms
              </a>
              <a className="text-slate-400 hover:text-white" href="#analytics">
                Analytics
              </a>
              <a className="text-slate-400 hover:text-white" href="#pricing">
                Pricing
              </a>
            </div>
          </div>
        </div>
      </footer>
      {showAuthModal && <AuthModal />}
    </div>
  )
}

export default App
