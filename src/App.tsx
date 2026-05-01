import Background from "./components/Background";
import Form from "./components/Form";
import Main from "./components/Main";

function App() {
  return (
    <Main>
      <Form />
      <Background
        color="#00AAE8"
        animationDuration="35s"
        className="-bottom-35 opacity-20"
        alternate={true}
      />
      <Background
        color="#0071CD"
        animationDuration="25s"
        className="-bottom-50 opacity-50"
        alternate={true}
      />
      <Background
        color="#007ECD"
        animationDuration="15s"
        className="-bottom-50"
      />
      <Background
        color="#0071CD"
        animationDuration="38s"
        className="-bottom-60"
      />
    </Main>
  );
}

export default App;
