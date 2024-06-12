// Connect to the Ethereum network
async function connect() {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            return { provider, signer };
        } catch (error) {
            console.error("User denied account access");
        }
    } else {
        console.error("No Ethereum browser extension detected");
    }
}

async function fetchCandidates(contract) {
    const candidatesCount = await contract.candidatesCount();
    const candidatesList = document.getElementById("candidates");
    candidatesList.innerHTML = '';
    for (let i = 1; i <= candidatesCount; i++) {
        const candidate = await contract.candidates(i);
        const li = document.createElement("li");
        li.textContent = `ID: ${candidate[0]}, Name: ${candidate[1]}, Votes: ${candidate[2]}`;
        candidatesList.appendChild(li);
    }
}

async function vote(contract, candidateId) {
    try {
        const tx = await contract.vote(candidateId);
        await tx.wait();
        alert("Vote cast successfully!");
        fetchCandidates(contract);
    } catch (error) {
        console.error(error);
        alert("Error casting vote. Please try again.");
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const { provider, signer } = await connect();
    const contractAddress = 'YOUR_CONTRACT_ADDRESS';
    const abi = [
        "event votedEvent(uint indexed candidateId)",
        "function candidates(uint) view returns (uint, string memory, uint)",
        "function candidatesCount() view returns (uint)",
        "function vote(uint) public"
    ];
    const contract = new ethers.Contract(contractAddress, abi, signer);

    fetchCandidates(contract);

    document.getElementById("voteForm").addEventListener("submit", (event) => {
        event.preventDefault();
        const candidateId = document.getElementById("candidateId").value;
        vote(contract, candidateId);
    });
});
