"use client";

export function SafariPersistBanner() {
  return (
    <div className="state-indicator-warning px-4 py-3 text-sm">
      <div className="mx-auto flex max-w-4xl items-start gap-2">
        <span className="text-lg">⚠️</span>
        <div>
          <strong className="micro-header mb-1 block">Storage persistence unavailable</strong>
          <p className="mt-0.5 opacity-90">
            Your browser (likely Safari) may clear your project data when
            storage is low. Your progress is safe for now, but consider
            exporting your project frequently.{" "}
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-75 transition-opacity"
            >
              Learn more
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
