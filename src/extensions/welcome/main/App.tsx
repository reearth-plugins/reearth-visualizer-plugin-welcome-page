import Welcome from "./components/Welcome";
import useHooks from "./hooks";

function App() {
  const { ready, data } = useHooks();

  return ready && data ? (
    <div className="absolute w-full h-full bg-white rounded-lg shadow-lg">
      <Welcome data={data} />
    </div>
  ) : null;
}

export default App;
