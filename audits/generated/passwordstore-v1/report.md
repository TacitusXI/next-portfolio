---
title: "TACITVS Security Audit Report"
subtitle: "PasswordStore Protocol Security Assessment"
author: "TACITVS"
date: "2024-01-08"
---

Prepared by: [TACITVS](https://tacitvs.eth.limo/) Lead Security Researcher: - I.Leskov(TACITVS)

# Table of Contents

- [Table of Contents](#table-of-contents)
- [Protocol Summary](#protocol-summary)
- [Disclaimer](#disclaimer)
- [Risk Classification](#risk-classification)
- [Audit Details](#audit-details)
  - [Commit Hash](#commit-hash)
  - [Scope](#scope)
  - [Roles](#roles)
- [Executive Summary](#executive-summary)
  - [Issues Found](#issues-found)
- [Findings](#findings)
  - [High](#high)
  - [Medium](#medium)
  - [Low](#low)
  - [Informational](#informational)

# Protocol Summary

PasswordStore is a protocol dedicated to storage and retrieval of a user's passwords. The protocol is designed to be used by a single user, and not designed to be used by multiple users. Only the owner should be able to set and access this password.

# Disclaimer

The TACITVS team makes all effort to find as many vulnerabilities in the code in the given time period, but holds no responsibilities for the findings provided in this document. A security audit by the team is not an endorsement of the underlying business or product. The audit was time-boxed and the review of the code was solely on the security aspects of the Solidity implementation of the contracts.

# Risk Classification

| **Likelihood** \ **Impact** | **High** | **Medium** | **Low** |
|:---------------------------|:--------:|:----------:|:-------:|
| **High**                   |    H     |    H/M     |    M    |
| **Medium**                 |   H/M    |     M      |   M/L   |
| **Low**                    |    M     |    M/L     |    L    |

We use the [CodeHawks](https://docs.codehawks.com/hawks-auditors/how-to-evaluate-a-finding-severity) severity matrix to determine severity. See the documentation for more details.

# Audit Details

## Commit Hash

```
7d55682ddc4301a7b13ae9413095feffd9924566
```

## Scope

```
./src/
|-- PasswordStore.sol
```

## Roles

- Owner: The user who can set the password and read the password.
- Outsiders: No one else should be able to set or read password.

# Executive Summary

**Objective:** Comprehensive security review of the PasswordStore v1.0 smart contract for access control vulnerabilities, data privacy issues, and code quality assessment.

| Severity | Count |
|:--------:|:-----:|
| 🛑 High  |  2  |
| ⚠️ Medium |  0  |
| ⚡ Low   |  0  |
| ℹ️ Info  |  1  |
| **Total** | **3** |

**Key Risk Areas:**
- **Critical Access Control Gaps:** Missing owner-only restrictions
- **Data Privacy Violations:** On-chain password storage
- **Documentation Inconsistencies:** Misleading NatSpec comments

**Top 3 Recommendations:**
1. Implement proper access control with `onlyOwner` modifier
2. Reconsider the fundamental architecture for password privacy
3. Update documentation to match actual function signatures

## Issues Found

| Severity | Number of issues found |
| -------- | ---------------------- |
| High     | 2         |
| Medium   | 0       |
| Low      | 0          |
| Info     | 1         |
| Total    | 3        |

# Findings

## High

\begin{HighFinding}
\textbf{[H-1] Password Storage on Public Blockchain}

All data stored on-chain is visible to anyone. The \passthrough{\lstinline!PasswordStore::s_password!} variable can be read directly from blockchain storage, completely breaking the protocol's privacy.
\end{HighFinding}

**Impact:** Anyone can read the private password, severely breaking the functionality of the protocol.

**Proof of Concept:** The below test case shows how anyone can read the password directly from the blockchain.

1. Create a locally running chain:
   ```bash
   make anvil
   ```

2. Deploy the contract to the chain:
   ```bash
   make deploy
   ```

3. Run the storage tool (slot 1 for `s_password`):
   ```bash
   cast storage <CONTRACT_ADDRESS_HERE> 1
   ```

**Recommended Mitigation:** Due to this, the overall architecture of the contract should be rethought. One could encrypt the password off-chain, and then store the encrypted password on-chain.

\begin{HighFinding}
\textbf{[H-2] Missing Access Control on setPassword()}

The \passthrough{\lstinline!PasswordStore::setpassword!} function lacks \passthrough{\lstinline!onlyOwner!} modifier, allowing anyone to change the password and break the contract's intended functionality.
\end{HighFinding}

**Impact:** Anyone can set/change the password of the contract, severely breaking the contract intended functionality.

**Recommended Mitigation:** Add an access control conditional to the `setPassword` function.

## Medium

No medium severity findings were identified during this audit.

## Low

No low severity findings were identified during this audit.

## Informational

\begin{InfoFinding}
\textbf{[I-1] Incorrect NatSpec Documentation}

The \passthrough{\lstinline!PasswordStore::getPassword!} function documentation incorrectly specifies a parameter that doesn't exist in the function signature.
\end{InfoFinding}

**Description:** The `PasswordStore::getPassword` function signature is `getPassword()` which the natspec say it should be `getPassword(string)`.

**Impact:** The natspec is incorrect.

**Recommended Mitigation:** Remove the incorrect natspec line.