"use client";

import { useState, useEffect } from "react";
import { LiveStreamWindow } from "@/components/LiveStreamWindow";
import { DarshanChannel } from "@/lib/storage";

export function LiveDarshanPage() {
  const [channels, setChannels] = useState<DarshanChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newChannel, setNewChannel] = useState({
    name: "",
    channelId: "",
    description: "",
  });

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/channels");
      const data = await response.json();
      if (data.success) {
        setChannels(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch channels:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddChannel = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newChannel.name || !newChannel.channelId) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch("/api/channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newChannel),
      });

      if (response.ok) {
        const data = await response.json();
        setChannels([...channels, data.data]);
        setNewChannel({ name: "", channelId: "", description: "" });
        setShowAddForm(false);
      } else {
        alert("Failed to add channel");
      }
    } catch (error) {
      alert("Error adding channel");
    }
  };

  const handleDeleteChannel = async (id: string) => {
    if (!confirm("Are you sure you want to delete this channel?")) return;

    try {
      const response = await fetch(`/api/channels/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setChannels(channels.filter((ch) => ch.id !== id));
      } else {
        alert("Failed to delete channel");
      }
    } catch (error) {
      alert("Error deleting channel");
    }
  };

  if (loading && channels.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-700 to-red-900 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">🙏 Live Darshan</h1>
              <p className="text-red-100 text-sm mt-1">Experience sacred live feeds from temples</p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-white text-red-700 px-6 py-2 rounded-lg font-semibold hover:bg-red-50 transition"
            >
              {showAddForm ? "Close" : "+ Add Channel"}
            </button>
          </div>
        </div>
      </header>

      {/* Add Channel Form */}
      {showAddForm && (
        <div className="bg-gray-900 border-b border-gray-800 sticky top-[100px] z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <form onSubmit={handleAddChannel} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Temple/Channel Name"
                  value={newChannel.name}
                  onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-600"
                  required
                />
                <input
                  type="text"
                  placeholder="YouTube Channel ID"
                  value={newChannel.channelId}
                  onChange={(e) => setNewChannel({ ...newChannel, channelId: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-600"
                  required
                />
              </div>
              <textarea
                placeholder="Description (optional)"
                value={newChannel.description}
                onChange={(e) => setNewChannel({ ...newChannel, description: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-600 resize-none"
                rows={2}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold transition"
                >
                  Add Channel
                </button>
                <p className="text-gray-400 text-sm self-center">
                  💡 Tip: Find YouTube Channel ID from the channel URL: youtube.com/@{" "}
                  <span className="text-red-400">CHANNEL_ID</span>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {channels.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🕉️</div>
            <h2 className="text-2xl font-bold mb-2">No channels added yet</h2>
            <p className="text-gray-400 mb-6">Add your first temple channel to get started</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Add First Channel
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-400 text-sm">
                {channels.length} channel{channels.length !== 1 ? "s" : ""} loaded
              </p>
            </div>

            {/* Grid Layout - Responsive */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
              {channels.map((channel) => (
                <div key={channel.id} className="relative group">
                  <LiveStreamWindow channelId={channel.id} channelName={channel.name} />
                  
                  {/* Delete button on hover */}
                  <button
                    onClick={() => handleDeleteChannel(channel.id)}
                    className="absolute top-2 right-2 bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition z-10"
                  >
                    ✕ Delete
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
          <p>🙏 Sudarshan Platform - Experience Sacred Live Feeds</p>
          <p className="mt-2">For support, contact: support@sudarshan.local</p>
        </div>
      </footer>
    </div>
  );
}
