// ===== DOM =====
const connectBtn = document.getElementById("connectBtn");
const disconnectBtn = document.getElementById("disconnectBtn");

const addressEl = document.getElementById("address");
const networkEl = document.getElementById("network");
const balanceEl = document.getElementById("balance");
const identityEl = document.getElementById("identity");
const statusEl = document.getElementById("status");

// ===== IDENTITAS SAYA =====
const FULL_NAME = "Rizky Andriyanto";
const NIM = "231011401883";

// ===== STATE =====
let currentAccount = null;

// ===== HELPER =====
function shortenAddress(addr) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

function formatBalance(hex) {
  return (parseInt(hex, 16) / 1e18).toFixed(4);
}

function setStatus(text, type) {
  statusEl.textContent = text;
  statusEl.className = `status ${type}`;
}

function setConnectedUI(isConnected) {
  if (isConnected) {
    connectBtn.textContent = "Connected";
    connectBtn.disabled = true;
    disconnectBtn.disabled = false;
  } else {
    connectBtn.textContent = "Connect Wallet";
    connectBtn.disabled = false;
    disconnectBtn.disabled = true;
  }
}

function resetUI() {
  currentAccount = null;

  addressEl.textContent = "-";
  networkEl.textContent = "-";
  balanceEl.textContent = "-";
  identityEl.textContent = "";

  setConnectedUI(false);
  setStatus("Not Connected", "warning");
}

// ===== CONNECT =====
async function connectWallet() {
  if (!window.ethereum) {
    setStatus("Wallet not detected", "error");
    return;
  }

  try {
    setStatus("Connecting...", "warning");

    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    currentAccount = accounts[0];

    // Render UI
    addressEl.textContent = shortenAddress(currentAccount);
    identityEl.textContent = `${FULL_NAME} - ${NIM}`;

    await loadNetwork();
    await loadBalance();

    setConnectedUI(true);
    setStatus("Connected", "success");
  } catch (err) {
    console.error(err);
    setStatus("Connection Failed", "error");
  }
}

// ===== NETWORK =====
async function loadNetwork() {
  const chainId = await ethereum.request({ method: "eth_chainId" });

  if (chainId === "0xa869") {
    networkEl.textContent = "Avalanche Fuji Testnet";
  } else if (chainId === "0xa86a") {
    networkEl.textContent = "Avalanche Mainnet";
  } else {
    networkEl.textContent = "Unknown Network";
  }
}

// ===== BALANCE =====
async function loadBalance() {
  const balanceHex = await ethereum.request({
    method: "eth_getBalance",
    params: [currentAccount, "latest"],
  });

  balanceEl.textContent = formatBalance(balanceHex);
}

// ===== DISCONNECT (FRONTEND ONLY) =====
function disconnectWallet() {
  resetUI();
}

// ===== EVENTS =====
connectBtn.addEventListener("click", connectWallet);
disconnectBtn.addEventListener("click", disconnectWallet);

// ===== INIT (IMPORTANT) =====
resetUI();
