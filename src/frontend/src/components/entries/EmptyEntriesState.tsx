export default function EmptyEntriesState() {
  return (
    <div className="text-center py-12 space-y-4">
      <div className="flex justify-center">
        <img
          src="/assets/generated/empty-entries.dim_800x600.png"
          alt="No entries"
          className="w-48 h-auto opacity-60"
        />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">No meals logged yet</h3>
        <p className="text-sm text-muted-foreground">
          Start tracking by adding an entry or scanning food with your camera
        </p>
      </div>
    </div>
  );
}
