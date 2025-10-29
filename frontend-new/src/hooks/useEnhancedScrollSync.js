"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { openTokSessionSingleton } from "../services/OpenTokSessionManager"

/**
 * Enhanced scroll sync hook for OpenTok co-browsing with parallel control
 * Enables simultaneous scrolling on both sides without leader election
 *
 * Features:
 * - Adaptive throttling based on scroll velocity (30-150ms)
 * - Event queue for rapid scroll events
 * - Continuous bidirectional sync without echo prevention
 * - Smooth scrolling for small adjustments, instant for large jumps
 * - Comprehensive error handling with retry logic
 * - Parallel control allowing both sides to scroll simultaneously
 */
export function useEnhancedScrollSync(arg1 = {}) {
  // Support both signatures:
  // - Object: { containerId, userType, enabled, throttleMs }
  // - Positional (legacy): (userType, enabled, containerId)
  const params = (typeof arg1 === 'object' && arg1 !== null && (arg1.userType || arg1.containerId))
    ? arg1
    : { userType: arguments[0], enabled: arguments[1], containerId: arguments[2] }

  const { containerId, userType, enabled = true, throttleMs = 100 } = params
  const scrollRef = useRef(null)
  const containerReadyRef = useRef(false)
  const resizeObserverRef = useRef(null)
  const mutationObserverRef = useRef(null)
  const intersectionObserverRef = useRef(null)
  const lastSizeStableTsRef = useRef(0)
  const sizeStableTimerRef = useRef(null)
  const isVisibleRef = useRef(true)

  const lastScrollPosRef = useRef({ top: 0, left: 0, ts: 0 })
  const scrollVelocityRef = useRef(0)
  const lastLocalActivityTsRef = useRef(0)
  const lastAppliedRemoteTsRef = useRef(0)
  const lastAppliedRemotePosRef = useRef({ top: 0, left: 0, ts: 0 })
  const lastSentPosRef = useRef({ top: 0, left: 0, ts: 0 })

  const scrollEventQueueRef = useRef([])
  const isProcessingQueueRef = useRef(false)

  // Removed leader election system for parallel control

  const throttleTimerRef = useRef(null)
  const rafApplyRef = useRef(0)
  const rafReadyCheckRef = useRef(0)
  const localSourceId = useMemo(() => `${userType}-${Math.random().toString(36).slice(2)}`, [userType])
  const [syncStatus, setSyncStatus] = useState("idle") // idle, syncing, synced
  const [sessionReadyKey, setSessionReadyKey] = useState(0)
  const pendingSendRef = useRef(null)
  const isScrollingRef = useRef(false)

  const markSizeStableSoon = useCallback(() => {
    if (sizeStableTimerRef.current) clearTimeout(sizeStableTimerRef.current)
    sizeStableTimerRef.current = setTimeout(() => {
      lastSizeStableTsRef.current = Date.now()
      containerReadyRef.current = true
    }, 150)
  }, [])

  const calculateScrollVelocity = useCallback((el) => {
    if (!el) return 0
    const now = Date.now()
    const timeDelta = Math.max(1, now - lastScrollPosRef.current.ts)
    const posDelta = Math.abs(el.scrollTop - lastScrollPosRef.current.top)
    const velocity = posDelta / timeDelta // pixels per millisecond
    lastScrollPosRef.current = { top: el.scrollTop, left: el.scrollLeft, ts: now }
    return velocity
  }, [])

  const getAdaptiveThrottle = useCallback((velocity) => {
    // Spec thresholds: >2 px/ms => 30ms, >1 px/ms => 60ms, else 100-150ms
    if (velocity > 2) return 30
    if (velocity > 1) return 60
    return Math.max(100, Math.min(150, throttleMs))
  }, [throttleMs])

  const computePercents = useCallback((el) => {
    if (!el) return { percentY: 0, percentX: 0, pxY: 0, pxX: 0 }
    const maxY = Math.max(1, el.scrollHeight - el.clientHeight)
    const maxX = Math.max(1, el.scrollWidth - el.clientWidth)
    return {
      percentY: el.scrollTop / maxY,
      percentX: el.scrollLeft / maxX,
      pxY: el.scrollTop,
      pxX: el.scrollLeft,
    }
  }, [])

  const applyRemote = useCallback((payload) => {
    const el = scrollRef.current
    if (!el) return

    lastRemotePayloadRef.current = payload
    if (rafApplyRef.current) return

    rafApplyRef.current = requestAnimationFrame(() => {
      rafApplyRef.current = 0
      const latest = lastRemotePayloadRef.current
      if (!latest) return

      if (!containerReadyRef.current) return

      const elMaxY = Math.max(1, el.scrollHeight - el.clientHeight)
      const elMaxX = Math.max(1, el.scrollWidth - el.clientWidth)

      // Validate and choose px vs percent application
      let targetY = el.scrollTop
      let targetX = el.scrollLeft
      const incomingPxY = Number.isFinite(latest.pxY) ? latest.pxY : null
      const incomingPxX = Number.isFinite(latest.pxX) ? latest.pxX : null
      const heightsComparable = Number.isFinite(latest.scrollHeight) && Number.isFinite(latest.clientHeight)
        ? Math.abs((latest.scrollHeight - latest.clientHeight) - (el.scrollHeight - el.clientHeight)) / Math.max(1, (el.scrollHeight - el.clientHeight)) < 0.1
        : false

      if (heightsComparable && incomingPxY !== null) {
        targetY = Math.min(elMaxY, Math.max(0, Math.round(incomingPxY)))
        targetX = Math.min(elMaxX, Math.max(0, Math.round(incomingPxX ?? el.scrollLeft)))
      } else {
        // Fallback to percent mapping
        const pY = Number.isFinite(latest.percentY) ? latest.percentY : 0
        const pX = Number.isFinite(latest.percentX) ? latest.percentX : 0
        targetY = Math.min(elMaxY, Math.max(0, Math.round(pY * elMaxY)))
        targetX = Math.min(elMaxX, Math.max(0, Math.round(pX * elMaxX)))
      }

      const distY = Math.abs(el.scrollTop - targetY)
      const distX = Math.abs(el.scrollLeft - targetX)
      const totalDist = Math.sqrt(distY * distY + distX * distX)

      const smooth = totalDist < 150

      lastAppliedRemoteTsRef.current = Date.now()
      lastAppliedRemotePosRef.current = { top: targetY, left: targetX, ts: Date.now() }
      setSyncStatus("syncing")

      try {
        el.scrollTo({
          top: targetY,
          left: targetX,
          behavior: smooth ? "smooth" : "auto",
        })

        // Mark as synced after scroll completes
        setTimeout(() => setSyncStatus("synced"), smooth ? 300 : 50)
      } catch (error) {
        console.error("[scroll-sync][error] Failed to apply remote scroll:", error)
        setSyncStatus("idle")
      }
    })
  }, [])

  const lastRemotePayloadRef = useRef(null)

  const processScrollQueue = useCallback(() => {
    if (isProcessingQueueRef.current || scrollEventQueueRef.current.length === 0) return

    isProcessingQueueRef.current = true
    const event = scrollEventQueueRef.current.shift()

    if (event) {
      handleLocalScroll()
    }

    isProcessingQueueRef.current = false

    if (scrollEventQueueRef.current.length > 0) {
      setTimeout(processScrollQueue, 10)
    }
  }, [])

  
  const sendScroll = useCallback(() => {
    if (!enabled) return
    const el = scrollRef.current
    const session = openTokSessionSingleton.getSession?.()
    if (!el) return

    const { percentY, percentX, pxY, pxX } = computePercents(el)
    // Clamp unrealistic velocities
    const velocity = Math.min(5, Math.max(0, scrollVelocityRef.current || 0))
    const payload = {
      containerId,
      percentY: Number.isFinite(percentY) ? Number(percentY.toFixed(4)) : 0,
      percentX: Number.isFinite(percentX) ? Number(percentX.toFixed(4)) : 0,
      pxY,
      pxX,
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
      velocity,
      userType,
      sourceId: localSourceId,
      ts: Date.now(),
    }

    lastSentPosRef.current = { top: pxY, left: pxX, ts: payload.ts }

    // Queue if no session yet; will auto-flush on session ready
    if (!session) {
      pendingSendRef.current = payload
      return
    }

    let attempts = 0
    const maxRetries = 3
    const trySend = () => {
      attempts += 1
      console.info("[scroll-sync][send]", containerId, payload)

      try {
        openTokSessionSingleton.sendSignal({ type: "scroll-sync", data: JSON.stringify(payload) }, (err) => {
          if (err && attempts < maxRetries) {
            console.warn("[scroll-sync][error] send failed, retrying", err)
            setTimeout(trySend, attempts * 250)
          } else if (err) {
            console.error("[scroll-sync][error] send failed after retries", err)
          }
        })
      } catch (error) {
        console.error("[scroll-sync][error] Exception during signal send:", error)
      }
    }
    trySend()
  }, [computePercents, containerId, enabled, localSourceId, userType])

  const sendScrollImmediate = useCallback(() => {
    // send immediately without waiting for throttle
    if (throttleTimerRef.current) {
      clearTimeout(throttleTimerRef.current)
      throttleTimerRef.current = null
    }
    sendScroll()
  }, [sendScroll])

  const handleLocalScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return

    const velocity = calculateScrollVelocity(el)
    scrollVelocityRef.current = velocity

    lastLocalActivityTsRef.current = Date.now()

    const adaptiveThrottle = getAdaptiveThrottle(velocity)

    // For very large jumps, send an immediate frame first, then throttle
    const maxJumpPx = Math.abs(el.scrollTop - lastSentPosRef.current.top)
    if (maxJumpPx > 600) {
      // send first frame asap to avoid receiver lag
      sendScrollImmediate()
    }
    if (throttleTimerRef.current) clearTimeout(throttleTimerRef.current)
    throttleTimerRef.current = setTimeout(sendScroll, adaptiveThrottle)

    // Ensure continuous sync by always sending updates
    // No echo prevention - both sides can scroll simultaneously
  }, [calculateScrollVelocity, getAdaptiveThrottle, sendScroll, containerId])

  const attach = useCallback((el) => {
    if (!el) return
    scrollRef.current = el
  }, [])

  const setContainerReady = useCallback((ready) => {
    containerReadyRef.current = !!ready
  }, [])

  // Init observers for readiness
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const onSizeChange = () => {
      containerReadyRef.current = false
      markSizeStableSoon()
    }

    try {
      resizeObserverRef.current = new ResizeObserver(onSizeChange)
      resizeObserverRef.current.observe(el)
    } catch (error) {
      console.warn("[scroll-sync][error] ResizeObserver not supported:", error)
    }

    try {
      mutationObserverRef.current = new MutationObserver(onSizeChange)
      mutationObserverRef.current.observe(el, { childList: true, subtree: true, attributes: true })
    } catch (error) {
      console.warn("[scroll-sync][error] MutationObserver not supported:", error)
    }

    // IntersectionObserver: mark ready only when visible in viewport for smoother UX
    try {
      intersectionObserverRef.current = new IntersectionObserver((entries) => {
        const entry = entries[0]
        const isVisible = !!(entry && entry.isIntersecting && entry.intersectionRatio > 0)
        isVisibleRef.current = isVisible
        if (isVisible) {
          // If visible and scrollable, mark ready; this avoids abrupt jumps when offscreen
          const scrollable = (el.scrollHeight - el.clientHeight) > 0 || (el.scrollWidth - el.clientWidth) > 0
          if (scrollable) containerReadyRef.current = true
        }
      }, { threshold: [0, 0.01, 0.1] })
      intersectionObserverRef.current.observe(el)
    } catch (error) {
      // Older browsers: ignore
    }

    markSizeStableSoon()

    // rAF readiness: mark ready when element becomes scrollable without manual refresh
    const checkReady = () => {
      const node = scrollRef.current
      if (!node) return
      const scrollable = (node.scrollHeight - node.clientHeight) > 0 || (node.scrollWidth - node.clientWidth) > 0
      if (scrollable) {
        containerReadyRef.current = true
        return
      }
      rafReadyCheckRef.current = requestAnimationFrame(checkReady)
    }
    rafReadyCheckRef.current = requestAnimationFrame(checkReady)

    return () => {
      if (resizeObserverRef.current) resizeObserverRef.current.disconnect()
      if (mutationObserverRef.current) mutationObserverRef.current.disconnect()
      if (intersectionObserverRef.current) intersectionObserverRef.current.disconnect()
      if (sizeStableTimerRef.current) clearTimeout(sizeStableTimerRef.current)
      if (rafReadyCheckRef.current) cancelAnimationFrame(rafReadyCheckRef.current)
    }
  }, [markSizeStableSoon])

  // Bind local scroll events with instant control detection
  useEffect(() => {
    const el = scrollRef.current
    if (!el || !enabled) return

    const onScroll = () => {
      scrollEventQueueRef.current.push({ ts: Date.now() })
      processScrollQueue()
    }

    const onUserIntent = () => {
      const now = Date.now()
      lastLocalActivityTsRef.current = now

      if (!isScrollingRef.current) {
        isScrollingRef.current = true
        sendScrollImmediate()
        setTimeout(() => { isScrollingRef.current = false }, 120)
      }
    }

    el.addEventListener("scroll", onScroll, { passive: true })
    el.addEventListener("wheel", onUserIntent, { passive: true })
    el.addEventListener("pointerdown", onUserIntent, { passive: true })
    el.addEventListener("touchstart", onUserIntent, { passive: true })
    el.addEventListener("touchmove", onUserIntent, { passive: true })

    const onKey = (e) => {
      const keys = ['ArrowDown','ArrowUp','PageDown','PageUp','Home','End','Space']
      if (keys.includes(e.key)) onUserIntent()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      el.removeEventListener("scroll", onScroll)
      el.removeEventListener("wheel", onUserIntent)
      el.removeEventListener("pointerdown", onUserIntent)
      el.removeEventListener("touchstart", onUserIntent)
      el.removeEventListener("touchmove", onUserIntent)
      window.removeEventListener("keydown", onKey)
    }
  }, [enabled, processScrollQueue, sendScrollImmediate, containerId])

  // Ensure we subscribe to signals once session becomes available
  useEffect(() => {
    const session = openTokSessionSingleton.getSession?.()
    if (session) return
    const onSessionReady = () => setSessionReadyKey((k) => k + 1)
    try {
      openTokSessionSingleton.addListener?.('sessionInitialized', onSessionReady)
    } catch {}
    return () => {
      try { openTokSessionSingleton.removeListener?.('sessionInitialized', onSessionReady) } catch {}
    }
  }, [])

  // Flush any pending send once session is available
  useEffect(() => {
    const session = openTokSessionSingleton.getSession?.()
    if (!session) return
    if (pendingSendRef.current) {
      const payload = pendingSendRef.current
      pendingSendRef.current = null
      try {
        openTokSessionSingleton.sendSignal({ type: "scroll-sync", data: JSON.stringify(payload) }, () => {})
      } catch {}
    }
  }, [sessionReadyKey])

  // Container validation on mount/update
  useEffect(() => {
    const el = scrollRef.current
    if (!el) {
      console.warn("[scroll-sync] No element attached for containerId:", containerId)
      return  
    }
    const isScrollable = (el.scrollHeight - el.clientHeight) > 0 || (el.scrollWidth - el.clientWidth) > 0
    if (!isScrollable) {
      console.warn("[scroll-sync] Element is not scrollable:", containerId, {
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
      })
    }
  }, [containerId, enabled])

  // Auto-attach: if no element attached, try to detect a scrollable container automatically
  useEffect(() => {
    if (!enabled) return
    if (scrollRef.current) return

    const findScrollable = () => {
      // Priority selectors
      const selectors = [
        `[data-scroll-sync="${containerId}"]`,
        `[data-cobrowse-scroll]`,
        `.scroll-sync-${containerId}`,
      ]
      let el = null
      for (const sel of selectors) {
        el = document.querySelector(sel)
        if (el) break
      }
      if (!el) {
        // Fallback: choose the tallest scrollable element in the document
        const candidates = Array.from(document.querySelectorAll('*'))
          .filter((n) => n instanceof HTMLElement)
          .filter((n) => (n.scrollHeight - n.clientHeight) > 0 || (n.scrollWidth - n.clientWidth) > 0)
        if (candidates.length > 0) {
          candidates.sort((a, b) => (b.scrollHeight - b.clientHeight) - (a.scrollHeight - a.clientHeight))
          el = candidates[0]
        }
      }
      if (el) {
        scrollRef.current = el
        // trigger readiness pipeline for newly attached element
        try { el.dispatchEvent(new Event('scroll')) } catch {}
      }
    }

    // Initial attempt and observe DOM for late mounts
    findScrollable()
    // Use IntersectionObserver to smoothly react when a matching element appears in view
    let io
    try {
      io = new IntersectionObserver(() => {
        if (!scrollRef.current) findScrollable()
      }, { root: null, threshold: [0, 0.01] })
      // Observe broad candidates lightly; fall back to MutationObserver below if needed
      io.observe(document.documentElement)
    } catch {}

    const mo = new MutationObserver(() => {
      if (!scrollRef.current) findScrollable()
    })
    try { mo.observe(document.documentElement, { childList: true, subtree: true }) } catch {}
    return () => {
      try { mo.disconnect() } catch {}
      try { io && io.disconnect() } catch {}
    }
  }, [enabled, containerId])

  // OpenTok receiver
  useEffect(() => {
    if (!enabled) return

    const session = openTokSessionSingleton.getSession?.()
    if (!session) return

    const onRecv = (event) => {
      try {
        const data = JSON.parse(event.data || "{}")
        if (data.sourceId === localSourceId) return
        if (data.containerId !== containerId) return
        if (data.userType === userType) return

        console.info("[scroll-sync][recv]", containerId, data)

        // Basic validation
        if (!(data.ts && Math.abs(Date.now() - data.ts) < 1000)) return
        if (!(Number.isFinite(data.pxY) || Number.isFinite(data.percentY))) return

        applyRemote(data)
      } catch (e) {
        console.error("[scroll-sync][error] parse", e)
      }
    }

    session.on("signal:scroll-sync", onRecv)
    return () => {
      try {
        session.off("signal:scroll-sync", onRecv)
      } catch {}
    }
  }, [applyRemote, containerId, enabled, localSourceId, userType, sessionReadyKey])

  // Cleanup timers
  useEffect(
    () => () => {
      if (throttleTimerRef.current) clearTimeout(throttleTimerRef.current)
      if (rafApplyRef.current) cancelAnimationFrame(rafApplyRef.current)
    },
    [],
  )

  return {
    scrollRef,
    attach,
    syncStatus,
    setContainerReady,
  }
}
