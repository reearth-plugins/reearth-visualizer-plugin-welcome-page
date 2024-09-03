import useHooks from "./hooks";

function App() {
  const { ready } = useHooks();

  // Ref
  // https://ui.shadcn.com/blocks
  return ready ? (
    <div className="absolute w-full h-full bg-white rounded-lg">Content</div>
  ) : null;
}

export default App;
