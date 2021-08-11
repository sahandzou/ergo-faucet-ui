import React from "react";
import "./App.css";
import { useState } from "react";
import axios from "axios";
import { useInterval } from "./hooks/useInterval";

const baseApi = "https://gettoken.ergopool.io/dexToken/address/";
const waitError = "please wait and try later";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [trxUrl, setTrxUrl] = useState(false);
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  useInterval(() => {
    if (isLoading) {
      axios
        .get(baseApi + address)
        .then(({ data }) => {
          if (!data.txId && data.success === false) {
            return;
          }
          setTrxUrl(data.txId);
          setIsLoading(false);
        })
        .catch((err) => {
          if (
            err.response?.data?.message === waitError &&
            err.response?.data?.success === false
          ) {
            return;
          }

          if (err.response?.data?.message) {
            setError(err.response?.data?.message);
            setIsLoading(false);
          }
        });
    }
  }, 3 * 1000);

  function handleClick() {
    if (!address) {
      setError("Type address");
      return;
    }

    setIsLoading(true);
  }

  return (
    <div className="container">
      <div className="main-input-container">
        <label className="main-input-label">
          Enter wallet address
          <input
            className={`main-input ${error && "error"}`}
            value={address}
            disabled={isLoading}
            onChange={({ target }) => {
              setError("");
              setAddress(target.value);
            }}
            type="text"
          />
        </label>
      </div>
      <div className="main-button-container">
        <button
          className="main-button"
          onClick={handleClick}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading">
              <span />
              <span />
            </span>
          ) : (
            "Get Beta Tokens"
          )}
        </button>
      </div>
      {error && <div className="error">{error}</div>}
      {isLoading && (
        <div className="message">
          Please wait, you will receive your tokens soon. Do not close the page.
        </div>
      )}
      {!isLoading && trxUrl && (
        <div className="message">
          Tokens successfully received.{" "}
          <a
            className="main-link"
            href={trxUrl}
            target="_blank"
            rel="noreferrer"
          >
            View transaction on explorer
          </a>
        </div>
      )}
    </div>
  );
}

export default App;