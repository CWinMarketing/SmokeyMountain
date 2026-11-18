type Props = {
  metadata: Record<string, unknown> | null | undefined
}

function formatLabel(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function formatValue(value: unknown) {
  if (Array.isArray(value)) return value.join(", ")
  if (typeof value === "boolean") return value ? "Yes" : "No"
  return String(value)
}

// Renders a Sim product's technical specs from its metadata (set at seed
// time, see backend seed.ts) - compatible platforms, connection type, etc.
export default function SpecSheet({ metadata }: Props) {
  const entries = Object.entries(metadata || {})
  if (!entries.length) return null

  return (
    <div className="rounded-md border border-ui-border-base">
      <table className="w-full text-sm">
        <tbody>
          {entries.map(([key, value]) => (
            <tr key={key} className="border-b border-ui-border-base last:border-0">
              <td className="px-4 py-2 font-medium text-ui-fg-subtle">
                {formatLabel(key)}
              </td>
              <td className="px-4 py-2">{formatValue(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
