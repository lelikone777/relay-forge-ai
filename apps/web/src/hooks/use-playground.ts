"use client";

import { useCallback, useRef, useState } from "react";

import type { ChatRequest, ErrorResponse, ResponseMeta, StrategyId } from "@relayforge/shared";

import { postChat } from "@/lib/api";
import { streamRelayResponse } from "@/lib/sse";

type UiError = ErrorResponse["error"];

type SubmitArgs = {
  prompt: string;
  strategy: StrategyId;
  streamingEnabled: boolean;
};

const defaultError = (message: string): UiError => ({
  code: "internal_error",
  message,
  timestamp: new Date().toISOString()
});

export function usePlayground() {
  const [responseText, setResponseText] = useState("");
  const [responseMeta, setResponseMeta] = useState<ResponseMeta | null>(null);
  const [error, setError] = useState<UiError | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [requestStartedAt, setRequestStartedAt] = useState<string | null>(null);
  const lastRequestRef = useRef<SubmitArgs | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const submit = useCallback(async ({ prompt, strategy, streamingEnabled }: SubmitArgs) => {
    const body: ChatRequest = {
      prompt,
      options: {
        strategy,
        stream: streamingEnabled,
        maxTokens: 512,
        temperature: 0.35
      },
      metadata: {
        source: "relayforge-web"
      }
    };

    lastRequestRef.current = { prompt, strategy, streamingEnabled };
    setRequestStartedAt(new Date().toISOString());
    setResponseText("");
    setResponseMeta(null);
    setError(null);

    if (!streamingEnabled) {
      setIsStreaming(false);

      try {
        const response = await postChat(body);
        setResponseText(response.data.text);
        setResponseMeta(response.data.meta);
      } catch (cause) {
        setError(defaultError(cause instanceof Error ? cause.message : "Request failed."));
      }

      return;
    }

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsStreaming(true);

    try {
      await streamRelayResponse(body, controller.signal, (event) => {
        if (event.type === "token") {
          setResponseText((current) => current + event.value);
          return;
        }

        if (event.type === "meta") {
          setResponseMeta(event.value);
          return;
        }

        if (event.type === "error") {
          setError(event.value);
        }
      });
    } catch (cause) {
      if (controller.signal.aborted) {
        setError({
          code: "stream_interrupted",
          message: "Streaming was stopped before completion.",
          timestamp: new Date().toISOString()
        });
      } else {
        setError(defaultError(cause instanceof Error ? cause.message : "Streaming failed."));
      }
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }

      setIsStreaming(false);
    }
  }, []);

  const stop = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const retry = useCallback(async () => {
    if (!lastRequestRef.current) {
      return;
    }

    await submit(lastRequestRef.current);
  }, [submit]);

  const clear = useCallback(() => {
    abortControllerRef.current?.abort();
    setResponseText("");
    setResponseMeta(null);
    setError(null);
    setIsStreaming(false);
    setRequestStartedAt(null);
  }, []);

  return {
    responseText,
    responseMeta,
    error,
    isStreaming,
    requestStartedAt,
    submit,
    stop,
    retry,
    clear
  };
}

