import Welcome from "../../../components/Welcome";

import useHooks from "./hooks";

function App() {
  const { ready, data } = useHooks();
  // console.log("data",data);

  return ready && data ? (
    <div className="absolute w-full h-full bg-white rounded-lg">
      <Welcome data={data} />
    </div>
  ) : null;
}

export default App;
