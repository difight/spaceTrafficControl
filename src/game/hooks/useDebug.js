import { useDebug } from "../ui/DebugProvider";

export const useGlobalDebug = () => {
  const { addMessage, clearMessages } = useDebug();
  return { log: addMessage, clear: clearMessages };
};