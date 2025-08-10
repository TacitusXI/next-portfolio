---
title: "TACITVS Security Audit Report"
subtitle: "{{PROTOCOL_NAME}} Protocol Security Assessment"
author: "TACITVS"
date: "{{DATE}}"
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

{{PROTOCOL_DESCRIPTION}}

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
{{COMMIT_HASH}}
```

## Scope

```
{{SCOPE}}
```

## Roles

{{ROLES}}

# Executive Summary

**Objective:** {{AUDIT_OBJECTIVE}}

| Severity | Count |
|:--------:|:-----:|
| 🛑 High  |  {{HIGH_COUNT}}  |
| ⚠️ Medium |  {{MEDIUM_COUNT}}  |
| ⚡ Low   |  {{LOW_COUNT}}  |
| ℹ️ Info  |  {{INFO_COUNT}}  |
| **Total** | **{{TOTAL_COUNT}}** |

**Key Risk Areas:**
{{KEY_RISKS}}

**Top 3 Recommendations:**
{{TOP_RECOMMENDATIONS}}

## Issues Found

| Severity | Number of issues found |
| -------- | ---------------------- |
| High     | {{HIGH_COUNT}}         |
| Medium   | {{MEDIUM_COUNT}}       |
| Low      | {{LOW_COUNT}}          |
| Info     | {{INFO_COUNT}}         |
| Total    | {{TOTAL_COUNT}}        |

# Findings

## High

{{HIGH_FINDINGS}}

## Medium

{{MEDIUM_FINDINGS}}

## Low

{{LOW_FINDINGS}}

## Informational

{{INFO_FINDINGS}}