"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface LoadingProps {
  message?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  videoSrc?: string;
}

const sizeMap = {
  sm: "w-48", // 192px
  md: "w-64", // 256px
  lg: "w-96", // 384px
};

export function Loading({
  message = "로딩 중...",
  className,
  size = "md",
  videoSrc = "/videos/loading_video.mp4",
}: LoadingProps) {
  const [videoError, setVideoError] = useState(false);

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="text-center">
        <div className={cn("mx-auto mb-4", sizeMap[size])}>
          {!videoError ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain rounded-lg"
              onError={() => setVideoError(true)}
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          ) : (
            <div
              className={cn(
                "border-4 border-[#81C784] border-t-transparent animate-spin rounded-full mx-auto",
                sizeMap[size]
              )}
            />
          )}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>
      </div>
    </div>
  );
}

export function FullScreenLoading({
  message = "로딩 중...",
  className,
  size = "md",
  videoSrc,
}: LoadingProps) {
  return (
    <div className={cn("min-h-screen w-full flex items-center justify-center", className)}>
      <Loading message={message} size={size} videoSrc={videoSrc} />
    </div>
  );
}
