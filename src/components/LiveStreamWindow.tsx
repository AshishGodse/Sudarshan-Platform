"use client";

import { useEffect, useState } from "react";
import { YouTubeLiveStream } from "@/lib/youtube";

interface LiveStreamWindowProps {
  channelId: string;
  channelName: string;
}

export function LiveStreamWindow({ channelId, channelName }: LiveStreamWindowProps) {
  const [stream, setStream] = useState<YouTubeLiveStream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLiveStream = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/channels/${channelId}/live`);
        const data = await response.json();

        if (data.success) {
          setStream(data.data);
        } else {
          setError(data.error || "Failed to load stream");
        }
      } catch (err) {
        setError("Error loading stream");
      } finally {
        setLoading(false);
      }
    };

    fetchLiveStream();

    // Refresh every 5 minutes to check for new streams
    const interval = setInterval(fetchLiveStream, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [channelId]);

  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-gray-900 h-full flex flex-col">
      {/* Header - Fixed Height */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 flex items-start justify-between h-20">
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="text-white font-semibold text-sm line-clamp-2">{channelName}</h3>
          {stream && (
            <p className="text-red-100 text-xs truncate">
              {stream.title}
            </p>
          )}
        </div>
        {stream?.isLive && (
          <div className="flex items-center gap-1 bg-red-800 px-3 py-1 rounded-full flex-shrink-0">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-white text-xs font-bold">LIVE</span>
          </div>
        )}
      </div>

      {/* Video Container - Fixed Height */}
      <div className="flex-1 bg-black flex items-center justify-center relative h-72">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            <p className="text-gray-400 mt-4 text-sm">Loading stream...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <div className="text-gray-400 mb-2">⚠️</div>
            <p className="text-gray-400 text-sm">{error}</p>
          </div>
        ) : stream ? (
          <div className="w-full h-full">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${stream.videoId}?autoplay=0`}
              title={stream.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-none"
            ></iframe>
          </div>
        ) : null}
      </div>

      {/* Footer Info - Fixed Height */}
      {stream && !error && (
        <div className="bg-gray-800 px-4 py-3 border-t border-gray-700 text-sm h-20 flex flex-col justify-between">
          <div className="flex items-start justify-between flex-1 min-w-0">
            <div className="flex-1 min-w-0">
              <p className="text-gray-200 font-semibold line-clamp-2 text-xs mb-1">
                {stream.title}
              </p>
              {stream.stats?.viewCount && (
                <p className="text-gray-400 text-xs">
                  👁️ {parseInt(stream.stats.viewCount).toLocaleString()} views
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
