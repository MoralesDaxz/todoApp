import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createInviteCode } from "../api/shareService";

export const useShareList = (listId: string | null) => {
  const [copied, setCopied] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const shareMutation = useMutation({
    mutationFn: (role: "read" | "write") => {
      if (!listId) throw new Error("ID de lista no válido");
      return createInviteCode(listId, role);
    },
    onSuccess: (data) => {
      setGeneratedCode(data.code);
      setCopied(false);
    },
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const resetShareState = () => {
    setGeneratedCode(null);
    setCopied(false);
  };

  return {
    generateCode: shareMutation.mutate,
    isGenerating: shareMutation.isPending,
    generatedCode,
    copied,
    copyToClipboard,
    resetShareState,
  };
};