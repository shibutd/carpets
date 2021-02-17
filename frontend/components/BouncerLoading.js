export default function BouncerLoading(props) {
  const { totalHeight } = props
  return (
    <div style={{ height: totalHeight}} className="bouncer-loading">
      <div style={{...props}} />
      <div style={{...props}} />
      <div style={{...props}} />
      <div style={{...props}} />
    </div>
  )
}