export default function Header({ user }) {
  return (
    <div>
      Hello, { user ? user : 'stranger' }!
    </div>
  )
}