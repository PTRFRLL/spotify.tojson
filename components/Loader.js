import { Audio } from "react-loader-spinner";

export default function Loader() {
    return (
      <>
        <Audio height="100" width="100" color="grey" ariaLabel="loading" />
        <h1>Loading...</h1>
      </>
    );
  }