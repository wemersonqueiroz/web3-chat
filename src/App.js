import React, { useEffect, useState } from "react"
import "./main.css"

import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js"
import { Program, Provider, web3 } from "@project-serum/anchor"
import idl from "./idl.json"
import kp from "./keypair.json"

// Constants
const { SystemProgram, Keypair } = web3
const arr = Object.values(kp._keypair.secretKey)
const secret = new Uint8Array(arr)
const baseAccount = web3.Keypair.fromSecretKey(secret)
const programID = new PublicKey(idl.metadata.address)
const network = clusterApiUrl("devnet")

const App = () => {
  //STATE
  const [walletAddress, setWalletAddress] = useState(null)

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window
      if (solana) {
        const response = await solana.connect()
        console.log("Connected with Public key", response.publicKey.toString())
        setWalletAddress(response.publicKey.toString())
        if (solana.isPhantom) {
          console.log("Phantom wallet found")

          const response = await solana.connect({ onlyIfTrusted: true })

          setWalletAddress(response.publicKey.toString())
        }
      } else {
        alert("Solana object not found! ")
      }
    } catch (error) {
      console.error(error)
    }
  }

  const connectWallet = async () => {}

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button mt-4"
      onClick={connectWallet}>
      Connect to Wallet
    </button>
  )

  const renderConnectedContainer = () => {
    return (
      <div className="connected-container">
        <form>
          <input type="text" placeholder="Enter gif link!" />
          <button type="submit" className="cta-button submit-gif-button">
            Submit
          </button>
        </form>
      </div>
    )
  }

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected()
    }
    window.addEventListener("load", onLoad)
    return () => window.removeEventListener("load", onLoad)
  }, [])

  // const getGifList = async () => {
  //   try {
  //     const provider = getProvider()
  //     const program = new Program(idl, programID, provider)
  //     const account = await program.account.baseAccount.fetch(
  //       baseAccount.publicKey
  //     )

  //     console.log("Got the account", account)
  //     setGifList(account.gifList)
  //   } catch (error) {
  //     console.log("Error in getGifList: ", error)
  //     setGifList(null)
  //   }
  // }

  return (
    <div className="App mx-auto">
      <div className={walletAddress ? "container " : "container"}>
        <div className="header-container">
          <p className="header">💬 Web3 Chat</p>
          <p className="sub-text">Chat using Blockchain </p>
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container text-white">💬 Web3 Chat</div>
      </div>
    </div>
  )
}

export default App
