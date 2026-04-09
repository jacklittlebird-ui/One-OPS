import { useChannel } from "@/contexts/ChannelContext";

/**
 * Returns true when the current channel should have read-only access
 * to reference data pages (Airlines, Aircrafts, Aircraft Types, Airports, etc.).
 */
export function useReadOnly(): boolean {
  const { activeChannel } = useChannel();
  // Channels that get read-only access to reference data
  const readOnlyChannels = ["clearance"];
  return readOnlyChannels.includes(activeChannel);
}
