# ERC Tokens with On-Chain Stats Tracking

This project contains the implementation of three types of tokens: **ERC20**, **ERC721**, and **ERC1155**, with additional variables responsible for storing on-chain statistics. Each token implements essential methods from the respective standards, along with extra mechanisms for collecting and tracking data regarding user activity on the blockchain.

## Description

The project implements three different token standards:

- **ERC20** - A standard for interchangeable tokens. It includes all basic functions like transfers, balance tracking, and approvals.
- **ERC721** - A standard for non-fungible tokens (NFTs). It includes methods for minting, transferring, and managing NFT tokens.
- **ERC1155** - A standard for multi-token types (supports both fungible and non-fungible tokens). It offers additional functionality for managing batches of tokens.

In addition, each of these tokens is enhanced with variables and methods that allow the collection of on-chain statistics, such as the number of transfers, the number of tokens owned by a user, and other operational data.

### Key Features:

- Implemented essential methods for ERC20, ERC721, and ERC1155 standards.
- Mechanisms for on-chain stat tracking to monitor user actions and store data on the blockchain.
- Integration with popular testing frameworks like Truffle.

### Prerequisites

- Solidity (0.8.0)
- Ethereum network (Testnet or Mainnet)
- Truffle (v5.11.5)
- npm (10.9.0)
- Node (v23.0.0)

## Tests

Tests for the contracts can be executed using Truffle. After setting up the project and installing dependencies, you can run the tests:

```bash
truffle test
```
